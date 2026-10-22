'use client';

import { ArrowUp } from 'lucide-react';

import { EVENT, SECTIONS } from '@/data/event';
import { useJourney } from '@/components/journey/JourneyProvider';

export function Footer() {
  const { goTo } = useJourney();

  return (
    <footer
      id="site-footer"
      className="relative z-10 scroll-mt-20 border-t border-white/10 bg-void/85 backdrop-blur-sm"
    >
      <div className="mx-auto max-w-stage px-5 pb-36 pt-14 md:px-8 md:pb-14 md:pt-16">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-display text-3xl font-bold tracking-tight">IDEATRIX</p>
            <p className="mt-3 max-w-sm leading-relaxed text-fog">
              {EVENT.kind} by the {EVENT.organisers[0].name} and {EVENT.organisers[1].name},{' '}
              {EVENT.organisers[2].name}.
            </p>
            <button
              type="button"
              onClick={() => goTo('hero')}
              className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-white/15 bg-raised px-4 text-[15px] font-semibold text-mist transition-colors hover:border-beam/60"
            >
              <ArrowUp size={17} aria-hidden="true" />
              Back to the overview
            </button>
          </div>
          <nav aria-label="Footer" className="md:col-span-4">
            <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-mute">Sections</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5">
              {SECTIONS.filter((s) => s.id !== 'hero').map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      goTo(s.id);
                    }}
                    className="text-[15px] text-fog hover:text-mist hover:underline"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="md:col-span-3">
            <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-mute">Key facts</p>
            <ul className="mt-4 space-y-2.5 text-[15px] text-fog">
              <li>
                {EVENT.date.display} · {EVENT.date.yearNote}
              </li>
              <li>
                {EVENT.time.reporting} – {EVENT.time.end}
              </li>
              <li>
                Teams of up to {EVENT.team.maxMembers} · ₹{EVENT.team.feeINR} per team
              </li>
              <li>{EVENT.venue.name} (provisional)</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-white/10 pt-6 text-[13px] leading-relaxed text-mute">
          <p>
            Details marked provisional or “to be confirmed” are not yet official. Registration on
            this site runs in demo mode: no payment is taken and no confirmation email is sent.
          </p>
        </div>
      </div>
    </footer>
  );
}
