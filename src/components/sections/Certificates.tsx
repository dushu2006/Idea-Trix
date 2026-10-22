import { Award, MailCheck } from 'lucide-react';

import { CERTIFICATES } from '@/data/event';
import { JourneySection } from '@/components/ui/JourneySection';
import { Stamp } from '@/components/ui/Stamp';

const ICONS = { digital: MailCheck, physical: Award } as const;

export function Certificates() {
  return (
    <JourneySection
      id="certificates"
      kicker="Takeaways"
      title="Certificates"
      lede={
        <p>
          Everyone who takes part goes home recognised; the top five teams take home something to
          hold. Here’s exactly how each kind reaches you.
        </p>
      }
    >
      <div className="grid gap-4">
        {CERTIFICATES.map((cert) => {
          const Icon = ICONS[cert.id as keyof typeof ICONS];
          return (
            <article
              key={cert.id}
              className="relative rounded-xl border border-white/10 bg-raised/70 p-5"
            >
              <span
                aria-hidden="true"
                className="absolute left-5 top-5 h-8 w-8 rounded-tl-lg border-l-2 border-t-2 border-rose-400/50"
              />
              <span
                aria-hidden="true"
                className="absolute bottom-5 right-5 h-8 w-8 rounded-br-lg border-b-2 border-r-2 border-rose-400/50"
              />
              <div className="flex items-start justify-between gap-3 pl-6">
                <span
                  aria-hidden="true"
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-400/15 text-rose-300"
                >
                  <Icon size={22} />
                </span>
                <Stamp tone={cert.id === 'digital' ? 'ink' : 'ember'}>
                  {cert.id === 'digital' ? 'All participants' : 'Top 5 only'}
                </Stamp>
              </div>
              <h3 className="mt-4 pl-6 font-display text-[22px] font-semibold leading-tight">
                {cert.title}
              </h3>
              <p className="mt-1.5 pl-6 text-[15px] leading-relaxed text-fog">{cert.body}</p>
              <p className="mt-3 pl-6 text-[13px] font-medium text-mute">{cert.footnote}</p>
            </article>
          );
        })}
      </div>
    </JourneySection>
  );
}
