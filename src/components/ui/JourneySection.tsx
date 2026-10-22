import type { ReactNode } from 'react';

import type { SectionId } from '@/data/event';
import { destinationById } from '@/data/journey';
import { cn } from '@/lib/utils';
import { Reveal } from './Reveal';

interface JourneySectionProps {
  id: SectionId;
  kicker: string;
  title: string;
  lede?: ReactNode;
  children: ReactNode;
}

/**
 * Standard destination stop: a full-height stage where the neural camera
 * settles on the section's node while the HTML panel sits on the side the
 * destination definition reserves for it.
 */
export function JourneySection({ id, kicker, title, lede, children }: JourneySectionProps) {
  const def = destinationById(id);
  const headingId = `${id}-heading`;
  const align =
    def.side === 'left' ? 'justify-start' : def.side === 'center' ? 'justify-center' : 'justify-end';

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="relative z-10 flex min-h-[100svh] scroll-mt-16 items-center md:scroll-mt-20"
    >
      <div className={cn('mx-auto flex w-full max-w-stage px-5 py-28 md:px-8', align)}>
        <Reveal
          className={cn('w-full', def.side === 'center' ? 'max-w-3xl' : 'max-w-[560px]')}
        >
          <div
            className="rounded-2xl border border-white/10 bg-[rgba(17,28,43,0.92)] p-6 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.8)] backdrop-blur-sm md:p-8"
            style={{ borderTop: `2px solid ${def.accent}` }}
          >
            <p
              className="font-mono text-[12px] font-semibold uppercase tracking-[0.22em]"
              style={{ color: def.accent }}
            >
              {def.index} · {kicker}
            </p>
            <h2
              id={headingId}
              className="mt-3 font-display text-4xl font-semibold leading-[1.05] tracking-tight md:text-5xl"
            >
              {title}
            </h2>
            {lede ? <div className="mt-4 text-[16px] leading-relaxed text-fog md:text-[17px]">{lede}</div> : null}
            <div className="mt-7">{children}</div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
