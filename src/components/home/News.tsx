'use client';

import { motion } from 'framer-motion';

export interface NewsItem {
    date: string;
    content: string;
}

interface NewsProps {
    items: NewsItem[];
    title?: string;
}

export default function News({ items, title = 'News' }: NewsProps) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
        >
            <h2 className="section-rule text-2xl font-serif font-bold text-primary mb-5 pb-2">{title}</h2>
            <div className="space-y-3">
                {items.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                        <span className="font-mono text-xs text-accent mt-0.5 w-16 flex-shrink-0 tabular-nums">{item.date}</span>
                        <p className="text-sm text-neutral-700 dark:text-neutral-600">{item.content}</p>
                    </div>
                ))}
            </div>
        </motion.section>
    );
}
