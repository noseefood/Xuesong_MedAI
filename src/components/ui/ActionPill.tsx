import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface ActionPillProps {
  active?: boolean;
  className?: string;
  children: ReactNode;
}

export function actionPillClass(active = false, className?: string) {
  return cn(
    'inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-medium transition-colors',
    active
      ? 'border-accent bg-accent text-on-accent'
      : 'border-neutral-200 dark:border-neutral-300 text-neutral-700 dark:text-neutral-600 hover:border-accent hover:text-accent',
    className,
  );
}

export default function ActionPill({ active = false, className, children }: ActionPillProps) {
  return <span className={actionPillClass(active, className)}>{children}</span>;
}
