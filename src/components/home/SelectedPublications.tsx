'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Publication } from '@/types/publication';
import { TOPICS } from '@/lib/topics';
import TopicMark from '@/components/ui/TopicMark';

interface SelectedPublicationsProps {
    publications: Publication[];
    title?: string;
    enableOnePageMode?: boolean;
}

export default function SelectedPublications({ publications, title = 'Selected Publications', enableOnePageMode = false }: SelectedPublicationsProps) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            <div className="section-rule flex items-end justify-between mb-5 pb-2">
                <h2 className="text-2xl font-serif font-bold text-primary">{title}</h2>
                <Link
                    href={enableOnePageMode ? "/#publications" : "/publications"}
                    prefetch={true}
                    className="text-accent hover:text-accent-dark text-sm font-medium transition-colors duration-200 underline-offset-4 hover:underline"
                >
                    View All →
                </Link>
            </div>
            <div className="space-y-6">
                {publications.map((pub, index) => (
                    <motion.div
                        key={pub.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 * index }}
                        className={`group relative border-l-2 ${TOPICS[pub.topic].border} bg-white/60 dark:bg-transparent py-1 pl-4 transition-colors duration-200`}
                    >
                        <TopicMark topic={pub.topic} className="mb-1.5" />
                        <h3 className="font-semibold text-primary mb-1.5 leading-snug transition-colors duration-200 group-hover:text-accent">
                            {pub.title}
                        </h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-500 mb-1">
                            {pub.authors.map((author, idx) => (
                                <span key={idx}>
                                    <span className={`${author.isHighlighted ? 'font-semibold text-gold' : ''} ${author.isCoAuthor ? `underline underline-offset-4 ${author.isHighlighted ? 'decoration-gold' : 'decoration-neutral-400'}` : ''}`}>
                                        {author.name}
                                    </span>
                                    {author.isCorresponding && (
                                        <sup className={`ml-0 ${author.isHighlighted ? 'text-gold' : 'text-neutral-600 dark:text-neutral-500'}`}>†</sup>
                                    )}
                                    {idx < pub.authors.length - 1 && ', '}
                                </span>
                            ))}
                        </p>
                        <p className="text-sm italic text-neutral-500 mb-2">
                            {pub.journal || pub.conference}
                        </p>
                        {pub.description && (
                            <p className="text-sm text-neutral-500 dark:text-neutral-500 line-clamp-2">
                                {pub.description}
                            </p>
                        )}
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
}
