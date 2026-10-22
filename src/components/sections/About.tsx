import { Lightbulb, Presentation, Users } from 'lucide-react';

import { EVENT } from '@/data/event';
import { Reveal } from '@/components/ui/Reveal';
import { SectionShell } from '@/components/ui/SectionShell';

const PILLARS = [
  {
    icon: Lightbulb,
    title: 'Identify problems',
    body: 'Find a problem worth solving and say clearly who it affects.',
  },
  {
    icon: Users,
    title: 'Develop concepts',
    body: 'Shape the spark into a concept a stranger could understand.',
  },
  {
    icon: Presentation,
    title: 'Present ideas',
    body: 'Communicate the concept through a structured PowerPoint.',
  },
];

export function About() {
  return (
    <SectionShell
      id="about"
      index="01"
      kicker="The brief"
      title="About the event"
      lede={
        <p>
          IDEATRIX gives students a platform to identify problems, develop creative concepts, and
          communicate innovative ideas through structured PowerPoint presentations.
        </p>
      }
    >
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <dl className="divide-y divide-line border-y border-line">
            {PILLARS.map((pillar, i) => (
              <Reveal key={pillar.title} delay={i * 0.06}>
                <div className="grid gap-3 py-6 sm:grid-cols-[48px_1fr] sm:gap-5">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/20 bg-card text-ember-deep">
                    <pillar.icon size={22} aria-hidden="true" />
                  </span>
                  <div>
                    <dt className="font-display text-2xl font-semibold">{pillar.title}</dt>
                    <dd className="mt-1 max-w-lg leading-relaxed text-inksoft">{pillar.body}</dd>
                  </div>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
        <Reveal delay={0.1} className="lg:col-span-5">
          <aside className="blueprint h-full rounded-xl border border-ink/25 bg-card p-7 md:p-8">
            <p className="text-[12px] font-bold uppercase tracking-[0.22em] text-ember">
              Organised by
            </p>
            <ul className="mt-5 space-y-5">
              {EVENT.organisers.map((org, i) => (
                <li key={org.short} className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="font-display text-lg font-semibold text-ink/30"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p className="font-semibold leading-snug">{org.name}</p>
                    <p className="mt-0.5 text-sm uppercase tracking-[0.14em] text-muted">
                      {org.short}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="ticket-edge my-6" aria-hidden="true" />
            <p className="text-[15px] leading-relaxed text-inksoft">
              One day, one deck, one idea — presented live in front of fellow students.
            </p>
          </aside>
        </Reveal>
      </div>
    </SectionShell>
  );
}
