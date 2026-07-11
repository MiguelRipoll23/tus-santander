import React, { useCallback, useEffect, useEffectEvent, useRef, useState } from "react";
import styles from "./SeasonalEffects.module.css";

type Effect = "halloween" | "christmas" | "newyear";

function detectEffect(): Effect | null {
  const params = new URLSearchParams(window.location.search);
  const override = params.get("effect");
  if (
    override === "halloween" ||
    override === "christmas" ||
    override === "newyear"
  ) {
    return override;
  }

  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  if (month === 10) return "halloween";
  if (month === 12 && day === 31) return "newyear";
  if (month === 12) return "christmas";

  return null;
}

// ── Halloween ──────────────────────────────────────────────────────────────

const HALLOWEEN_EMOJIS = ["🕷️", "🕸️", "💀", "🎃"];

interface HalloweenEl {
  id: number;
  emoji: string;
  x: number;
  y: number;
}

function HalloweenItem({
  el,
  onDone,
}: {
  el: HalloweenEl;
  onDone: () => void;
}) {
  const onDoneEvent = useEffectEvent(onDone);

  useEffect(() => {
    const t = setTimeout(() => onDoneEvent(), 6000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={styles.halloweenItem}
      style={{ left: `${el.x}%`, top: `${el.y}%` }}
    >
      {el.emoji}
    </div>
  );
}

function HalloweenEffect() {
  const [elements, setElements] = useState<HalloweenEl[]>([]);
  const idRef = useRef(0);

  const spawn = useCallback(() => {
    setElements((prev) => {
      if (prev.length >= 3) return prev;
      return [
        ...prev,
        {
          id: ++idRef.current,
          emoji:
            HALLOWEEN_EMOJIS[
              Math.floor(Math.random() * HALLOWEEN_EMOJIS.length)
            ],
          x: 8 + Math.random() * 80,
          y: 8 + Math.random() * 80,
        },
      ];
    });
  }, []);

  useEffect(() => {
    spawn();
    const id = setInterval(spawn, 3500);
    return () => clearInterval(id);
  }, [spawn]);

  const remove = useCallback((id: number) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
  }, []);

  return (
    <div className={styles.overlay}>
      {elements.map((el) => (
        <HalloweenItem key={el.id} el={el} onDone={() => remove(el.id)} />
      ))}
    </div>
  );
}

// ── Christmas ──────────────────────────────────────────────────────────────

const CHRISTMAS_EMOJIS = ["🎁", "✨", "🎄", "⭐", "🔔"];

interface Snowflake {
  x: number;
  y: number;
  r: number;
  speed: number;
  opacity: number;
  drift: number;
  driftOffset: number;
}

function makeFlake(w: number, h: number, initial?: boolean): Snowflake {
  return {
    x: Math.random() * w,
    y: initial ? Math.random() * h : -10,
    r: 1.5 + Math.random() * 2.5,
    speed: 0.5 + Math.random() * 1.5,
    opacity: 0.3 + Math.random() * 0.5,
    drift: (Math.random() - 0.5) * 0.4,
    driftOffset: Math.random() * Math.PI * 2,
  };
}

interface ChristmasEl {
  id: number;
  emoji: string;
  x: number;
  y: number;
}

function ChristmasEmojiItem({
  el,
  onDone,
}: {
  el: ChristmasEl;
  onDone: () => void;
}) {
  const onDoneEvent = useEffectEvent(onDone);

  useEffect(() => {
    const t = setTimeout(() => onDoneEvent(), 6000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={styles.halloweenItem}
      style={{ left: `${el.x}%`, top: `${el.y}%` }}
    >
      {el.emoji}
    </div>
  );
}

function ChristmasEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [festive, setFestive] = useState<ChristmasEl[]>([]);
  const festiveIdRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;
    let frame = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const flakes: Snowflake[] = Array.from({ length: 60 }, () =>
      makeFlake(canvas.width, canvas.height, true)
    );

    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const f of flakes) {
        f.x += f.drift * Math.sin(frame * 0.02 + f.driftOffset);
        f.y += f.speed;

        if (f.y > canvas.height + 10) {
          f.x = Math.random() * canvas.width;
          f.y = -10;
        }
        if (f.x < 0) f.x = canvas.width;
        if (f.x > canvas.width) f.x = 0;

        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${f.opacity})`;
        ctx.fill();
      }

      rafId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setFestive((prev) => {
        if (prev.length >= 3) return prev;
        return [
          ...prev,
          {
            id: ++festiveIdRef.current,
            emoji:
              CHRISTMAS_EMOJIS[
                Math.floor(Math.random() * CHRISTMAS_EMOJIS.length)
              ],
            x: 8 + Math.random() * 80,
            y: 8 + Math.random() * 80,
          },
        ];
      });
    }, 3500);
    return () => clearInterval(id);
  }, []);

  const removeFestive = useCallback((id: number) => {
    setFestive((prev) => prev.filter((el) => el.id !== id));
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.overlay}>
        {festive.map((el) => (
          <ChristmasEmojiItem
            key={el.id}
            el={el}
            onDone={() => removeFestive(el.id)}
          />
        ))}
      </div>
    </>
  );
}

// ── New Year ───────────────────────────────────────────────────────────────

interface ConfettiPiece {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  angle: number;
  spin: number;
  vx: number;
  vy: number;
}

interface BurstParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  r: number;
  alpha: number;
}

interface Burst {
  particles: BurstParticle[];
  done: boolean;
}

const CONFETTI_COLORS = [
  "#ff6b6b",
  "#ffd93d",
  "#6bcb77",
  "#4d96ff",
  "#ff6bff",
  "#ff9f43",
  "#48dbfb",
];

const BURST_COLORS = [
  "#ff6b6b",
  "#ffd93d",
  "#6bcb77",
  "#4d96ff",
  "#ffffff",
  "#ff9f43",
  "#ff6bff",
];

function makePiece(w: number): ConfettiPiece {
  return {
    x: Math.random() * w,
    y: -20 - Math.random() * 200,
    w: 6 + Math.random() * 8,
    h: 3 + Math.random() * 5,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    angle: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.15,
    vx: (Math.random() - 0.5) * 1.5,
    vy: 1.5 + Math.random() * 2,
  };
}

function makeBurst(w: number, h: number): Burst {
  const cx = w * (0.2 + Math.random() * 0.6);
  const cy = h * (0.1 + Math.random() * 0.4);
  const color = BURST_COLORS[Math.floor(Math.random() * BURST_COLORS.length)];
  const count = 50 + Math.floor(Math.random() * 30);
  const speed = 3 + Math.random() * 3;

  return {
    done: false,
    particles: Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      const s = speed * (0.4 + Math.random() * 0.6);
      return {
        x: cx,
        y: cy,
        vx: Math.cos(angle) * s,
        vy: Math.sin(angle) * s,
        color,
        r: 1.5 + Math.random() * 2,
        alpha: 1,
      };
    }),
  };
}

function NewYearEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;
    let frame = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const pieces: ConfettiPiece[] = Array.from({ length: 150 }, () =>
      makePiece(canvas.width)
    );
    const bursts: Burst[] = [];

    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (frame % 80 === 0) {
        bursts.push(makeBurst(canvas.width, canvas.height));
      }

      for (const p of pieces) {
        p.x += p.vx;
        p.y += p.vy;
        p.angle += p.spin;

        if (p.y > canvas.height + 20) {
          Object.assign(p, makePiece(canvas.width));
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }

      let i = bursts.length;
      while (i--) {
        const burst = bursts[i];
        let alive = false;

        for (const p of burst.particles) {
          if (p.alpha <= 0) continue;
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.05;
          p.vx *= 0.98;
          p.alpha -= 0.015;

          if (p.alpha > 0) {
            alive = true;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.alpha;
            ctx.fill();
          }
        }

        ctx.globalAlpha = 1;
        if (!alive) bursts.splice(i, 1);
      }

      rafId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} />;
}

// ── Main ───────────────────────────────────────────────────────────────────

function SeasonalEffects(): React.JSX.Element | null {
  const effect = detectEffect();

  if (effect === "halloween") return <HalloweenEffect />;
  if (effect === "christmas") return <ChristmasEffect />;
  if (effect === "newyear") return <NewYearEffect />;
  return null;
}

export default SeasonalEffects;
