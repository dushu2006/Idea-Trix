import { SCHEDULE } from '@/data/event';
import { JourneySection } from '@/components/ui/JourneySection';
import { Stamp } from '@/components/ui/Stamp';
import { cn } from '@/lib/utils';

const ACCENT = '#38BDF8';

export function Schedule() {
  const confirmed = SCHEDULE.filter((s) => s.status === 'confirmed').length;

  return (
    <JourneySection
      id="schedule"
      kicker="Run of day"
      title="Schedule"
      lede={
        <p>
          {confirmed} of {SCHEDULE.length} entries are confirmed — the day opens with reporting
          and closes at 4:00 PM. The full programme will be announced closer to the event.
        </p>
      }
    >
      <ol className="relative border-l-2 border-dashed border-white/15 pl-0">
        {SCHEDULE.map((item, i) => (
          <li
            key={`${item.title}-${i}`}
            className="relative grid gap-1 pb-8 pl-8 last:pb-0 sm:grid-cols-[92px_1fr] sm:gap-4"
          >
            <span
              aria-hidden="true"
              className={cn(
                'absolute -left-[9px] top-1 h-4 w-4 rounded-full border-[3px] border-panel',
                item.status === 'confirmed' ? '' : 'opacity-60',
              )}
              style={{ backgroundColor: item.status === 'confirmed' ? ACCENT : '#3E687B' }}
            />
            <p
              className={cn(
                'font-display text-xl font-semibold leading-tight',
                item.status === 'tba' && 'text-mute',
              )}
            >
              {item.time}
            </p>
            <div>
              <h3 className="text-[16px] font-semibold leading-snug">{item.title}</h3>
              <p className="mt-0.5 text-[14px] text-fog">{item.note}</p>
              <div className="mt-2">
                {item.status === 'confirmed' ? (
                  <Stamp tone="moss">Confirmed</Stamp>
                ) : (
                  <Stamp tone="gold">To be announced</Stamp>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </JourneySection>
  );
}
