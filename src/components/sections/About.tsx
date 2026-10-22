import { Lightbulb, Presentation, Users } from 'lucide-react';

import { EVENT } from '@/data/event';
import { JourneySection } from '@/components/ui/JourneySection';

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
    <JourneySection
      id="about"
      kicker="The brief"
      title={EVENT.aboutHeading}
      lede={<p>{EVENT.aboutBody}</p>}
    >
      <ul className="space-y-4">
        {PILLARS.map((pillar) => (
          <li key={pillar.title} className="flex gap-4">
            <span
              aria-hidden="true"
              className="flex h-11 w-11 flex-none items-center justify-center rounded-full border border-white/15 bg-raised"
              style={{ color: '#FB923C' }}
            >
              <pillar.icon size={20} />
            </span>
            <div>
              <p className="font-display text-xl font-semibold leading-snug">{pillar.title}</p>
              <p className="mt-0.5 text-[15px] leading-relaxed text-fog">{pillar.body}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-7 border-t border-white/10 pt-6">
        <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-mute">Organised by</p>
        <ol className="mt-4 space-y-3">
          {EVENT.organisers.map((org, i) => (
            <li key={org.short} className="flex items-baseline gap-3">
              <span aria-hidden="true" className="font-mono text-[13px] text-mute">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="text-[15px] font-medium leading-snug">{org.name}</p>
            </li>
          ))}
        </ol>
      </div>
    </JourneySection>
  );
}
