'use client';

import { useEffect, useRef } from 'react';

/**
 * Lightweight "idea network" canvas for the hero: drifting nodes that link
 * when close, evoking teams connecting ideas. Rendered once and frozen when
 * the user prefers reduced motion; paused while off-screen.
 */
export function IdeaField({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      ember: boolean;
    }
    let nodes: Node[] = [];
    let w = 0;
    let h = 0;
    let frame = 0;
    let visible = true;

    const seed = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(90, Math.max(28, Math.round((w * h) / 16000)));
      nodes = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: 1.4 + Math.random() * 1.8,
        ember: i % 9 === 0,
      }));
    };

    const LINK = 130;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < nodes.length; i += 1) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j += 1) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d > LINK) continue;
          const alpha = (1 - d / LINK) * 0.22;
          ctx.strokeStyle =
            a.ember || b.ember ? `rgba(196,57,27,${alpha + 0.08})` : `rgba(20,27,39,${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      for (const n of nodes) {
        ctx.fillStyle = n.ember ? 'rgba(196,57,27,0.75)' : 'rgba(20,27,39,0.5)';
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const tick = () => {
      if (visible) {
        for (const n of nodes) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < -8) n.x = w + 8;
          if (n.x > w + 8) n.x = -8;
          if (n.y < -8) n.y = h + 8;
          if (n.y > h + 8) n.y = -8;
        }
        draw();
      }
      frame = window.requestAnimationFrame(tick);
    };

    seed();
    draw();
    if (!reduced) frame = window.requestAnimationFrame(tick);

    const onResize = () => {
      seed();
      draw();
    };
    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0 },
    );
    observer.observe(canvas);
    window.addEventListener('resize', onResize);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', onResize);
      observer.disconnect();
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
}
