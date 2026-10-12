import React, { useEffect, useRef } from 'react';

interface BackgroundAnimationProps {
  theme: 'dark' | 'light';
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  symbol?: string;
  opacity: number;
}

export const BackgroundAnimation: React.FC<BackgroundAnimationProps> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const csSymbols = ['0', '1', '{ }', '</>', 'λ', '&&', '||', '!=', '0x', '++', '=>'];
    const isDark = theme === 'dark';

    // Generate floating particles and CS symbols
    const particleCount = Math.min(38, Math.floor(width / 35));
    const particles: Particle[] = [];

    const darkColors = ['#06b6d4', '#a855f7', '#6366f1', '#38bdf8', '#8b5cf6'];
    const lightColors = ['#0891b2', '#7c3aed', '#4f46e5', '#0284c7', '#9333ea'];
    const palette = isDark ? darkColors : lightColors;

    for (let i = 0; i < particleCount; i++) {
      const isSymbol = i % 3 === 0;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: isSymbol ? 0 : Math.random() * 2 + 1.2,
        color: palette[Math.floor(Math.random() * palette.length)],
        symbol: isSymbol ? csSymbols[Math.floor(Math.random() * csSymbols.length)] : undefined,
        opacity: isSymbol ? (isDark ? 0.18 : 0.22) : isDark ? 0.35 : 0.28,
      });
    }

    const maxDistance = 120;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle connective cyber mesh lines between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * (isDark ? 0.12 : 0.08);
            ctx.beginPath();
            ctx.strokeStyle = isDark
              ? `rgba(6, 182, 212, ${alpha})`
              : `rgba(99, 102, 241, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw and update each particle
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around screen boundaries smoothly
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        if (p.symbol) {
          ctx.save();
          ctx.font = '11px "JetBrains Mono", monospace';
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.opacity;
          ctx.fillText(p.symbol, p.x, p.y);
          ctx.restore();
        } else {
          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.opacity;
          if (isDark) {
            ctx.shadowBlur = 8;
            ctx.shadowColor = p.color;
          }
          ctx.fill();
          ctx.restore();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Ambient gradient orbs with CSS breathing animation */}
      <div
        className={`absolute -top-32 -left-32 w-96 h-96 rounded-full blur-[120px] transition-all duration-1000 ${
          theme === 'dark' ? 'bg-cyan-500/12' : 'bg-cyan-500/10'
        } animate-pulse`}
        style={{ animationDuration: '8s' }}
      />
      <div
        className={`absolute top-1/3 -right-32 w-96 h-96 rounded-full blur-[130px] transition-all duration-1000 ${
          theme === 'dark' ? 'bg-purple-600/12' : 'bg-purple-400/10'
        } animate-pulse`}
        style={{ animationDuration: '10s' }}
      />
      <div
        className={`absolute -bottom-32 left-1/3 w-96 h-96 rounded-full blur-[140px] transition-all duration-1000 ${
          theme === 'dark' ? 'bg-indigo-600/10' : 'bg-indigo-400/8'
        } animate-pulse`}
        style={{ animationDuration: '12s' }}
      />

      {/* Cyber Mesh & Floating Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-90" />
    </div>
  );
};
