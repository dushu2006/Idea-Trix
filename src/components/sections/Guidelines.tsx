import { Check, Info } from 'lucide-react';

import { GUIDELINES } from '@/data/event';
import { Reveal } from '@/components/ui/Reveal';
import { SectionShell } from '@/components/ui/SectionShell';

export function Guidelines() {
  return (
    <SectionShell
      id="guidelines"
      index="05"
      kicker="Fine print"
      title="Before you register"
      lede={
        <p>
          Four things to confirm before you sign up. If your team clears this list, you’re ready
          for the form at the bottom of the page.
        </p>
      }
    >
      <div className="grid gap-8 lg:grid-cols-12">
        <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
          {GUIDELINES.map((rule, i) => (
            <li key={rule.title} className="h-full">
              <Reveal delay={i * 0.06} className="h-full">
                <div className="flex h-full gap-4 rounded-xl border border-line bg-card p-6">
                  <span
                    aria-hidden="true"
                    className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-ember font-bold text-paper"
                  >
                    <Check size={18} strokeWidth={3} />
                  </span>
                  <div>
                    <p className="text-lg font-semibold leading-snug">{rule.title}</p>
                    <p className="mt-1 text-[15px] text-inksoft">{rule.note}</p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
        <Reveal delay={0.1} className="lg:col-span-4">
          <aside className="flex h-full flex-col rounded-xl border border-ink bg-ink p-7 text-paper">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-paper/10">
              <Info size={20} aria-hidden="true" className="text-ember" />
            </span>
            <p className="mt-4 font-display text-2xl font-semibold leading-snug">
              More rules may follow.
            </p>
            <p className="mt-2 leading-relaxed text-paper/75">
              Additional official guidelines will be added here when announced. What you see above
              is the complete list for now — nothing is hidden.
            </p>
          </aside>
        </Reveal>
      </div>
    </SectionShell>
  );
}
