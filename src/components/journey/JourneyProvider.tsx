'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import type { SectionId } from '@/data/event';
import { JOURNEY_ORDER, destinationIndex } from '@/data/journey';

/**
 * Single source of truth for the neural journey.
 *
 * Scroll position drives the active destination (via IntersectionObserver);
 * header links, chips, rail dots, and brain nodes all navigate by scrolling,
 * so the scene, progress, and panels can never disagree.
 */

export type JourneyActive = SectionId | 'footer';

interface JourneyState {
  active: JourneyActive;
  /** 0-based position in the journey (footer counts as past the end). */
  activeNumber: number;
  /** Overall page scroll progress, 0–1. */
  progress: number;
  reduced: boolean;
  goTo: (id: SectionId | 'footer') => void;
  isComplete: (id: SectionId) => boolean;
}

const JourneyContext = createContext<JourneyState | null>(null);

const OBSERVED = [...JOURNEY_ORDER, 'site-footer'] as const;

export function JourneyProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<JourneyActive>('hero');
  const [progress, setProgress] = useState(0);
  const [reduced, setReduced] = useState(false);
  const suppressUntil = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Overall scroll progress (throttled with rAF).
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  // Active destination from scroll position (centre-weighted band).
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const ratios = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        if (Date.now() < suppressUntil.current) return;
        for (const entry of entries) {
          if (entry.isIntersecting) ratios.set(entry.target.id, entry.intersectionRatio);
          else ratios.delete(entry.target.id);
        }
        let best: string | null = null;
        let bestRatio = 0;
        for (const [id, ratio] of ratios) {
          if (ratio > bestRatio) {
            best = id;
            bestRatio = ratio;
          }
        }
        if (best) setActive(best === 'site-footer' ? 'footer' : (best as SectionId));
      },
      { rootMargin: '-42% 0px -42% 0px', threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] },
    );
    for (const id of OBSERVED) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  const goTo = useCallback(
    (id: SectionId | 'footer') => {
      const targetId = id === 'footer' ? 'site-footer' : id;
      const el = document.getElementById(targetId);
      if (!el) return;
      suppressUntil.current = Date.now() + 800;
      setActive(id);
      const behavior: ScrollBehavior = reduced ? 'auto' : 'smooth';
      // scrollIntoView respects scroll-margin on the target.
      el.scrollIntoView({ behavior, block: 'start' });
    },
    [reduced],
  );

  const value = useMemo<JourneyState>(() => {
    const activeNumber = active === 'footer' ? JOURNEY_ORDER.length : destinationIndex(active);
    return {
      active,
      activeNumber,
      progress,
      reduced,
      goTo,
      isComplete: (id: SectionId) => destinationIndex(id) < activeNumber,
    };
  }, [active, progress, reduced, goTo]);

  return <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>;
}

export function useJourney(): JourneyState {
  const ctx = useContext(JourneyContext);
  if (!ctx) throw new Error('useJourney must be used inside JourneyProvider');
  return ctx;
}
