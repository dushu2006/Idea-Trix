'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import type { SectionId } from '@/data/event';
import { DESTINATIONS, destinationById, destinationIndex } from '@/data/journey';
import { generateBrain, type BrainDetail } from '@/lib/brain';
import {
  cameraFor,
  lerpViewBox,
  viewBoxDistance,
  viewBoxToString,
  type ViewBox,
  type Viewport,
} from '@/lib/camera';
import { useJourney } from '@/components/journey/JourneyProvider';

/**
 * The neural brain: a fixed full-viewport SVG scene with a scroll-driven
 * camera. Geometry is seeded and deterministic (identical server/client);
 * only the camera, particles, and node states update at runtime.
 *
 * - Camera interpolates toward the active destination every frame.
 * - Reduced motion: the camera jump-cuts, particles freeze, the pulse hides.
 * - No WebGL, no assets: pure SVG + rAF. Content stays readable HTML.
 */

const DEFAULT_VIEWPORT: Viewport = { w: 1440, h: 900, isMobile: false };

export function NeuralScene() {
  const { active, activeNumber, goTo, reduced, isComplete } = useJourney();
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const particleRefs = useRef<(SVGCircleElement | null)[]>([]);
  const [detail, setDetail] = useState<BrainDetail>('full');
  const [viewport, setViewport] = useState<Viewport>(DEFAULT_VIEWPORT);
  const [hotId, setHotId] = useState<SectionId | null>(null);

  const brain = useMemo(() => generateBrain(detail), [detail]);

  // Stable first-paint viewBox (identical on server and client).
  const initialVB = useMemo(
    () =>
      viewBoxToString(
        cameraFor('hero', generateBrain('full').bbox, DEFAULT_VIEWPORT),
      ),
    [],
  );

  const target = useMemo(
    () => cameraFor(active, brain.bbox, viewport),
    [active, brain, viewport],
  );
  const targetRef = useRef<ViewBox>(target);
  targetRef.current = target;
  const camRef = useRef<ViewBox | null>(null);
  if (!camRef.current) camRef.current = target;
  const snappedRef = useRef(false);

  // Measure the viewport; pick mobile framing + simplified geometry < 640px.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const mq = window.matchMedia('(max-width: 639px)');
    const apply = () => {
      const rect = wrap.getBoundingClientRect();
      const isMobile = mq.matches;
      setViewport({
        w: Math.max(280, rect.width),
        h: Math.max(280, rect.height),
        isMobile,
      });
      setDetail(isMobile ? 'low' : 'full');
    };
    apply();
    const onChange = () => apply();
    mq.addEventListener('change', onChange);
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(apply) : null;
    ro?.observe(wrap);
    return () => {
      mq.removeEventListener('change', onChange);
      ro?.disconnect();
    };
  }, []);

  // Snap the camera when reduced motion is on (no interpolation, no loop).
  useEffect(() => {
    if (!reduced || !svgRef.current || !camRef.current) return;
    camRef.current = targetRef.current;
    svgRef.current.setAttribute('viewBox', viewBoxToString(targetRef.current));
  }, [reduced, target]);

  // Camera interpolation + particle drift. rAF pauses automatically in
  // background tabs; dt is clamped so returns never jump.
  useEffect(() => {
    if (reduced) return;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(50, now - last);
      last = now;
      if (!snappedRef.current && camRef.current) {
        camRef.current = targetRef.current;
        snappedRef.current = true;
      } else if (camRef.current) {
        const t = 1 - Math.exp(-dt / 300);
        const next = lerpViewBox(camRef.current, targetRef.current, t);
        camRef.current =
          viewBoxDistance(next, targetRef.current) < 0.05 ? targetRef.current : next;
      }
      if (svgRef.current && camRef.current) {
        svgRef.current.setAttribute('viewBox', viewBoxToString(camRef.current));
      }
      const tSec = now / 1000;
      for (let i = 0; i < brain.particles.length; i += 1) {
        const el = particleRefs.current[i];
        const p = brain.particles[i];
        if (!el || !p) continue;
        const dx = Math.sin(tSec * p.speed + p.phase) * p.range;
        const dy = Math.cos(tSec * p.speed * 0.8 + p.phase) * p.range * 0.7;
        el.setAttribute('transform', `translate(${dx.toFixed(1)} ${dy.toFixed(1)})`);
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduced, brain]);

  /* ---------- static layers (only depend on geometry) ---------- */

  const staticLayers = useMemo(
    () => (
      <>
        <ellipse
          cx={brain.center.x}
          cy={brain.center.y}
          rx={brain.bbox.w * 0.62}
          ry={brain.bbox.h * 0.62}
          fill="url(#brain-aura)"
        />
        <path
          d={`${brain.silhouette.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join('')}Z`}
          fill="none"
          stroke="#3E687B"
          strokeWidth={1}
          opacity={0.28}
        />
        <path d={brain.fissure} fill="none" stroke="#3E687B" strokeWidth={1.5} opacity={0.3} />
        {brain.sulci.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="#3E687B" strokeWidth={1.5} opacity={0.22} />
        ))}
        <path d={brain.bgLinks} fill="none" stroke="#284052" strokeWidth={1} opacity={0.5} />
        {brain.background.map((n, i) => (
          <circle key={i} cx={n.x} cy={n.y} r={n.r} fill="#48697F" opacity={n.o} />
        ))}
        <path d={brain.supLinks} fill="none" stroke="#3E687B" strokeWidth={1.2} opacity={0.42} />
        <path d={brain.branchLinks} fill="none" stroke="#3E687B" strokeWidth={1} opacity={0.3} />
        {brain.supporting.map((n, i) => (
          <circle key={i} cx={n.x} cy={n.y} r={n.r} fill="#5E86A0" opacity={0.8} />
        ))}
      </>
    ),
    [brain],
  );

  /* ---------- route + pulse ---------- */

  const pulse =
    active === 'hero' || active === 'footer'
      ? { path: brain.routeFull, color: '#22D3EE', dur: '8s' }
      : (() => {
          const seg = brain.routeSegments.find((s) => s.toId === active);
          return {
            path: seg?.d ?? brain.routeFull,
            color: destinationById(active).accent,
            dur: '2.4s',
          };
        })();

  const s = viewport.isMobile ? 1.35 : 1; // touch-friendly node scale

  return (
    <div ref={wrapRef} className="fixed inset-0 z-0 overflow-hidden bg-void" aria-hidden={false}>
      <svg
        ref={svgRef}
        viewBox={initialVB}
        preserveAspectRatio="xMidYMid slice"
        className="neural-scene block h-full w-full"
        role="group"
        aria-label="Interactive neural brain map. Header links, destination chips, and the journey rail navigate to each section."
      >
        <defs>
          <radialGradient id="brain-aura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#14B8A6" stopOpacity={0.1} />
            <stop offset="70%" stopColor="#14B8A6" stopOpacity={0.03} />
            <stop offset="100%" stopColor="#14B8A6" stopOpacity={0} />
          </radialGradient>
        </defs>

        <g aria-hidden="true">{staticLayers}</g>

        {/* Route underlay + per-destination segments */}
        <g aria-hidden="true" fill="none" strokeLinecap="round">
          <path d={brain.routeFull} stroke="#284052" strokeWidth={5} opacity={0.45} />
          {brain.routeSegments.map((seg) => {
            const toIdx = destinationIndex(seg.toId as SectionId);
            const live = toIdx === activeNumber;
            const done = toIdx < activeNumber;
            const accent = destinationById(seg.toId as SectionId).accent;
            return (
              <path
                key={`${seg.fromId}-${seg.toId}`}
                className="route-seg"
                d={seg.d}
                stroke={live || done ? accent : '#3E687B'}
                strokeWidth={live ? 3 : done ? 2 : 1.5}
                opacity={live ? 0.95 : done ? 0.3 : 0.35}
              />
            );
          })}
        </g>

        {/* Particles */}
        <g aria-hidden="true" fill="#A7F3E8" opacity={0.45}>
          {brain.particles.map((p, i) => (
            <circle
              key={i}
              ref={(el) => {
                particleRefs.current[i] = el;
              }}
              cx={p.x}
              cy={p.y}
              r={p.r}
            />
          ))}
        </g>

        {/* Travel pulse along the active path */}
        {!reduced && (
          <g aria-hidden="true">
            <circle r={3.5} fill={pulse.color} opacity={0.9}>
              <animateMotion
                key={active}
                dur={pulse.dur}
                repeatCount="indefinite"
                path={pulse.path}
              />
            </circle>
          </g>
        )}

        {/* Destination nodes */}
        {DESTINATIONS.map((def) => {
          const selected = active === def.id;
          const done = isComplete(def.id);
          const hot = hotId === def.id;
          // Selected implies a real destination (never the footer overview).
          const showLabel = hot || (selected && (!viewport.isMobile || active !== 'hero'));
          const coreR = (selected ? 8 : hot ? 6.5 : done ? 4 : 5) * s;
          const label = `${def.index} · ${def.label}`;
          const pillW = 22 + label.length * 7.4;
          const pillH = 26;
          const pillX = def.node.x - pillW / 2;
          const pillY = def.node.y - 20 * s - pillH;
          return (
            <g
              key={def.id}
              className="dest"
              role="button"
              tabIndex={0}
              aria-label={`${def.a11y}${selected ? ' (current section)' : ''}`}
              onClick={() => goTo(def.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  goTo(def.id);
                }
              }}
              onMouseEnter={() => setHotId(def.id)}
              onMouseLeave={() => setHotId((cur) => (cur === def.id ? null : cur))}
              onFocus={() => setHotId(def.id)}
              onBlur={() => setHotId((cur) => (cur === def.id ? null : cur))}
            >
              <circle cx={def.node.x} cy={def.node.y} r={viewport.isMobile ? 30 : 24} fill="transparent" />
              {selected && (
                <circle
                  className="dest-halo"
                  cx={def.node.x}
                  cy={def.node.y}
                  r={18 * s}
                  fill={def.accent}
                  opacity={0.14}
                />
              )}
              {(selected || hot) && (
                <circle
                  className="dest-ring"
                  cx={def.node.x}
                  cy={def.node.y}
                  r={(selected ? 13 : 11) * s}
                  fill="none"
                  stroke={def.accent}
                  strokeWidth={selected ? 2 : 1.5}
                  opacity={selected ? 1 : 0.85}
                />
              )}
              {done && !selected && !hot && (
                <circle
                  cx={def.node.x}
                  cy={def.node.y}
                  r={9 * s}
                  fill="none"
                  stroke={def.accent}
                  strokeWidth={1}
                  opacity={0.35}
                />
              )}
              <circle
                className="dest-core"
                cx={def.node.x}
                cy={def.node.y}
                r={coreR}
                fill={selected || hot || done ? def.accent : '#3E687B'}
                opacity={done && !selected && !hot ? 0.55 : selected || hot ? 1 : 0.8}
              />
              {selected && (
                <circle cx={def.node.x} cy={def.node.y} r={3 * s} fill="#C6FFF5" />
              )}
              {showLabel && (
                <g className="dest-label" pointerEvents="none">
                  <rect
                    x={pillX}
                    y={pillY}
                    width={pillW}
                    height={pillH}
                    rx={7}
                    fill="#0B1421"
                    fillOpacity={0.94}
                    stroke={def.accent}
                    strokeOpacity={0.55}
                    strokeWidth={1}
                  />
                  <text
                    x={def.node.x}
                    y={pillY + 17}
                    textAnchor="middle"
                    fontSize={12.5}
                    fill="#F1F5F9"
                  >
                    <tspan fill={def.accent} fontWeight={600}>
                      {def.index}
                    </tspan>
                    <tspan>{` · ${def.label}`}</tspan>
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Legibility overlays */}
      <div aria-hidden="true" className="scene-vignette pointer-events-none absolute inset-0" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-void to-transparent"
      />
    </div>
  );
}
