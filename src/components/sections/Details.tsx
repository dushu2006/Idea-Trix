import { MapPin } from 'lucide-react';

import { EVENT } from '@/data/event';
import { Reveal } from '@/components/ui/Reveal';
import { SectionShell } from '@/components/ui/SectionShell';
import { Stamp } from '@/components/ui/Stamp';

export function Details() {
  const facts = [
    {
      ref: 'D1',
      label: 'Date',
      value: EVENT.date.display,
      note: EVENT.date.yearNote,
      stamp: true,
    },
    {
      ref: 'D2',
      label: 'Reporting time',
      value: EVENT.time.reporting,
      note: 'Be there before it starts.',
      stamp: false,
    },
    {
      ref: 'D3',
      label: 'Scheduled end',
      value: EVENT.time.end,
      note: 'One full day, start to finish.',
      stamp: false,
    },
    {
      ref: 'D4',
      label: 'Maximum team size',
      value: `${EVENT.team.maxMembers} members`,
      note: 'Solo entries are welcome.',
      stamp: false,
    },
    {
      ref: 'D5',
      label: 'Registration fee',
      value: `₹${EVENT.team.feeINR} per team`,
      note: 'One fee covers the whole team.',
      stamp: false,
    },
    {
      ref: 'D6',
      label: 'Presentation format',
      value: 'PowerPoint',
      note: 'Bring your deck ready to present.',
      stamp: false,
    },
  ];

  return (
    <SectionShell
      id="details"
      index="02"
      kicker="Fact sheet"
      title="Event details"
      lede={
        <p>
          Everything confirmed so far, in one place. Anything still marked provisional will be
          updated here the moment the organisers announce it.
        </p>
      }
    >
      <dl className="grid gap-px overflow-hidden rounded-xl border border-ink/25 bg-line sm:grid-cols-2 lg:grid-cols-3">
        {facts.map((fact, i) => (
          <Reveal key={fact.ref} delay={(i % 3) * 0.06} className="bg-card">
            <div className="flex h-full min-h-[168px] flex-col p-6">
              <div className="flex items-center justify-between">
                <dt className="text-[12px] font-bold uppercase tracking-[0.18em] text-muted">
                  {fact.label}
                </dt>
                <span aria-hidden="true" className="font-display text-sm text-ink/30">
                  {fact.ref}
                </span>
              </div>
              <dd className="mt-2 font-display text-[28px] font-semibold leading-tight">
                {fact.value}
              </dd>
              <dd className="mt-auto flex items-center gap-2 pt-3 text-[14px] text-inksoft">
                {fact.stamp ? <Stamp>{fact.note}</Stamp> : fact.note}
              </dd>
            </div>
          </Reveal>
        ))}
      </dl>

      <Reveal delay={0.08}>
        <div className="mt-6 flex flex-col gap-4 rounded-xl border border-gold/50 bg-gold-soft/60 p-6 sm:flex-row sm:items-center md:p-7">
          <span className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-ink text-paper">
            <MapPin size={22} aria-hidden="true" />
          </span>
          <div className="flex-1">
            <p className="font-display text-2xl font-semibold">{EVENT.venue.name}</p>
            <p className="mt-1 text-[15px] text-inksoft">{EVENT.venue.note}</p>
          </div>
          <Stamp tone="gold" className="self-start sm:self-center">
            Provisional venue
          </Stamp>
        </div>
      </Reveal>
    </SectionShell>
  );
}
