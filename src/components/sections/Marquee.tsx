const WORDS = ['Imagine', 'Develop', 'Present', 'Inspire'];

/** Editorial ticker divider between the hero and the first entry. Decorative. */
export function Marquee() {
  const row = [...WORDS, ...WORDS, ...WORDS];
  return (
    <div aria-hidden="true" className="overflow-hidden border-y border-ink bg-ink py-3 text-paper">
      <div className="marquee-track flex w-max items-center gap-8 whitespace-nowrap">
        {[0, 1].map((half) => (
          <div key={half} className="flex items-center gap-8">
            {row.map((word, i) => (
              <span key={`${half}-${i}`} className="flex items-center gap-8">
                <span className="font-display text-xl italic">{word}</span>
                <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-paper/40">
                  Ideatrix
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-ember" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
