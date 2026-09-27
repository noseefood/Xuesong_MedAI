import { Activity, Bot, ScanSearch } from 'lucide-react';

export default function ResearchStatement() {
  // One hue per capability, as in the deck: ultrasound = blue, learning = purple, robotics = gold.
  const items = [
    { label: 'Robotics', icon: Bot, tone: 'text-gold' },
    { label: 'Ultrasound', icon: ScanSearch, tone: 'text-accent' },
    { label: 'Learning', icon: Activity, tone: 'text-iris' },
  ];

  return (
    <section className="academic-panel scan-panel overflow-hidden rounded-lg px-5 py-4 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="eyebrow flex items-center gap-2.5 text-accent">
            <span className="band-dash" aria-hidden="true" />
            Research Focus
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold leading-tight text-primary">
            Intelligent Robotic Ultrasound System
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600">
            Building perception, planning, and learning methods for ultrasound-guided robotic systems in medical imaging and intervention.
          </p>
        </div>

        <div className="flex shrink-0 flex-row gap-2 sm:flex-col">
          {items.map(({ label, icon: Icon, tone }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white/70 px-3 py-1 text-xs font-medium text-neutral-700 dark:bg-transparent"
            >
              <Icon className={`h-3.5 w-3.5 ${tone}`} />
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
