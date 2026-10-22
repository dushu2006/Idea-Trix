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
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em]',
        tone === 'gold' && 'border-gold/50 bg-gold-soft text-gold',
        tone === 'moss' && 'border-moss/40 bg-moss-soft text-moss',
        tone === 'ember' && 'border-ember/40 bg-ember-soft text-ember-deep',
        tone === 'ink' && 'border-ink/30 bg-parchment text-inksoft',
        className,
      )}
    >
      {children}
    </span>
  );
}
