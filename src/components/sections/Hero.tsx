'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { EVENT } from '@/data/event';
import { IdeaField } from '@/components/visual/IdeaField';
import { Stamp } from '@/components/ui/Stamp';

const FACTS = [
  { label: 'Date', value: EVENT.date.display, stamp: EVENT.date.yearNote },
  { label: 'Reporting – end', value: `${EVENT.time.reporting} – ${EVENT.time.end}`, stamp: null },
  {
    label: 'Team size',
    value: `Up to ${EVENT.team.maxMembers}`,
    stamp: null,
  },
  { label: 'Fee', value: `₹${EVENT.team.feeINR} / team`, stamp: null },
  { label: 'Venue', value: EVENT.venue.name, stamp: 'Provisional' },
] as const;

export function Hero() {
  const reduce = useReducedMotion();
  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 28 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section id="hero" aria-labelledby="hero-heading" className="relative overflow-hidden">
      <IdeaField className="pointer-events-none absolute inset-0 h-full w-full opacity-70" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-paper/40 via-transparent to-paper"
      />
      <div className="relative mx-auto max-w-ledger px-5 pb-14 pt-32 md:px-8 md:pb-20 md:pt-44">
        <motion.div {...rise(0)}>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px] font-bold uppercase tracking-[0.22em] text-inksoft">
            <span className="text-ember">{EVENT.edition} — Ideathon</span>
            <span aria-hidden="true" className="h-3 w-px bg-ink/30" />
            <span>AI &amp; DS × Matrix Club · VIIT</span>
          </p>
        </motion.div>

        <motion.h1
          id="hero-heading"
          {...rise(0.08)}
          className="mt-6 max-w-4xl font-display text-[clamp(2.9rem,7.5vw,5.5rem)] font-medium leading-[1.02] tracking-tight"
        >
          Turn a problem into a{' '}
          <span className="relative inline-block text-ember-deep">
            presentable idea.
            <svg
              aria-hidden="true"
              viewBox="0 0 320 14"
              preserveAspectRatio="none"
              className="absolute -bottom-1 left-0 h-3 w-full text-ember/60"
            >
              <path
                d="M4 10 C 60 3, 120 12, 170 7 S 280 4, 316 8"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </motion.h1>

        <div className="mt-8 grid gap-10 md:grid-cols-12 md:items-end">
          <motion.div {...rise(0.16)} className="md:col-span-6">
            <p className="max-w-xl text-lg leading-relaxed text-inksoft md:text-xl">
              {EVENT.description} Registration is{' '}
              <strong className="font-semibold text-ink">₹{EVENT.team.feeINR} per team</strong> —
              organised by the {EVENT.organisers[0].name} and {EVENT.organisers[1].name}.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="#register"
                className="inline-flex min-h-[52px] items-center gap-2 rounded-lg bg-ember px-7 text-[16px] font-semibold text-paper transition-colors hover:bg-ember-deep"
              >
                Register your team
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link
                href="#about"
                className="inline-flex min-h-[52px] items-center rounded-lg border border-ink/25 bg-card/70 px-7 text-[16px] font-semibold text-ink transition-colors hover:border-ink hover:bg-card"
              >
                About the event
              </Link>
            </div>
          </motion.div>

          <motion.dl
            {...rise(0.24)}
            className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3 md:col-span-6 lg:grid-cols-5"
            aria-label="Event facts"
          >
            {FACTS.map((fact, i) => (
              <div
                key={fact.label}
                className={
                  i === FACTS.length - 1
                    ? 'flex min-h-[104px] flex-col justify-between gap-2 bg-card p-4 max-sm:col-span-2'
                    : 'flex min-h-[104px] flex-col justify-between gap-2 bg-card p-4'
                }
              >
                <dt className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
                  {fact.label}
                </dt>
                <dd className="font-display text-[19px] font-semibold leading-tight">{fact.value}</dd>
                {fact.stamp ? (
                  <dd>
                    <Stamp>{fact.stamp}</Stamp>
                  </dd>
                ) : null}
              </div>
            ))}
            <div className="hidden bg-card p-4 sm:block lg:hidden" aria-hidden="true" />
          </motion.dl>
        </div>

        <motion.div {...rise(0.32)} className="mt-12 flex items-center gap-3 text-muted">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-card">
            <ArrowDown size={16} aria-hidden="true" className={reduce ? '' : 'animate-bounce'} />
          </span>
          <p className="text-sm font-medium uppercase tracking-[0.18em]">
            Eight entries below — start with the story
          </p>
        </motion.div>
      </div>
    </section>
  );
}
