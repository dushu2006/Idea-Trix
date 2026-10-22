'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { HEADER_NAV, SECTIONS } from '@/data/event';
import { destinationById } from '@/data/journey';
import { useJourney } from '@/components/journey/JourneyProvider';
import { cn } from '@/lib/utils';

export function Header() {
  const { active, progress, goTo, reduced } = useJourney();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 12);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : '';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [open ]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open ]);

  const activeAccent = active === 'footer' ? '#22D3EE' : destinationById(active).accent;

  const navTo = (e: React.MouseEvent, id: (typeof SECTIONS)[number]['id']) => {
    e.preventDefault();
    setOpen(false);
    goTo(id);
  };

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300',
        scrolled || open ? 'border-white/10 bg-void/90 backdrop-blur-md' : 'border-transparent bg-void/40 backdrop-blur-sm',
      )}
    >
      {/* Journey progress in the active destination's accent */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[3px] origin-left"
        style={{ transform: `scaleX(${progress})`, backgroundColor: activeAccent }}
      />
      <div className="mx-auto flex h-16 max-w-stage items-center justify-between gap-4 px-5 md:h-[72px] md:px-8">
        <a
          href="#hero"
          onClick={(e) => navTo(e, 'hero')}
          className="flex items-baseline gap-2"
          aria-label="IDEATRIX — back to the overview"
        >
          <span className="font-display text-[24px] font-bold leading-none tracking-tight">
            IDEATRIX
          </span>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.24em] text-mute sm:inline">
            Ideathon
          </span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {HEADER_NAV.map((id) => {
            const item = SECTIONS.find((s) => s.id === id);
            if (!item) return null;
            const accent = destinationById(id).accent;
            const isActive = active === id;
            return (
              <a
                key={id}
                href={`#${id}`}
                onClick={(e) => navTo(e, id)}
                aria-current={isActive ? 'true' : undefined}
                className={cn(
                  'relative py-2 text-[15px] font-medium transition-colors',
                  isActive ? 'text-mist' : 'text-fog hover:text-mist',
                )}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute inset-x-0 -bottom-0.5 h-[2px] origin-left transition-transform duration-300',
                    isActive ? 'scale-x-100' : 'scale-x-0',
                  )}
                  style={{ backgroundColor: accent }}
                />
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#register"
            onClick={(e) => navTo(e, 'register')}
            className="hidden min-h-[44px] items-center rounded-lg px-5 text-[15px] font-semibold text-inkbtn transition-transform hover:scale-[1.03] sm:inline-flex"
            style={{ backgroundColor: '#34D399' }}
          >
            Register
          </a>
          <button
            type="button"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-white/15 bg-raised px-3 text-mist lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close section menu' : 'Open section menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="Sections"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-white/10 bg-void/95 px-5 pb-8 pt-2 backdrop-blur-md lg:hidden"
          >
            <ul className="divide-y divide-white/10">
              {SECTIONS.filter((s) => s.id !== 'hero').map((s) => {
                const accent = destinationById(s.id).accent;
                const isActive = active === s.id;
                return (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      onClick={(e) => navTo(e, s.id)}
                      aria-current={isActive ? 'true' : undefined}
                      className="flex min-h-[52px] items-center gap-3 py-2 text-[17px] font-medium"
                      style={{ color: isActive ? accent : undefined }}
                    >
                      <span
                        aria-hidden="true"
                        className="h-2 w-2 flex-none rounded-full"
                        style={{ backgroundColor: accent, opacity: isActive ? 1 : 0.45 }}
                      />
                      <span className={isActive ? '' : 'text-mist'}>{s.label}</span>
                      <span className="ml-auto font-mono text-[12px] text-mute">{s.index}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
            <a
              href="#register"
              onClick={(e) => navTo(e, 'register')}
              className="mt-4 flex min-h-[52px] items-center justify-center rounded-lg px-5 font-semibold text-inkbtn"
              style={{ backgroundColor: '#34D399' }}
            >
              Register your team — ₹100
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
