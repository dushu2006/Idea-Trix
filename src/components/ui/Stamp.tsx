import { cn } from '@/lib/utils';

interface StampProps {
  children: React.ReactNode;
  tone?: 'gold' | 'moss' | 'ember' | 'ink';
  className?: string;
}

/** Small uppercase status label — provisional notices, TBA flags, confirmations. */
export function Stamp({ children, tone = 'gold', className }: StampProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.14em]',
        tone === 'gold' && 'border-amber-400/40 bg-amber-400/10 text-amber-300',
        tone === 'moss' && 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300',
        tone === 'ember' && 'border-rose-400/40 bg-rose-400/10 text-rose-300',
        tone === 'ink' && 'border-white/15 bg-white/5 text-fog',
        className,
      )}
    >
      {children}
    </span>
  );
}
