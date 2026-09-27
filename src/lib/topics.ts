// Research topics used to colour publications. The three hues follow the
// TUM CAMP deck system: blue = ultrasound imaging, purple = learning,
// gold = robotics. Labels reuse the words of the Research Focus panel.

export type Topic = 'ultrasound' | 'learning' | 'robotics';

export const TOPICS: Record<Topic, {
  label: string;
  text: string;   // label colour
  dot: string;    // marker fill
  border: string; // hairline in the topic hue
}> = {
  ultrasound: { label: 'Ultrasound', text: 'text-accent', dot: 'bg-accent-marker', border: 'border-accent-marker' },
  learning:   { label: 'Learning',   text: 'text-iris',   dot: 'bg-iris-marker',   border: 'border-iris-marker' },
  robotics:   { label: 'Robotics',   text: 'text-gold',   dot: 'bg-gold-marker',   border: 'border-gold-marker' },
};

export const TOPIC_ORDER: Topic[] = ['ultrasound', 'learning', 'robotics'];

// An explicit `theme = {ultrasound | learning | robotics}` in the .bib entry wins;
// otherwise the topic is guessed from the title and keywords.
export function resolveTopic(theme: string | undefined, title: string, keywords: string[]): Topic {
  const t = theme?.replace(/[{}]/g, '').trim().toLowerCase();
  if (t === 'ultrasound' || t === 'learning' || t === 'robotics') return t;
  const text = `${title} ${keywords.join(' ')}`.toLowerCase();
  if (/robot|needle|autonomous|navigation|manipulat/.test(text)) return 'robotics';
  if (/learning|language model|scene graph|gan\b|network|transformer/.test(text)) return 'learning';
  return 'ultrasound';
}
