'use client';

import { DESTINATIONS, destinationIndex } from '@/data/journey';
import { cn } from '@/lib/utils';
import { useJourney } from './JourneyProvider';

/**
 * Desktop journey rail: a slim right-edge dot column for direct navigation.
 * Dots are real buttons with labels on hover/focus — never the only path
 * (header links and brain nodes navigate too).
 */
export function JourneyRail() {
  const { active, goTo } = useJourney();
  const activeIdx = active === 'footer' ? DESTINATIONS.length : destinationIndex(active);

  return (
    <nav
      aria-label="Journey destinations"
      className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 xl:block"
    >
      <ol className="flex flex-col items-center gap-1.5">
        {DESTINATIONS.map((def) => {
          const i = destinationIndex(def.id);
          const selected = def.id === active;
          const done = i < activeIdx;
          return (
            <li key={def.id} className="group relative flex">
              <button
                type="button"
                onClick={() => goTo(def.id)}
                aria-label={`Go to ${def.label}`}
                aria-current={selected ? 'true' : undefined}
                className="flex h-9 w-9 items-center justify-center rounded-full"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'block rounded-full transition-all duration-300',
                    selected ? 'h-3.5 w-3.5' : 'h-2 w-2 group-hover:h-3 group-hover:w-3',
                  )}
                  style={{
                    backgroundColor: selected || done ? def.accent : '#3E687B',
                    opacity: selected ? 1 : done ? 0.75 : 0.5,
                    boxShadow: selected ? `0 0 0 4px ${def.accent}33` : undefined,
                  }}
                />
              </button>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-11 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md border border-white/10 bg-abyss/95 px-2.5 py-1.5 font-mono text-[12px] text-mist opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100"
              >
                <span style={{ color: def.accent }}>{def.index}</span> · {def.label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
