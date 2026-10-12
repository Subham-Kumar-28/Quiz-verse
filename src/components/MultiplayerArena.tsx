import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Users,
  Copy,
  Check,
  Play,
  Clock,
  Crown,
  Trophy,
  AlertCircle,
  RotateCcw,
  Home,
  Sparkles,
  Share2,
  Database,
} from 'lucide-react';
import { SUBJECTS } from '../data/questions';
import { SubjectId, StandardDifficulty } from '../types';
import {
  multiplayerManager,
  MultiplayerRoomState,
} from '../utils/multiplayerManager';
import {
  playClickSound,
  playCorrectSound,
  playWrongSound,
  playTickSound,
  playFanfareSound,
} from '../utils/audio';

interface MultiplayerArenaProps {
  username: string;
  onExit: () => void;
  onFinishMatch: (score: number, won: boolean) => void;
}

export const MultiplayerArena: React.FC<MultiplayerArenaProps> = ({
  username,
  onExit,
  onFinishMatch,
}) => {
  const [room, setRoom] = useState<MultiplayerRoomState | null>(null);
  const [viewState, setViewState] = useState<'menu' | 'create' | 'join'>('menu');
  const [inputCode, setInputCode] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Room Creation Form state
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>('computer-fundamentals');
  const [selectedStandard, setSelectedStandard] = useState<StandardDifficulty>('Intermediate');
  const [maxPlayers, setMaxPlayers] = useState<number>(4);

  // Active round timer
  const [roundTimer, setRoundTimer] = useState<number>(15);

  const myPlayerId = multiplayerManager.getPlayerId();

  useEffect(() => {
    const unsubscribe = multiplayerManager.subscribe((updatedRoom) => {
      setRoom(updatedRoom);
      if (updatedRoom) {
        if (updatedRoom.status === 'playing') {
          // Reset local round timer
          setRoundTimer(updatedRoom.roundTimeLimit);
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Timer loop when in playing state
  useEffect(() => {
    if (!room || room.status !== 'playing') return;

    const timer = setInterval(() => {
      setRoundTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // If host, advance to round review
          if (room.hostId === myPlayerId) {
            multiplayerManager.advanceRound();
          }
          return 0;
        }
        if (prev <= 5) playTickSound();
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [room?.status, room?.currentQuestionIndex, room?.hostId, myPlayerId]);

  const handleCreateRoom = () => {
    playClickSound();
    const subjObj = SUBJECTS.find((s) => s.id === selectedSubject);
    const newRoom = multiplayerManager.createRoom(
      username,
      selectedSubject,
      subjObj ? subjObj.name : 'Computer Science',
      selectedStandard,
      maxPlayers
    );
    setRoom(newRoom);
  };

  const handleJoinRoom = () => {
    playClickSound();
    if (!inputCode.trim()) {
      setErrorMessage('Please enter a 6-character room code.');
      return;
    }
    const res = multiplayerManager.joinRoom(inputCode.trim(), username);
    if (!res.success) {
      setErrorMessage(res.error || 'Failed to join room.');
    } else {
      setErrorMessage(null);
    }
  };

  const handleCopyCode = () => {
    if (!room) return;
    playClickSound();
    navigator.clipboard.writeText(room.roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAnswer = (optionIndex: number) => {
    if (!room || room.status !== 'playing') return;
    const currentQ = room.questions[room.currentQuestionIndex];
    if (!currentQ) return;

    playClickSound();
    multiplayerManager.submitAnswer(optionIndex, roundTimer);

    if (optionIndex === currentQ.correctIndex) {
      playCorrectSound();
    } else {
      playWrongSound();
    }
  };

  // -------------------------------------------------------------
  // LOBBY VIEW
  // -------------------------------------------------------------
  if (room && room.status === 'lobby') {
    const isHost = room.hostId === myPlayerId;
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 animate-in fade-in">
        <div className="p-8 rounded-3xl bg-[#0f172a] border border-purple-500/40 shadow-2xl relative overflow-hidden glow-card">
          {/* Top Info */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => {
                playClickSound();
                multiplayerManager.leaveRoom();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Leave Room</span>
            </button>

            <span className="text-xs uppercase font-bold tracking-wider text-purple-400">
              Battle Lobby
            </span>
          </div>

          {/* Room Code Showcase */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 text-center mb-8">
            <span className="text-xs text-slate-400 font-medium block mb-1">Share this Room Code with friends:</span>
            <div className="flex items-center justify-center gap-3">
              <span className="text-3xl sm:text-4xl font-black font-mono tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                {room.roomCode}
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/30 transition-all cursor-pointer"
                title="Copy Room Code"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Tip: Open another browser tab or invite a friend to test real-time synchronization!
            </p>
          </div>

          {/* Room Configuration Summary */}
          <div className="grid grid-cols-3 gap-2.5 text-center mb-8">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80">
              <div className="text-[10px] uppercase font-bold text-slate-400">Subject</div>
              <div className="text-xs font-semibold text-cyan-300 truncate mt-0.5">{room.subjectName}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80">
              <div className="text-[10px] uppercase font-bold text-slate-400">Standard</div>
              <div className="text-xs font-semibold text-purple-300 truncate mt-0.5">{room.standard}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80">
              <div className="text-[10px] uppercase font-bold text-slate-400">Players</div>
              <div className="text-xs font-semibold text-white mt-0.5">
                {room.players.length} / {room.maxPlayers}
              </div>
            </div>
          </div>

          {/* Player Roster */}
          <div className="mb-8">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
              <span>Connected Players</span>
              <span>Slots: {room.players.length}/{room.maxPlayers}</span>
            </h4>
            <div className="space-y-2">
              {room.players.map((p) => (
                <div
                  key={p.id}
                  className={`p-3.5 rounded-xl border flex items-center justify-between ${
                    p.id === myPlayerId
                      ? 'bg-purple-950/40 border-purple-500/60 ring-1 ring-purple-500/40'
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                      {p.avatarSeed}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white flex items-center gap-1.5">
                        <span>{p.username}</span>
                        {p.id === myPlayerId && <span className="text-[10px] text-cyan-400 font-normal">(You)</span>}
                        {p.isHost && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-400 border border-amber-800">
                            <Crown className="w-2.5 h-2.5" /> Host
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Ready
                  </span>
                </div>
              ))}

              {/* Empty slot indicators */}
              {Array.from({ length: room.maxPlayers - room.players.length }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="p-3.5 rounded-xl border border-dashed border-slate-800 text-slate-600 text-xs flex items-center justify-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  <span>Waiting for player {room.players.length + i + 1}...</span>
                </div>
              ))}
            </div>
          </div>

          {/* Start Button (Host only) */}
          {isHost ? (
            <div>
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  multiplayerManager.startMatch();
                }}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-base shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Start Multiplayer Battle</span>
              </button>
              <p className="text-[11px] text-center text-slate-500 mt-2">
                As room host, you can launch the quiz whenever players are ready.
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center text-xs text-slate-400 animate-pulse">
              Waiting for host <strong className="text-purple-300">{room.hostUsername}</strong> to start the game...
            </div>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // ACTIVE GAME / ROUND REVIEW
  // -------------------------------------------------------------
  if (room && (room.status === 'playing' || room.status === 'round_result')) {
    const currentQ = room.questions[room.currentQuestionIndex];
    const me = room.players.find((p) => p.id === myPlayerId);
    const hasAnswered = me && me.selectedAnswer !== null;
    const isHost = room.hostId === myPlayerId;
    const isReview = room.status === 'round_result';

    // Sorted scoreboard
    const sortedPlayers = [...room.players].sort((a, b) => b.score - a.score);

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Top Header: Question counter, timer, subject */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <span className="text-xs uppercase font-bold tracking-wider text-purple-400">
            Multiplayer Battle · Question {room.currentQuestionIndex + 1} of {room.totalQuestions}
          </span>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-cyan-500/40 text-cyan-400 font-mono text-sm font-bold">
            <Clock className="w-4 h-4" />
            <span>{roundTimer}s</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Question & Options Area (2 cols) */}
          <div className="lg:col-span-2">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0f172a] border border-slate-700 shadow-2xl relative overflow-hidden mb-6 glow-card">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-6 leading-snug font-display">
                {currentQ.question}
              </h3>

              <div className="space-y-3">
                {currentQ.options.map((opt, oIdx) => {
                  const isSelected = me?.selectedAnswer === oIdx;
                  const isCorrect = oIdx === currentQ.correctIndex;

                  let style = 'bg-slate-900/80 border-slate-800 text-slate-200 hover:border-slate-700';

                  if (hasAnswered) {
                    if (isSelected) {
                      style = 'bg-cyan-950 border-cyan-400 text-cyan-200 ring-1 ring-cyan-400';
                    } else {
                      style = 'bg-slate-900/50 border-slate-800 text-slate-500 opacity-60';
                    }
                  }

                  if (isReview) {
                    if (isCorrect) {
                      style = 'bg-emerald-950 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500 font-bold';
                    } else if (isSelected && !isCorrect) {
                      style = 'bg-rose-950 border-rose-500 text-rose-200 ring-1 ring-rose-500 font-bold';
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      type="button"
                      disabled={hasAnswered || isReview}
                      onClick={() => handleAnswer(oIdx)}
                      className={`w-full p-4 rounded-2xl text-left border transition-all cursor-pointer flex items-center justify-between ${style}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">
                          {['A', 'B', 'C', 'D'][oIdx]}
                        </span>
                        <span className="text-sm font-medium">{opt}</span>
                      </div>
                      {hasAnswered && isSelected && !isReview && (
                        <span className="text-xs text-cyan-400 font-semibold">Locked In</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Review explanation */}
              {isReview && (
                <div className="mt-6 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 animate-in fade-in">
                  <strong className="text-cyan-400 block mb-1">Explanation:</strong>
                  {currentQ.explanation}
                </div>
              )}
            </div>

            {/* Host Round Controls */}
            {isHost && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    multiplayerManager.advanceRound();
                  }}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-purple-600/30 flex items-center gap-2 cursor-pointer"
                >
                  <span>{isReview ? 'Next Question →' : 'Reveal Answers'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Live Scoreboard Sidebar (1 col) */}
          <div className="lg:col-span-1">
            <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center justify-between">
                <span>Live Battle Rankings</span>
                <Trophy className="w-4 h-4 text-amber-400" />
              </h4>

              <div className="space-y-2.5">
                {sortedPlayers.map((p, idx) => (
                  <div
                    key={p.id}
                    className={`p-3 rounded-2xl border flex items-center justify-between ${
                      p.id === myPlayerId
                        ? 'bg-purple-950/40 border-purple-500/60'
                        : 'bg-slate-950/60 border-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 text-xs font-bold text-slate-500 font-mono">
                        #{idx + 1}
                      </span>
                      <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold text-white">
                        {p.avatarSeed}
                      </div>
                      <div className="truncate max-w-[90px]">
                        <div className="text-xs font-bold text-white truncate">{p.username}</div>
                        {p.selectedAnswer !== null && (
                          <div className="text-[10px] text-emerald-400">Answered</div>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-black font-mono text-cyan-400">
                        {p.score} pts
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // MATCH FINISHED: PODIUM & WINNER VIEW
  // -------------------------------------------------------------
  if (room && room.status === 'finished') {
    const sorted = [...room.players].sort((a, b) => b.score - a.score);
    const winner = sorted[0];
    const isMeWinner = winner && winner.id === myPlayerId;
    const isHost = room.hostId === myPlayerId;

    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center animate-in fade-in">
        <div className="p-8 sm:p-10 rounded-3xl bg-[#0f172a] border border-purple-500/40 shadow-2xl relative overflow-hidden glow-card">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-purple-600 flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-amber-400/20">
            <Trophy className="w-10 h-10" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white font-display mb-1">
            {isMeWinner ? 'Victory! You Won the Match! 🏆' : `${winner?.username} Won the Match! 🌟`}
          </h2>
          <p className="text-xs text-slate-400 mb-8">
            Multiplayer showdown complete. Here are the final rankings:
          </p>

          {/* Final Standings Table */}
          <div className="space-y-2 mb-8">
            {sorted.map((p, idx) => (
              <div
                key={p.id}
                className={`p-4 rounded-2xl border flex items-center justify-between ${
                  idx === 0
                    ? 'bg-amber-950/40 border-amber-500/60 ring-1 ring-amber-500/40'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 text-sm font-bold font-mono text-slate-400">
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                  </span>
                  <div className="text-left">
                    <span className="text-sm font-bold text-white">{p.username}</span>
                    {p.id === myPlayerId && <span className="text-xs text-cyan-400 ml-1.5">(You)</span>}
                  </div>
                </div>

                <span className="text-base font-black font-mono text-cyan-400">
                  {p.score} pts
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {isHost && (
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  multiplayerManager.playAgain();
                }}
                className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Play Again</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                playClickSound();
                const myScore = room.players.find((p) => p.id === myPlayerId)?.score || 0;
                onFinishMatch(myScore, isMeWinner);
                multiplayerManager.leaveRoom();
              }}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-semibold text-sm border border-slate-700 flex items-center gap-2 cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>Leave to Hub</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // INITIAL MULTIPLAYER SELECTION MENU
  // -------------------------------------------------------------
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => {
            playClickSound();
            onExit();
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Hub</span>
        </button>

        <div className="text-right">
          <span className="text-xs uppercase font-semibold tracking-wider text-purple-400">Online Arena</span>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">Play with Friends</h2>
        </div>
      </div>

      {viewState === 'menu' && (
        <div className="space-y-8 animate-in fade-in">
          {/* Main Action Cards: Create Room / Join Room */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Create Room Card */}
            <div
              onClick={() => {
                playClickSound();
                setViewState('create');
              }}
              className="p-8 rounded-3xl bg-[#0f172a] border border-purple-500/40 hover:border-purple-400 shadow-xl hover:shadow-2xl hover:shadow-purple-900/30 transition-all cursor-pointer glow-card flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-400 flex items-center justify-center text-2xl mb-6">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-white font-display mb-2">Create Room</h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  Host a private quiz battle. Choose the subject, standard, and player count (2 to 6 players) then invite your friends.
                </p>
              </div>
              <button
                type="button"
                className="w-full py-3.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-md shadow-purple-600/30"
              >
                Host a New Room
              </button>
            </div>

            {/* Join Room Card */}
            <div
              onClick={() => {
                playClickSound();
                setViewState('join');
              }}
              className="p-8 rounded-3xl bg-[#0f172a] border border-cyan-500/40 hover:border-cyan-400 shadow-xl hover:shadow-2xl hover:shadow-cyan-900/30 transition-all cursor-pointer glow-card flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center text-2xl mb-6">
                  <Users className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-white font-display mb-2">Join Room</h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  Have a room code from a friend? Enter it here to join their multiplayer quiz room.
                </p>
              </div>
              <button
                type="button"
                className="w-full py-3.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-md shadow-cyan-500/30"
              >
                Enter Room Code
              </button>
            </div>
          </div>

          {/* Backend / Cloud Database Sync info banner */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 flex items-start gap-3 leading-relaxed">
            <Database className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-200 block mb-1">
                Multi-Client Synchronization Ready
              </strong>
              QuizVerse uses real-time broadcast and storage event channels so participants on multiple browser tabs or devices can instantly compete in synchronized quiz battles. Optional Supabase or Firebase configurations can also be connected for persistent cross-network cloud leaderboards without interrupting current play.
            </div>
          </div>
        </div>
      )}

      {/* CREATE ROOM FORM */}
      {viewState === 'create' && (
        <div className="max-w-xl mx-auto p-8 rounded-3xl bg-[#0f172a] border border-purple-500/40 shadow-2xl animate-in fade-in">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => {
                playClickSound();
                setViewState('menu');
              }}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <h3 className="text-lg font-bold text-white font-display">Configure Room</h3>
          </div>

          <div className="space-y-5 mb-8">
            {/* Subject */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Subject
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value as SubjectId)}
                className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-purple-400"
              >
                {SUBJECTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.icon} {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Standard */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Standard / Difficulty
              </label>
              <select
                value={selectedStandard}
                onChange={(e) => setSelectedStandard(e.target.value as StandardDifficulty)}
                className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-purple-400"
              >
                {['Class 6–8', 'Class 9–10', 'Class 11–12', 'Beginner', 'Intermediate', 'Advanced', 'College / B.Sc. Computer Science'].map((std) => (
                  <option key={std} value={std}>
                    {std}
                  </option>
                ))}
              </select>
            </div>

            {/* Max Players (2 to 6) */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Number of Players: <span className="text-purple-400 font-bold">{maxPlayers} players</span>
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[2, 3, 4, 5, 6].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setMaxPlayers(num);
                    }}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      maxPlayers === num
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCreateRoom}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 cursor-pointer"
          >
            Create Private Room &amp; Open Lobby
          </button>
        </div>
      )}

      {/* JOIN ROOM FORM */}
      {viewState === 'join' && (
        <div className="max-w-md mx-auto p-8 rounded-3xl bg-[#0f172a] border border-cyan-500/40 shadow-2xl animate-in fade-in">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => {
                playClickSound();
                setViewState('menu');
              }}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <h3 className="text-lg font-bold text-white font-display">Join by Code</h3>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Room Code
              </label>
              <input
                type="text"
                value={inputCode}
                onChange={(e) => {
                  setInputCode(e.target.value.toUpperCase());
                  if (errorMessage) setErrorMessage(null);
                }}
                maxLength={6}
                placeholder="e.g. QV8841"
                autoFocus
                className="w-full p-3.5 bg-slate-900 border border-slate-700 rounded-xl text-center font-mono text-xl uppercase tracking-widest text-cyan-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              />
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleJoinRoom}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-400 hover:to-teal-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/30 cursor-pointer"
          >
            Join Room
          </button>
        </div>
      )}
    </div>
  );
};
