import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  embedded?: boolean;
  note?: string;
  className?: string;
}

export default function PageHeader({ title, description, embedded = false, note, className }: PageHeaderProps) {
  return (
    <div className={cn(embedded ? 'mb-5' : 'mb-8', className)}>
      <h1 className={cn(embedded ? 'text-2xl' : 'text-4xl', 'font-serif font-bold text-primary mb-3')}>
        {title}
      </h1>
      {description && (
        <p className={cn(embedded ? 'text-base' : 'text-lg', 'text-neutral-600 dark:text-neutral-500 max-w-2xl leading-relaxed')}>
          {description}
        </p>
      )}
      {note && <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">{note}</p>}
    </div>
  );
}
