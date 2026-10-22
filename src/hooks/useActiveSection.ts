'use client';

import { useEffect, useState } from 'react';

/**
 * Track which page section is currently in view, for nav highlighting.
 * Uses an IntersectionObserver with a centre-weighted band so exactly one
 * section tends to be "active" at a time.
 */
export function useActiveSection(ids: string[]): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const seen = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) seen.set(entry.target.id, entry.intersectionRatio);
          else seen.delete(entry.target.id);
        }
        let best: string | null = null;
        let bestRatio = 0;
        for (const [id, ratio] of seen) {
          if (ratio > bestRatio) {
            best = id;
            bestRatio = ratio;
          }
        }
        setActive(best);
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] },
    );

    const elements: Element[] = [];
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) {
        elements.push(el);
        observer.observe(el);
      }
    }
    return () => {
      observer.disconnect();
      elements.length = 0;
    };
    // ids is a static list; stringify to keep the effect stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join('|')]);

  return active;
}
