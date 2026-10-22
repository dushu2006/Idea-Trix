'use client';

import { ArrowLeft, ArrowRight, Quote } from 'lucide-react';
import { useId, useRef, useState } from 'react';

import { JOURNEY_STAGES } from '@/data/event';
import { JourneySection } from '@/components/ui/JourneySection';
import { cn } from '@/lib/utils';

const ACCENT = '#A78BFA';

export function Journey() {
  const [index, setIndex] = useState(0);
  const tablistRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const stage = JOURNEY_STAGES[index];

  const go = (next: number) => {
    setIndex((next + JOURNEY_STAGES.length) % JOURNEY_STAGES.length);
  };

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    let next: number | null = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % JOURNEY_STAGES.length;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp')
      next = (i - 1 + JOURNEY_STAGES.length) % JOURNEY_STAGES.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = JOURNEY_STAGES.length - 1;
    if (next === null) return;
    e.preventDefault();
    go(next);
    const tabs = tablistRef.current?.querySelectorAll('[role="tab"]');
    (tabs?.[next] as HTMLElement | undefined)?.focus();
  };

  return (
    <JourneySection
      id="journey"
      kicker="The arc"
      title="Four stages"
      lede={
        <p>
          Every team travels the same arc on the day — from a raw problem to an idea worth
          remembering. Select a node to see what each stage asks of you.
        </p>
      }
    >
      {/* Mini-network stage selector: four connected nodes. */}
      <div ref={tablistRef} role="tablist" aria-label="Journey stages" className="flex items-start">
        {JOURNEY_STAGES.map((s, i) => {
          const selected = i === index;
          return (
            <div key={s.id} className={cn('flex items-start', i < JOURNEY_STAGES.length - 1 && 'flex-1')}>
              <button
                type="button"
                role="tab"
                id={`${panelId}-tab-${s.id}`}
                aria-selected={selected}
                aria-controls={panelId}
                tabIndex={selected ? 0 : -1}
                onClick={() => go(i)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className="group flex min-h-[64px] min-w-[52px] flex-col items-center gap-1.5 rounded-lg px-0.5 py-1 sm:min-w-[64px] sm:px-1"
              >
                <span
                  aria-hidden="true"
                  className="block rounded-full border-2 transition-all duration-300"
                  style={{
                    width: selected ? 22 : 16,
                    height: selected ? 22 : 16,
                    borderColor: selected ? ACCENT : i < index ? `${ACCENT}88` : '#3E687B',
                    backgroundColor: selected ? ACCENT : i < index ? `${ACCENT}44` : 'transparent',
                    boxShadow: selected ? `0 0 0 5px ${ACCENT}26` : undefined,
                  }}
                />
                <span
                  className={cn(
                    'text-[12px] font-semibold sm:text-[13px]',
                    selected ? 'text-mist' : 'text-mute group-hover:text-fog',
                  )}
                >
                  {s.name}
                </span>
              </button>
              {i < JOURNEY_STAGES.length - 1 && (
                <span
                  aria-hidden="true"
                  className="mx-1 mt-[11px] h-[2px] flex-1 rounded-full"
                  style={{ backgroundColor: i < index ? `${ACCENT}88` : '#284052' }}
                />
              )}
            </div>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={panelId}
        aria-labelledby={`${panelId}-tab-${stage.id}`}
        className="mt-5 rounded-xl border border-white/10 bg-raised/70 p-5"
      >
        <p className="font-mono text-[12px] uppercase tracking-[0.2em]" style={{ color: ACCENT }}>
          Stage {stage.step} of 04
        </p>
        <p className="mt-1 font-display text-2xl font-semibold">{stage.tagline}</p>
        <p className="mt-3 text-[15px] leading-relaxed text-fog">{stage.description}</p>
        <figure className="mt-4 flex gap-3 rounded-lg border border-white/10 bg-void/60 p-4">
          <Quote size={18} aria-hidden="true" className="mt-0.5 flex-none" style={{ color: ACCENT }} />
          <div>
            <blockquote className="font-display text-[16px] italic leading-snug">
              {stage.prompt}
            </blockquote>
            <figcaption className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-mute">
              Ask yourselves
            </figcaption>
          </div>
        </figure>
        <div className="mt-4 flex items-center justify-between">
          <p className="font-mono text-[12px] text-mute" aria-live="polite">
            {index + 1} / {JOURNEY_STAGES.length}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Previous stage"
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-white/15 transition-colors hover:border-white/40"
            >
              <ArrowLeft size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Next stage"
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-white/15 transition-colors hover:border-white/40"
            >
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
      <p className="mt-4 text-[13px] text-mute">
        Stage descriptions are explanatory, not additional event rules.
      </p>
    </JourneySection>
  );
}
