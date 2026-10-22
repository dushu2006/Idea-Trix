import { CalendarClock } from 'lucide-react';

import { SCHEDULE } from '@/data/event';
import { Reveal } from '@/components/ui/Reveal';
import { SectionShell } from '@/components/ui/SectionShell';
import { Stamp } from '@/components/ui/Stamp';
import { cn } from '@/lib/utils';

export function Schedule() {
  const confirmed = SCHEDULE.filter((s) => s.status === 'confirmed').length;

  return (
    <SectionShell
      id="schedule"
      index="04"
      kicker="Run of day"
      title="Schedule"
      lede={
        <>
          <p>
            {confirmed} of {SCHEDULE.length} entries are confirmed so far — the day opens with
            reporting and closes at 4:00 PM. The full programme will be announced closer to the
            event.
          </p>
          <p className="mt-3 flex items-center gap-2 text-[14px] font-semibold text-ink">
            <CalendarClock size={17} aria-hidden="true" className="text-ember-deep" />
            Reporting at 8:45 AM sharp.
          </p>
        </>
      }
    >
      <ol className="relative ml-2 border-l-2 border-dashed border-ink/25 pl-0 md:ml-6">
        {SCHEDULE.map((item, i) => (
          <li key={`${item.title}-${i}`} className="relative pb-10 pl-10 pr-2 last:pb-0">
            <span
              aria-hidden="true"
              className={cn(
                'absolute -left-[9px] top-1.5 h-4 w-4 rounded-full border-[3px]',
                item.status === 'confirmed'
                  ? 'border-ember bg-paper'
                  : 'border-ink/30 bg-paper',
              )}
            />
            <Reveal
              delay={i * 0.05}
              className="grid gap-1 md:grid-cols-[140px_1fr_auto] md:items-start md:gap-6"
            >
              <p
                className={cn(
                  'font-display text-2xl font-semibold leading-none md:pt-0.5',
                  item.status === 'tba' && 'text-muted',
                )}
              >
                {item.time}
              </p>
              <div>
                <h3 className="text-xl font-semibold leading-snug">{item.title}</h3>
                <p className="mt-1 text-[15px] text-inksoft">{item.note}</p>
              </div>
              <div className="pt-1">
                {item.status === 'confirmed' ? (
                  <Stamp tone="moss">Confirmed</Stamp>
                ) : (
                  <Stamp>To be announced</Stamp>
                )}
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </SectionShell>
  );
}
