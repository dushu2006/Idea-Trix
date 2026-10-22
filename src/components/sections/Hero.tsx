'use client';

import { motion } from 'framer-motion';
import { ArrowDown, ArrowRight } from 'lucide-react';

import { EVENT } from '@/data/event';
import { useJourney } from '@/components/journey/JourneyProvider';
import { Stamp } from '@/components/ui/Stamp';

const FACTS = [
  { label: 'Date', value: EVENT.date.display, stamp: EVENT.date.yearNote },
  { label: 'Reporting – end', value: `${EVENT.time.reporting} – ${EVENT.time.end}`, stamp: null },
  { label: 'Team size', value: `Up to ${EVENT.team.maxMembers}`, stamp: null },
  { label: 'Fee', value: `₹${EVENT.team.feeINR} / team`, stamp: null },
  { label: 'Venue', value: EVENT.venue.name, stamp: 'Provisional' },
] as const;

export function Hero() {
  const { goTo, reduced } = useJourney();
  const rise = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 28 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative z-10 flex min-h-[100svh] scroll-mt-16 flex-col md:scroll-mt-20"
    >
      <div className="mx-auto grid w-full max-w-stage flex-1 gap-10 px-5 pb-10 pt-28 md:px-8 md:pt-40 lg:grid-cols-[42%_58%]">
        <div className="relative">
          {/* Soft scrim so the headline never fights the brain's left edge. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-10 bg-[radial-gradient(ellipse_70%_60%_at_35%_35%,rgba(8,15,25,0.82),rgba(8,15,25,0)_70%)]"
          />
          <div className="relative">
          <motion.p
            {...rise(0)}
            className="font-mono text-[12px] font-semibold uppercase tracking-[0.24em] text-turq md:text-[13px]"
          >
            {EVENT.attribution}
          </motion.p>
          <motion.h1
            id="hero-heading"
            {...rise(0.08)}
            className="mt-5 font-display text-[clamp(3rem,7vw,5.25rem)] font-bold leading-[1.02] tracking-tight"
          >
            Ideas connect here.
          </motion.h1>
          <motion.p {...rise(0.16)} className="mt-6 max-w-md text-lg leading-relaxed text-fog">
            {EVENT.description}
          </motion.p>
          <motion.div {...rise(0.24)} className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => goTo('register')}
              className="inline-flex min-h-[52px] items-center gap-2 rounded-lg bg-turq px-7 text-[16px] font-semibold text-inkbtn transition-transform hover:scale-[1.03]"
            >
              Register Your Team
              <ArrowRight size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => goTo('about')}
              className="inline-flex min-h-[52px] items-center rounded-lg border border-white/25 bg-panel/60 px-7 text-[16px] font-semibold text-mist backdrop-blur-sm transition-colors hover:border-beam/60"
            >
              Explore the Neural Journey
            </button>
          </motion.div>
          <motion.p
            {...rise(0.32)}
            className="mt-10 hidden items-center gap-3 font-mono text-[12px] uppercase tracking-[0.18em] text-mute lg:flex"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-panel/70">
              <ArrowDown size={16} aria-hidden="true" className={reduced ? '' : 'animate-bounce'} />
            </span>
            Scroll to travel the network
          </motion.p>
          </div>
        </div>
        {/* The right column belongs to the neural brain (fixed scene). */}
        <div aria-hidden="true" className="hidden lg:block" />
      </div>

      {/* Mobile window onto the brain between the CTAs and the facts. */}
      <div aria-hidden="true" className="h-[30vh] min-h-[220px] lg:hidden" />

      <div className="mx-auto w-full max-w-stage px-5 pb-36 md:px-8 md:pb-12">
        <motion.dl
          {...rise(0.3)}
          aria-label="Event facts"
          className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 backdrop-blur-sm sm:grid-cols-3 lg:grid-cols-5"
        >
          {FACTS.map((fact, i) => (
            <div
              key={fact.label}
              className={
                i === FACTS.length - 1
                  ? 'flex min-h-[104px] flex-col justify-between gap-2 bg-abyss/85 p-4 max-sm:col-span-2'
                  : 'flex min-h-[104px] flex-col justify-between gap-2 bg-abyss/85 p-4'
              }
            >
              <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-mute">
                {fact.label}
              </dt>
              <dd className="font-display text-[19px] font-semibold leading-tight">{fact.value}</dd>
              {fact.stamp ? (
                <dd>
                  <Stamp tone="gold">{fact.stamp}</Stamp>
                </dd>
              ) : null}
            </div>
          ))}
          <div className="hidden bg-abyss/85 p-4 sm:block lg:hidden" aria-hidden="true" />
        </motion.dl>
      </div>
    </section>
  );
}
