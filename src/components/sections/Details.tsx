import { MapPin } from 'lucide-react';

import { EVENT } from '@/data/event';
import { JourneySection } from '@/components/ui/JourneySection';
import { Stamp } from '@/components/ui/Stamp';

export function Details() {
  const facts = [
    { ref: 'D1', label: 'Date', value: EVENT.date.display, note: EVENT.date.yearNote, stamp: true },
    { ref: 'D2', label: 'Reporting', value: EVENT.time.reporting, note: 'Be there before it starts.', stamp: false },
    { ref: 'D3', label: 'Scheduled end', value: EVENT.time.end, note: 'One full day, start to finish.', stamp: false },
    { ref: 'D4', label: 'Team size', value: `${EVENT.team.maxMembers} members`, note: 'Solo entries welcome.', stamp: false },
    { ref: 'D5', label: 'Fee', value: `₹${EVENT.team.feeINR} / team`, note: 'One fee, whole team.', stamp: false },
    { ref: 'D6', label: 'Format', value: 'PowerPoint', note: 'Bring your deck ready.', stamp: false },
  ];

  return (
    <JourneySection
      id="details"
      kicker="Fact sheet"
      title="Event details"
      lede={
        <p>
          Everything confirmed so far, in one place. Anything still marked provisional will be
          updated here the moment the organisers announce it.
        </p>
      }
    >
      <dl className="grid gap-3 sm:grid-cols-2">
        {facts.map((fact) => (
          <div key={fact.ref} className="rounded-xl border border-white/10 bg-raised/70 p-4">
            <div className="flex items-center justify-between gap-2">
              <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-mute">
                {fact.label}
              </dt>
              <span aria-hidden="true" className="font-mono text-[11px] text-mute/70">
                {fact.ref}
              </span>
            </div>
            <dd className="mt-1.5 font-display text-[22px] font-semibold leading-tight">
              {fact.value}
            </dd>
            <dd className="mt-2 text-[13px] text-fog">
              {fact.stamp ? <Stamp tone="gold">{fact.note}</Stamp> : fact.note}
            </dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 flex items-start gap-4 rounded-xl border border-amber-400/30 bg-amber-400/[0.07] p-5">
        <span
          aria-hidden="true"
          className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-amber-400/15 text-amber-300"
        >
          <MapPin size={20} />
        </span>
        <div className="flex-1">
          <p className="font-display text-xl font-semibold">{EVENT.venue.name}</p>
          <p className="mt-1 text-[14px] text-fog">{EVENT.venue.note}</p>
        </div>
        <Stamp tone="gold">Provisional</Stamp>
      </div>
    </JourneySection>
  );
}
