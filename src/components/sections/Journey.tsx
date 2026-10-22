'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react';
import { useCallback, useId, useRef, useState } from 'react';

import { JOURNEY_STAGES } from '@/data/event';
import { Reveal } from '@/components/ui/Reveal';
import { SectionShell } from '@/components/ui/SectionShell';
import { cn } from '@/lib/utils';

export function Journey() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const reduce = useReducedMotion();
  const tablistRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const stage = JOURNEY_STAGES[index];

  const go = useCallback(
    (next: number) => {
      const wrapped = (next + JOURNEY_STAGES.length) % JOURNEY_STAGES.length;
      setDirection(wrapped > index || (index === JOURNEY_STAGES.length - 1 && wrapped === 0) ? 1 : -1);
      setIndex(wrapped);
    },
    [index],
  );

  const onTabKeyDown = (e: React.KeyboardEvent, i: number) => {
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
    <SectionShell
      id="journey"
      index="03"
      kicker="The arc"
      title="Four stages"
      lede={
        <p>
          Every team travels the same arc on the day — from a raw problem to an idea worth
          remembering. Pick a stage to see what it asks of you.
        </p>
      }
    >
      <div className="grid gap-8 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <div
            ref={tablistRef}
            role="tablist"
            aria-label="Journey stages"
            className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0"
          >
            {JOURNEY_STAGES.map((s, i) => {
              const selected = i === index;
              return (
                <button
                  key={s.id}
                  role="tab"
                  id={`${panelId}-tab-${s.id}`}
                  aria-selected={selected}
                  aria-controls={panelId}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => go(i)}
                  onKeyDown={(e) => onTabKeyDown(e, i)}
                  className={cn(
                    'group flex min-h-[64px] min-w-[220px] flex-1 items-center gap-4 rounded-xl border p-4 text-left transition-colors lg:min-w-0',
                    selected
                      ? 'border-ink bg-ink text-paper'
                      : 'border-line bg-card text-ink hover:border-ink/50',
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      'font-display text-2xl font-semibold',
                      selected ? 'text-paper/60' : 'text-ink/30',
                    )}
                  >
                    {s.step}
                  </span>
                  <span>
                    <span className="block font-display text-xl font-semibold leading-tight">
                      {s.name}
                    </span>
                    <span
                      className={cn(
                        'mt-0.5 block text-[13px]',
                        selected ? 'text-paper/70' : 'text-muted',
                      )}
                    >
                      {s.tagline}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={0.08} className="lg:col-span-7">
          <div className="relative h-full min-h-[320px] overflow-hidden rounded-xl border border-ink/25 bg-ink p-8 text-paper md:p-10">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-4 -top-8 select-none font-display text-[11rem] font-bold leading-none text-paper/[0.06]"
            >
              {stage.step}
            </span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={stage.id}
                role="tabpanel"
                id={panelId}
                aria-labelledby={`${panelId}-tab-${stage.id}`}
                initial={reduce ? { opacity: 0 } : { opacity: 0, x: 28 * direction }}
                animate={reduce ? { opacity: 1 } : { opacity: 1, x: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, x: -20 * direction }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="text-[12px] font-bold uppercase tracking-[0.24em] text-paper/50">
                  Stage {stage.step} of 04
                </p>
                <h3 className="mt-2 font-display text-4xl font-semibold md:text-5xl">
                  {stage.name}
                </h3>
                <p className="mt-2 text-lg text-paper/75">{stage.tagline}</p>
                <p className="mt-5 max-w-xl leading-relaxed text-paper/85">{stage.description}</p>
                <figure className="mt-7 flex max-w-xl gap-3 rounded-lg border border-paper/15 bg-paper/[0.06] p-5">
                  <Quote size={20} aria-hidden="true" className="mt-0.5 flex-none text-ember" />
                  <div>
                    <blockquote className="font-display text-lg italic leading-snug">
                      {stage.prompt}
                    </blockquote>
                    <figcaption className="mt-2 text-[12px] font-bold uppercase tracking-[0.18em] text-paper/50">
                      Ask yourselves
                    </figcaption>
                  </div>
                </figure>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex items-center justify-between gap-4 border-t border-paper/15 pt-6">
              <div className="flex gap-2" aria-hidden="true">
                {JOURNEY_STAGES.map((s, i) => (
                  <span
                    key={s.id}
                    className={cn(
                      'h-1.5 rounded-full transition-all duration-300',
                      i === index ? 'w-10 bg-ember' : 'w-4 bg-paper/25',
                    )}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => go(index - 1)}
                  aria-label="Previous stage"
                  className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-paper/25 transition-colors hover:border-paper hover:bg-paper/10"
                >
                  <ArrowLeft size={18} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => go(index + 1)}
                  aria-label="Next stage"
                  className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-paper/25 transition-colors hover:border-paper hover:bg-paper/10"
                >
                  <ArrowRight size={18} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
      <p className="mt-6 text-sm text-muted">
        Stage descriptions are explanatory, not additional event rules.
      </p>
    </SectionShell>
  );
}
