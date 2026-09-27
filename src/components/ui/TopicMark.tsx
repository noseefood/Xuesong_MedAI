import { cn } from '@/lib/utils';
import { TOPICS, type Topic } from '@/lib/topics';

// Deck-style marker: a small filled square in the topic hue, then a mono label.
export default function TopicMark({ topic, className }: { topic: Topic; className?: string }) {
  const t = TOPICS[topic];
  return (
    <span className={cn('eyebrow inline-flex items-center gap-2', t.text, className)}>
      <span className={cn('h-2 w-2 shrink-0', t.dot)} aria-hidden="true" />
      {t.label}
    </span>
  );
}
