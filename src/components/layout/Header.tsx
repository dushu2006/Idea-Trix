'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { HEADER_NAV, SECTIONS } from '@/data/event';
import { useActiveSection } from '@/hooks/useActiveSection';
import { cn } from '@/lib/utils';

const ALL_IDS = SECTIONS.map((s) => s.id);

export function Header() {
  const [progress, setProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection(ALL_IDS);
  const reduce = useReducedMotion();

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
      setScrolled(window.scrollY > 12);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
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

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300',
        scrolled || open ? 'border-line bg-paper/95 backdrop-blur-md' : 'border-transparent bg-paper/60 backdrop-blur-sm',
      )}
    >
      {/* Reading progress */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[3px] origin-left bg-ember"
        style={{ transform: `scaleX(${progress})` }}
      />
      <div className="mx-auto flex h-16 max-w-ledger items-center justify-between gap-4 px-5 md:h-[72px] md:px-8">
        <Link href="#hero" className="group flex items-baseline gap-2" aria-label="IDEATRIX — back to top">
          <span className="font-display text-[26px] font-bold leading-none tracking-tight">
            IDEATRIX
          </span>
          <span className="hidden text-[11px] font-bold uppercase tracking-[0.2em] text-muted sm:inline">
            Vol. 01
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {HEADER_NAV.map((id) => {
            const item = SECTIONS.find((s) => s.id === id);
            if (!item) return null;
            const isActive = active === id;
            return (
              <Link
                key={id}
                href={`#${id}`}
                aria-current={isActive ? 'true' : undefined}
                className={cn(
                  'relative py-2 text-[15px] font-medium transition-colors',
                  isActive ? 'text-ink' : 'text-muted hover:text-ink',
                )}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute inset-x-0 -bottom-0.5 h-[2px] origin-left bg-ember transition-transform duration-300',
                    isActive ? 'scale-x-100' : 'scale-x-0',
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="#register"
            className="hidden min-h-[44px] items-center rounded-lg bg-ink px-5 text-[15px] font-semibold text-paper transition-colors hover:bg-ember-deep sm:inline-flex"
          >
            Register — ₹100
          </Link>
          <button
            type="button"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-line bg-card px-3 text-ink lg:hidden"
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
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="border-t border-line bg-paper px-5 pb-6 pt-2 lg:hidden"
          >
            <ul className="divide-y divide-line/70">
              {SECTIONS.filter((s) => s.id !== 'hero').map((s) => (
                <li key={s.id}>
                  <Link
                    href={`#${s.id}`}
                    onClick={() => setOpen(false)}
                    aria-current={active === s.id ? 'true' : undefined}
                    className={cn(
                      'flex min-h-[52px] items-center justify-between gap-4 py-2 text-[17px] font-medium',
                      active === s.id ? 'text-ember-deep' : 'text-ink',
                    )}
                  >
                    {s.label}
                    <span className="font-display text-sm text-muted">{s.index}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="#register"
              onClick={() => setOpen(false)}
              className="mt-4 flex min-h-[52px] items-center justify-center rounded-lg bg-ink px-5 font-semibold text-paper"
            >
              Register your team — ₹100
            </Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
