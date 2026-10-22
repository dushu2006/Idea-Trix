import Link from 'next/link';

import { EVENT, SECTIONS } from '@/data/event';

export function Footer() {
  return (
    <footer className="border-t-2 border-ink bg-ink text-paper">
      <div className="mx-auto max-w-ledger px-5 py-14 md:px-8 md:py-16">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-display text-3xl font-bold">IDEATRIX</p>
            <p className="mt-3 max-w-sm leading-relaxed text-paper/70">
              {EVENT.kind} by the {EVENT.organisers[0].name} and {EVENT.organisers[1].name},{' '}
              {EVENT.organisers[2].name}.
            </p>
          </div>
          <nav aria-label="Footer" className="md:col-span-4">
            <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-paper/50">
              Sections
            </p>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5">
              {SECTIONS.filter((s) => s.id !== 'hero').map((s) => (
                <li key={s.id}>
                  <Link href={`#${s.id}`} className="text-[15px] text-paper/80 hover:text-paper hover:underline">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="md:col-span-3">
            <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-paper/50">
              Key facts
            </p>
            <ul className="mt-4 space-y-2.5 text-[15px] text-paper/80">
              <li>
                {EVENT.date.display} · {EVENT.date.yearNote}
              </li>
              <li>
                {EVENT.time.reporting} – {EVENT.time.end}
              </li>
              <li>Teams of up to {EVENT.team.maxMembers} · ₹{EVENT.team.feeINR} per team</li>
              <li>{EVENT.venue.name} (provisional)</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-paper/15 pt-6 text-[13px] leading-relaxed text-paper/55">
          <p>
            Details marked provisional or “to be confirmed” are not yet official. Registration on
            this site runs in demo mode: no payment is taken and no confirmation email is sent.
          </p>
        </div>
      </div>
    </footer>
  );
}
