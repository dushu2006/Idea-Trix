'use client';

import { useEffect, useRef } from 'react';

import { DESTINATIONS, destinationIndex } from '@/data/journey';
import { cn } from '@/lib/utils';
import { useJourney } from './JourneyProvider';

/**
 * Mobile destination selector: a thumb-friendly bottom bar with a
 * horizontally scrollable row of numbered chips. Touch-first — no precise
 * taps on tiny neural nodes required.
 */
export function JourneyChips() {
  const { active, goTo, reduced } = useJourney();
  const activeIdx = active === 'footer' ? DESTINATIONS.length - 1 : destinationIndex(active);
  const activeDef = DESTINATIONS[activeIdx];
  const listRef = useRef<HTMLDivElement>(null);

  // Keep the active chip visible without moving the page.
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>('[aria-current="true"]');
    el?.scrollIntoView({
      behavior: reduced ? 'auto' : 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  }, [active, reduced]);

  return (
    <nav
      aria-label="Destinations"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-abyss/90 backdrop-blur-md md:hidden"
    >
      <div className="px-3 pt-2" style={{ paddingBottom: 'max(0.7rem, env(safe-area-inset-bottom))' }}>
        <div className="flex items-center justify-between px-1 pb-1.5">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-mute">
            Destination{' '}
            <span className="font-semibold" style={{ color: activeDef.accent }}>
              {activeDef.index} · {activeDef.label}
            </span>
          </p>
          <p className="font-mono text-[11px] text-mute" aria-hidden="true">
            {activeIdx + 1}/9
          </p>
        </div>
        <div ref={listRef} className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          {DESTINATIONS.map((def, i) => {
            const selected = i === activeIdx && active !== 'footer';
            const done = i < activeIdx || active === 'footer';
            return (
              <button
                key={def.id}
                type="button"
                onClick={() => goTo(def.id)}
                aria-current={selected ? 'true' : undefined}
                aria-label={`Go to ${def.label}`}
                className={cn(
                  'flex min-h-[44px] flex-none items-center gap-2 rounded-full border px-4 text-[14px] font-semibold transition-colors',
                  selected
                    ? 'border-transparent text-inkbtn'
                    : done
                      ? 'border-white/15 bg-raised text-mist'
                      : 'border-white/10 bg-panel text-fog',
                )}
                style={selected ? { backgroundColor: def.accent } : undefined}
              >
                <span
                  className="font-mono text-[12px]"
                  style={done && !selected ? { color: def.accent } : undefined}
                >
                  {def.index}
                </span>
                {def.short}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
