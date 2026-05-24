import { Activity, Bot, ScanSearch } from 'lucide-react';

export default function ResearchStatement() {
  const items = [
    { label: 'Robotics', icon: Bot },
    { label: 'Ultrasound', icon: ScanSearch },
    { label: 'Learning', icon: Activity },
  ];

  return (
    <section className="scan-panel rounded-lg border fine-divider bg-white/70 dark:bg-neutral-900/60 px-5 py-4">
      <p className="text-xs font-semibold uppercase text-neutral-500 dark:text-neutral-400">
        Research Focus
      </p>
      <h2 className="mt-2 font-serif text-3xl font-bold leading-tight text-primary">
        Intelligent Robotic Ultrasound System
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-500">
        Building perception, planning, and learning methods for ultrasound-guided robotic systems in medical imaging and intervention.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {items.map(({ label, icon: Icon }) => (
          <span
            key={label}
            className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white/80 px-3 py-1 text-xs font-medium text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900/80 dark:text-neutral-400"
          >
            <Icon className="h-3.5 w-3.5 text-accent" />
            {label}
          </span>
        ))}
      </div>
    </section>
  );
}
