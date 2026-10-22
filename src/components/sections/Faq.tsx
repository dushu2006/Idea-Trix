'use client';

import { ChevronDown, Search, SearchX } from 'lucide-react';
import { useMemo, useState } from 'react';

import { FAQS } from '@/data/event';
import { JourneySection } from '@/components/ui/JourneySection';
import { cn } from '@/lib/utils';

const ACCENT = '#FB7185';

export function Faq() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<Set<string>>(() => new Set(['what']));

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return FAQS;
    return FAQS.filter((faq) =>
      `${faq.q} ${faq.a} ${faq.tags.join(' ')}`.toLowerCase().includes(q),
    );
  }, [query]);

  const toggle = (id: string) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <JourneySection
      id="faq"
      kicker="Answers"
      title="Common questions"
      lede={<p>{FAQS.length} questions, answered straight. Search to filter the list.</p>}
    >
      <div className="relative">
        <Search
          size={18}
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-mute"
        />
        <label htmlFor="faq-search" className="sr-only">
          Search questions
        </label>
        <input
          id="faq-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="fee, venue, PPT…"
          autoComplete="off"
          className="min-h-[52px] w-full rounded-xl border border-white/15 bg-void/70 pl-11 pr-11 text-[16px] text-mist placeholder:text-mute/70 focus:border-rose-400"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 flex min-h-[36px] min-w-[36px] -translate-y-1/2 items-center justify-center rounded-lg text-mute hover:bg-raised hover:text-mist"
          >
            ×
          </button>
        )}
      </div>
      <p role="status" aria-live="polite" className="mt-2.5 text-[13px] text-fog">
        {query.trim()
          ? `${results.length} of ${FAQS.length} match “${query.trim()}”.`
          : `Showing all ${FAQS.length} questions.`}
      </p>

      {results.length === 0 ? (
        <div className="mt-4 flex flex-col items-center rounded-xl border border-dashed border-white/20 bg-void/50 px-6 py-12 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-raised text-mute">
            <SearchX size={20} aria-hidden="true" />
          </span>
          <p className="mt-3 font-display text-xl font-semibold">No questions match.</p>
          <p className="mt-1.5 max-w-sm text-[14px] text-fog">
            Nothing here mentions “{query.trim()}”. Try a different word, or clear the search.
          </p>
          <button
            type="button"
            onClick={() => setQuery('')}
            className="mt-5 min-h-[44px] rounded-lg bg-mist px-5 text-[15px] font-semibold text-inkbtn"
          >
            Clear search
          </button>
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-white/10 rounded-xl border border-white/10 bg-void/50">
          {results.map((faq) => {
            const isOpen = query.trim() ? true : open.has(faq.id);
            const panelId = `faq-panel-${faq.id}`;
            return (
              <li key={faq.id}>
                <h3>
                  <button
                    type="button"
                    onClick={() => toggle(faq.id)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="text-[16px] font-semibold leading-snug">{faq.q}</span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        'flex h-8 w-8 flex-none items-center justify-center rounded-full border transition-all duration-300',
                        isOpen ? 'rotate-180 border-transparent' : 'border-white/20',
                      )}
                      style={isOpen ? { backgroundColor: ACCENT, color: '#08131B' } : undefined}
                    >
                      <ChevronDown size={16} />
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-label={faq.q}
                  data-open={isOpen}
                  className="acc-panel"
                >
                  <div className="acc-inner">
                    <p className="px-5 pb-5 text-[15px] leading-relaxed text-fog">{faq.a}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </JourneySection>
  );
}
