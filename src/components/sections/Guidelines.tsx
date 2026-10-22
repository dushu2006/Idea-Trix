import { Check, Info } from 'lucide-react';

import { GUIDELINES } from '@/data/event';
import { JourneySection } from '@/components/ui/JourneySection';

export function Guidelines() {
  return (
    <JourneySection
      id="guidelines"
      kicker="Fine print"
      title="Before you register"
      lede={
        <p>
          Four things to confirm before you sign up. If your team clears this list, you’re ready
          for the registration node at the end of the journey.
        </p>
      }
    >
      <ul className="grid gap-3">
        {GUIDELINES.map((rule) => (
          <li
            key={rule.title}
            className="flex gap-4 rounded-xl border border-white/10 bg-raised/70 p-4"
          >
            <span
              aria-hidden="true"
              className="flex h-9 w-9 flex-none items-center justify-center rounded-full font-bold text-inkbtn"
              style={{ backgroundColor: '#FBBF24' }}
            >
              <Check size={18} strokeWidth={3} />
            </span>
            <div>
              <p className="text-[16px] font-semibold leading-snug">{rule.title}</p>
              <p className="mt-0.5 text-[14px] text-fog">{rule.note}</p>
            </div>
          </li>
        ))}
      </ul>
      <aside className="mt-4 flex gap-3 rounded-xl border border-white/10 bg-void/60 p-5">
        <Info size={19} aria-hidden="true" className="mt-0.5 flex-none text-amber-300" />
        <p className="text-[14px] leading-relaxed text-fog">
          <strong className="font-semibold text-mist">More rules may follow. </strong>
          Additional official guidelines will be added here when announced. What you see above is
          the complete list for now — nothing is hidden.
        </p>
      </aside>
    </JourneySection>
  );
}
