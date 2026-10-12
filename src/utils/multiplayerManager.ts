import { Question, SubjectId, StandardDifficulty } from '../types';
import { getQuizQuestions } from '../data/questions';

export interface MultiplayerPlayerState {
  id: string;
  username: string;
  avatarSeed: string;
  score: number;
  isHost: boolean;
  isReady: boolean;
  selectedAnswer: number | null; // 0..3 or null
  answerTimeSeconds: number | null;
  lastActive: number;
}

export interface MultiplayerRoomState {
  roomCode: string;
  hostId: string;
  hostUsername: string;
  subject: SubjectId | 'all';
  subjectName: string;
  standard: StandardDifficulty;
  maxPlayers: number;
  status: 'lobby' | 'playing' | 'round_result' | 'finished';
  currentQuestionIndex: number;
  totalQuestions: number;
  questions: Question[];
  players: MultiplayerPlayerState[];
  roundTimeLimit: number; // e.g. 15 seconds per question
  roundStartTime: number;
  createdAt: number;
}

type RoomEventListener = (room: MultiplayerRoomState | null) => void;

class MultiplayerManager {
  private channel: BroadcastChannel | null = null;
  private currentRoom: MultiplayerRoomState | null = null;
  private myPlayerId: string;
  private listeners: Set<RoomEventListener> = new Set();
  private storagePrefix = 'quizverse_mp_room_';

  constructor() {
    this.myPlayerId = this.getOrCreatePlayerId();
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel('quizverse_mp_channel');
        this.channel.onmessage = (event) => {
          this.handleBroadcastMessage(event.data);
        };
      } catch (e) {
        console.warn('BroadcastChannel error, falling back to storage sync:', e);
      }

      window.addEventListener('storage', (e) => {
        if (e.key && e.key.startsWith(this.storagePrefix)) {
          if (this.currentRoom && e.key === `${this.storagePrefix}${this.currentRoom.roomCode}`) {
            try {
              if (e.newValue) {
                const updated: MultiplayerRoomState = JSON.parse(e.newValue);
                this.currentRoom = updated;
                this.notifyListeners();
              }
            } catch {
              // ignore
            }
          }
        }
      });
    }
  }

  private getOrCreatePlayerId(): string {
    if (typeof window === 'undefined') return 'p_' + Math.random().toString(36).substring(2, 9);
    let id = sessionStorage.getItem('quizverse_mp_player_id');
    if (!id) {
      id = 'p_' + Math.random().toString(36).substring(2, 9);
      sessionStorage.setItem('quizverse_mp_player_id', id);
    }
    return id;
  }

  public getPlayerId(): string {
    return this.myPlayerId;
  }

  public subscribe(listener: RoomEventListener): () => void {
    this.listeners.add(listener);
    listener(this.currentRoom);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    this.listeners.forEach((l) => l(this.currentRoom));
  }

  private broadcast(type: string, payload: unknown) {
    if (this.channel) {
      this.channel.postMessage({ type, payload, senderId: this.myPlayerId });
    }
  }

  private saveRoomToStorage(room: MultiplayerRoomState) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(`${this.storagePrefix}${room.roomCode}`, JSON.stringify(room));
    } catch {
      // storage full
    }
  }

  private getRoomFromStorage(code: string): MultiplayerRoomState | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(`${this.storagePrefix}${code.toUpperCase()}`);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  private handleBroadcastMessage(data: { type: string; payload: any; senderId: string }) {
    if (!data || !data.type) return;

    if (data.type === 'ROOM_SYNC') {
      const incoming: MultiplayerRoomState = data.payload;
      if (this.currentRoom && this.currentRoom.roomCode === incoming.roomCode) {
        this.currentRoom = incoming;
        this.notifyListeners();
      }
    } else if (data.type === 'PLAYER_JOINED') {
      if (this.currentRoom && this.currentRoom.roomCode === data.payload.roomCode) {
        // If I am the host, update player list and broadcast sync
        if (this.currentRoom.hostId === this.myPlayerId) {
          const newPlayer: MultiplayerPlayerState = data.payload.player;
          const exists = this.currentRoom.players.some((p) => p.id === newPlayer.id);
          if (!exists && this.currentRoom.players.length < this.currentRoom.maxPlayers) {
            this.currentRoom.players.push(newPlayer);
            this.saveRoomToStorage(this.currentRoom);
            this.broadcast('ROOM_SYNC', this.currentRoom);
            this.notifyListeners();
          }
        }
      }
    } else if (data.type === 'PLAYER_ANSWER') {
      if (this.currentRoom && this.currentRoom.roomCode === data.payload.roomCode) {
        if (this.currentRoom.hostId === this.myPlayerId) {
          const { playerId, answerIndex, timeRemaining } = data.payload;
          const p = this.currentRoom.players.find((item) => item.id === playerId);
          if (p && p.selectedAnswer === null) {
            p.selectedAnswer = answerIndex;
            p.answerTimeSeconds = timeRemaining;
            const currentQ = this.currentRoom.questions[this.currentRoom.currentQuestionIndex];
            if (currentQ && answerIndex === currentQ.correctIndex) {
              const speedBonus = Math.max(0, Math.floor(timeRemaining * 0.5));
              p.score += 10 + speedBonus;
            }
            this.saveRoomToStorage(this.currentRoom);
            this.broadcast('ROOM_SYNC', this.currentRoom);
            this.notifyListeners();
          }
        }
      }
    }
  }

  // Generate 6-char alphanumeric room code
  public generateRoomCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  public createRoom(
    hostUsername: string,
    subjectId: SubjectId | 'all',
    subjectName: string,
    standard: StandardDifficulty,
    maxPlayers: number = 4
  ): MultiplayerRoomState {
    const code = this.generateRoomCode();
    const questions = getQuizQuestions(subjectId, standard, true);

    const hostPlayer: MultiplayerPlayerState = {
      id: this.myPlayerId,
      username: hostUsername,
      avatarSeed: hostUsername.slice(0, 2).toUpperCase(),
      score: 0,
      isHost: true,
      isReady: true,
      selectedAnswer: null,
      answerTimeSeconds: null,
      lastActive: Date.now(),
    };

    const room: MultiplayerRoomState = {
      roomCode: code,
      hostId: this.myPlayerId,
      hostUsername,
      subject: subjectId,
      subjectName,
      standard,
      maxPlayers,
      status: 'lobby',
      currentQuestionIndex: 0,
      totalQuestions: 10,
      questions,
      players: [hostPlayer],
      roundTimeLimit: 15,
      roundStartTime: 0,
      createdAt: Date.now(),
    };

    this.currentRoom = room;
    this.saveRoomToStorage(room);
    this.broadcast('ROOM_SYNC', room);
    this.notifyListeners();

    return room;
  }

  public joinRoom(roomCode: string, username: string): { success: boolean; error?: string } {
    const code = roomCode.trim().toUpperCase();
    const room = this.getRoomFromStorage(code);

    if (!room) {
      return { success: false, error: 'Room not found. Check the code and try again.' };
    }

    if (room.status !== 'lobby') {
      return { success: false, error: 'The match has already started in this room.' };
    }

    if (room.players.length >= room.maxPlayers) {
      // Check if already in room
      const alreadyIn = room.players.some((p) => p.id === this.myPlayerId);
      if (!alreadyIn) {
        return { success: false, error: `Room is full (max ${room.maxPlayers} players).` };
      }
    }

    const myPlayer: MultiplayerPlayerState = {
      id: this.myPlayerId,
      username,
      avatarSeed: username.slice(0, 2).toUpperCase(),
      score: 0,
      isHost: room.hostId === this.myPlayerId,
      isReady: true,
      selectedAnswer: null,
      answerTimeSeconds: null,
      lastActive: Date.now(),
    };

    const existingIndex = room.players.findIndex((p) => p.id === this.myPlayerId);
    if (existingIndex >= 0) {
      room.players[existingIndex] = myPlayer;
    } else {
      room.players.push(myPlayer);
    }

    this.currentRoom = room;
    this.saveRoomToStorage(room);
    this.broadcast('ROOM_SYNC', room);
    this.broadcast('PLAYER_JOINED', { roomCode: code, player: myPlayer });
    this.notifyListeners();

    return { success: true };
  }

  public startMatch(): boolean {
    if (!this.currentRoom || this.currentRoom.hostId !== this.myPlayerId) return false;

    this.currentRoom.status = 'playing';
    this.currentRoom.currentQuestionIndex = 0;
    this.currentRoom.roundStartTime = Date.now();
    this.currentRoom.players.forEach((p) => {
      p.selectedAnswer = null;
      p.answerTimeSeconds = null;
    });

    this.saveRoomToStorage(this.currentRoom);
    this.broadcast('ROOM_SYNC', this.currentRoom);
    this.notifyListeners();
    return true;
  }

  public submitAnswer(answerIndex: number, timeRemaining: number) {
    if (!this.currentRoom || this.currentRoom.status !== 'playing') return;

    const me = this.currentRoom.players.find((p) => p.id === this.myPlayerId);
    if (!me || me.selectedAnswer !== null) return; // prevent duplicate submissions

    me.selectedAnswer = answerIndex;
    me.answerTimeSeconds = timeRemaining;

    const currentQ = this.currentRoom.questions[this.currentRoom.currentQuestionIndex];
    if (currentQ && answerIndex === currentQ.correctIndex) {
      const speedBonus = Math.max(0, Math.floor(timeRemaining * 0.5));
      me.score += 10 + speedBonus;
    }

    this.saveRoomToStorage(this.currentRoom);
    this.broadcast('ROOM_SYNC', this.currentRoom);
    this.broadcast('PLAYER_ANSWER', {
      roomCode: this.currentRoom.roomCode,
      playerId: this.myPlayerId,
      answerIndex,
      timeRemaining,
    });
    this.notifyListeners();
  }

  public advanceRound(): void {
    if (!this.currentRoom || this.currentRoom.hostId !== this.myPlayerId) return;

    if (this.currentRoom.status === 'playing') {
      // Transition to round result review
      this.currentRoom.status = 'round_result';
    } else if (this.currentRoom.status === 'round_result') {
      // Check if more questions remain
      if (this.currentRoom.currentQuestionIndex + 1 < this.currentRoom.totalQuestions) {
        this.currentRoom.currentQuestionIndex += 1;
        this.currentRoom.status = 'playing';
        this.currentRoom.roundStartTime = Date.now();
        this.currentRoom.players.forEach((p) => {
          p.selectedAnswer = null;
          p.answerTimeSeconds = null;
        });
      } else {
        // Game finished!
        this.currentRoom.status = 'finished';
      }
    }

    this.saveRoomToStorage(this.currentRoom);
    this.broadcast('ROOM_SYNC', this.currentRoom);
    this.notifyListeners();
  }

  public playAgain(): void {
    if (!this.currentRoom || this.currentRoom.hostId !== this.myPlayerId) return;

    const newQuestions = getQuizQuestions(this.currentRoom.subject, this.currentRoom.standard, true);
    this.currentRoom.status = 'lobby';
    this.currentRoom.currentQuestionIndex = 0;
    this.currentRoom.questions = newQuestions;
    this.currentRoom.players.forEach((p) => {
      p.score = 0;
      p.selectedAnswer = null;
      p.answerTimeSeconds = null;
    });

    this.saveRoomToStorage(this.currentRoom);
    this.broadcast('ROOM_SYNC', this.currentRoom);
    this.notifyListeners();
  }

  public leaveRoom(): void {
    if (!this.currentRoom) return;

    this.currentRoom.players = this.currentRoom.players.filter((p) => p.id !== this.myPlayerId);

    // If host left and others remain, pass host
    if (this.currentRoom.hostId === this.myPlayerId && this.currentRoom.players.length > 0) {
      this.currentRoom.hostId = this.currentRoom.players[0].id;
      this.currentRoom.hostUsername = this.currentRoom.players[0].username;
      this.currentRoom.players[0].isHost = true;
    }

    this.saveRoomToStorage(this.currentRoom);
    this.broadcast('ROOM_SYNC', this.currentRoom);

    this.currentRoom = null;
    this.notifyListeners();
  }

  public getCurrentRoom(): MultiplayerRoomState | null {
    return this.currentRoom;
  }
}

export const multiplayerManager = new MultiplayerManager();
