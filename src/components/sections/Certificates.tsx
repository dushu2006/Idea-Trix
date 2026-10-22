import { Award, MailCheck } from 'lucide-react';

import { CERTIFICATES } from '@/data/event';
import { Reveal } from '@/components/ui/Reveal';
import { SectionShell } from '@/components/ui/SectionShell';
import { Stamp } from '@/components/ui/Stamp';

const ICONS = { digital: MailCheck, physical: Award } as const;

export function Certificates() {
  return (
    <SectionShell
      id="certificates"
      index="06"
      kicker="Takeaways"
      title="Certificates"
      lede={
        <p>
          Everyone who takes part goes home recognised; the top five teams take home something to
          hold. Here’s exactly how each kind reaches you.
        </p>
      }
    >
      <div className="grid gap-5 md:grid-cols-2">
        {CERTIFICATES.map((cert, i) => {
          const Icon = ICONS[cert.id as keyof typeof ICONS];
          return (
            <Reveal key={cert.id} delay={i * 0.07} className="h-full">
              <article className="flex h-full flex-col rounded-xl border border-ink/25 bg-card p-7 md:p-8">
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink text-paper">
                    <Icon size={24} aria-hidden="true" />
                  </span>
                  <Stamp tone={cert.id === 'digital' ? 'ink' : 'ember'}>
                    {cert.id === 'digital' ? 'All participants' : 'Top 5 only'}
                  </Stamp>
                </div>
                <h3 className="mt-5 font-display text-[26px] font-semibold leading-tight">
                  {cert.title}
                </h3>
                <p className="mt-2 leading-relaxed text-inksoft">{cert.body}</p>
                <div className="ticket-edge my-5" aria-hidden="true" />
                <p className="mt-auto text-[14px] font-medium text-muted">{cert.footnote}</p>
              </article>
            </Reveal>
          );
        })}
      </div>
    </SectionShell>
  );
}
