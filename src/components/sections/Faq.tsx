'use client';

import { ChevronDown, Search, SearchX } from 'lucide-react';
import { useMemo, useState } from 'react';

import { FAQS } from '@/data/event';
import { Reveal } from '@/components/ui/Reveal';
import { SectionShell } from '@/components/ui/SectionShell';
import { cn } from '@/lib/utils';

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

  const expandAll = () => setOpen(new Set(results.map((r) => r.id)));
  const collapseAll = () => setOpen(new Set());

  return (
    <SectionShell
      id="faq"
      index="07"
      kicker="Answers"
      title="Common questions"
      lede={
        <p>
          {FAQS.length} questions, answered straight. Search to filter the list — try “fee”,
          “venue”, or “certificates”.
        </p>
      }
    >
      <div className="grid gap-8 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <label
              htmlFor="faq-search"
              className="text-[12px] font-bold uppercase tracking-[0.2em] text-muted"
            >
              Search questions
            </label>
            <div className="relative mt-3">
              <Search
                size={18}
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                id="faq-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="fee, venue, PPT…"
                autoComplete="off"
                className="min-h-[52px] w-full rounded-xl border border-ink/25 bg-card pl-11 pr-11 text-[16px] placeholder:text-muted/70 focus:border-ember"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 flex min-h-[36px] min-w-[36px] -translate-y-1/2 items-center justify-center rounded-lg text-muted hover:bg-parchment hover:text-ink"
                >
                  ×
                </button>
              )}
            </div>
            <p role="status" aria-live="polite" className="mt-3 text-[14px] text-inksoft">
              {query.trim()
                ? `${results.length} of ${FAQS.length} questions match “${query.trim()}”.`
                : `Showing all ${FAQS.length} questions.`}
            </p>
            {results.length > 0 && (
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={expandAll}
                  className="min-h-[40px] rounded-lg border border-line bg-card px-4 text-[14px] font-semibold hover:border-ink"
                >
                  Expand all
                </button>
                <button
                  type="button"
                  onClick={collapseAll}
                  className="min-h-[40px] rounded-lg border border-line bg-card px-4 text-[14px] font-semibold hover:border-ink"
                >
                  Collapse all
                </button>
              </div>
            )}
          </div>
        </Reveal>

        <div className="lg:col-span-8">
          {results.length === 0 ? (
            <div className="flex flex-col items-center rounded-xl border border-dashed border-ink/30 bg-card/60 px-6 py-16 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-parchment text-muted">
                <SearchX size={22} aria-hidden="true" />
              </span>
              <p className="mt-4 font-display text-2xl font-semibold">No questions match.</p>
              <p className="mt-2 max-w-sm text-[15px] text-inksoft">
                Nothing here mentions “{query.trim()}”. Try a different word, or clear the search
                to browse everything.
              </p>
              <button
                type="button"
                onClick={() => setQuery('')}
                className="mt-6 min-h-[44px] rounded-lg bg-ink px-5 font-semibold text-paper hover:bg-ember-deep"
              >
                Clear search
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-line rounded-xl border border-line bg-card">
              {results.map((faq, i) => {
                const isOpen = query.trim() ? true : open.has(faq.id);
                const panelId = `faq-panel-${faq.id}`;
                return (
                  <li key={faq.id}>
                    <Reveal delay={Math.min(i, 5) * 0.04}>
                      <h3>
                        <button
                          type="button"
                          onClick={() => toggle(faq.id)}
                          aria-expanded={isOpen}
                          aria-controls={panelId}
                          className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                        >
                          <span className="text-[17px] font-semibold leading-snug">{faq.q}</span>
                          <span
                            aria-hidden="true"
                            className={cn(
                              'flex h-8 w-8 flex-none items-center justify-center rounded-full border transition-transform duration-300',
                              isOpen
                                ? 'rotate-180 border-ember bg-ember text-paper'
                                : 'border-ink/20 text-ink',
                            )}
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
                          <p className="px-6 pb-6 leading-relaxed text-inksoft">{faq.a}</p>
                        </div>
                      </div>
                    </Reveal>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </SectionShell>
  );
}
