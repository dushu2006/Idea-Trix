import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';
import { Reveal } from './Reveal';

interface SectionShellProps {
  id: string;
  index: string;
  kicker: string;
  title: string;
  lede?: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * Editorial section scaffold: oversized index numeral, kicker + display
 * title, and an offset lede column. Keeps every section on the same grid
 * while leaving the body free for section-specific layouts.
 */
export function SectionShell({ id, index, kicker, title, lede, children, className }: SectionShellProps) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} aria-labelledby={headingId} className={cn('scroll-mt-24 border-t border-line', className)}>
      <div className="mx-auto max-w-ledger px-5 py-16 md:px-8 md:py-24">
        <div className="grid gap-8 md:grid-cols-12 md:gap-6">
          <Reveal className="md:col-span-2">
            <span aria-hidden="true" className="font-display text-6xl leading-none text-ink/15 md:text-7xl">
              {index}
            </span>
          </Reveal>
          <Reveal delay={0.06} className="md:col-span-5">
            <p className="text-[13px] font-bold uppercase tracking-[0.22em] text-ember">{kicker}</p>
            <h2 id={headingId} className="mt-3 font-display text-4xl leading-[1.05] md:text-5xl">
              {title}
            </h2>
          </Reveal>
          {lede ? (
            <Reveal delay={0.12} className="md:col-span-5 md:pt-9">
              <div className="max-w-md text-[17px] leading-relaxed text-inksoft md:ml-auto">{lede}</div>
            </Reveal>
          ) : null}
        </div>
        <div className="mt-12 md:mt-16">{children}</div>
      </div>
    </section>
  );
}
