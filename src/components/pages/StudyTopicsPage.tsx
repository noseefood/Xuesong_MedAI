'use client';

import { Fragment, useMemo, useState } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Clock3, X } from 'lucide-react';
import { StudyPageConfig } from '@/types/page';
import type { StudyEntry } from '@/lib/studyIndex';
import { cn, formatDate } from '@/lib/utils';
import PageHeader from '@/components/ui/PageHeader';

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

function withBasePath(src: string) {
  if (!BASE_PATH) return src;
  if (src.startsWith(BASE_PATH + '/')) return src;
  return `${BASE_PATH}${src.startsWith('/') ? '' : '/'}${src}`;
}

interface StudyTopicsPageProps {
  config: StudyPageConfig;
  entries: StudyEntry[];
  embedded?: boolean;
}

export default function StudyTopicsPage({ config, entries, embedded = false }: StudyTopicsPageProps) {
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState('all');
  const topics = useMemo(() => {
    const values = entries.map((e) => e.title.split(/[:|-]/)[0].trim()).filter(Boolean);
    return Array.from(new Set(values)).slice(0, 6);
  }, [entries]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter((e) => {
      const matchesQuery = !q || (e.title + ' ' + (e.excerpt ?? '')).toLowerCase().includes(q);
      const matchesTopic = topic === 'all' || e.title.toLowerCase().startsWith(topic.toLowerCase());
      return matchesQuery && matchesTopic;
    });
  }, [entries, query, topic]);

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<StudyEntry | null>(null);

  function openEntry(e: StudyEntry) {
    setActive(e);
    setOpen(true);
  }

  function close() {
    setOpen(false);
    setActive(null);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <PageHeader title={config.title} description={config.description} embedded={embedded} />

      <div className={cn('mb-6', embedded ? 'max-w-md' : 'max-w-xl')}>
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search study notes..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-primary placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-700"
          />
        </div>
        {topics.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setTopic('all')}
              className={cn(
                'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                topic === 'all'
                  ? 'border-accent bg-accent text-white'
                  : 'border-neutral-200 text-neutral-600 hover:border-accent hover:text-accent dark:border-neutral-800 dark:text-neutral-400'
              )}
            >
              All
            </button>
            {topics.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTopic(item)}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                  topic === item
                    ? 'border-accent bg-accent text-white'
                    : 'border-neutral-200 text-neutral-600 hover:border-accent hover:text-accent dark:border-neutral-800 dark:text-neutral-400'
                )}
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={cn(!embedded && 'lg:grid lg:grid-cols-[11rem_1fr] lg:gap-8')}>
        {!embedded && (
          <aside className="mb-6 hidden lg:block">
            <div className="scan-panel sticky top-24 rounded-lg border fine-divider bg-white/70 px-4 py-4 dark:bg-neutral-900/60">
              <p className="text-xs font-semibold uppercase text-neutral-500 dark:text-neutral-400">Notebook</p>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-500">{entries.length} notes</p>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-500">{filtered.length} shown</p>
              {entries[0]?.updatedAt && (
                <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                  <Clock3 className="h-3.5 w-3.5 text-accent" />
                  Recent {formatDate(entries[0].updatedAt)}
                </p>
              )}
            </div>
          </aside>
        )}

        {filtered.length === 0 ? (
          <div className="text-neutral-600 dark:text-neutral-500">
            No study notes found. Put markdown files under <code className="px-1 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded">content/{config.directory}/</code>.
          </div>
        ) : (
          <div className="grid">
            {filtered.map((e, idx) => (
              <motion.button
                key={e.slug}
                type="button"
                onClick={() => openEntry(e)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.03 * idx }}
                className={cn(
                  'text-left w-full border-t fine-divider py-5 transition-colors duration-200 first:border-t-0 hover:border-accent/40',
                  embedded && 'py-4'
                )}
              >
                <div className="flex items-start gap-4">
                  <div className="scan-panel relative w-20 h-20 shrink-0 overflow-hidden rounded-md border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-800/40">
                    <Image src={withBasePath(e.thumbnail ?? '/study-assets/diffusion/test1.png')} alt={e.title} fill className="object-cover" sizes="80px" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className={cn(embedded ? 'text-lg' : 'text-xl', 'font-semibold text-primary leading-snug')}>
                        {e.title}
                      </h3>
                      <span className="text-xs text-neutral-500 font-medium border border-neutral-200 dark:border-neutral-800 px-2 py-1 rounded-full whitespace-nowrap">
                        {formatDate(e.updatedAt)}
                      </span>
                    </div>
                    {e.excerpt && (
                      <p className={cn('mt-2 text-neutral-600 dark:text-neutral-500 leading-relaxed', embedded ? 'text-sm' : 'text-base')}>
                        {e.excerpt}
                      </p>
                    )}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      <Transition appear show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={close}>
          <TransitionChild as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/70" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-150"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-6xl max-h-[92vh] overflow-hidden rounded-xl bg-white shadow-xl border border-neutral-200 dark:border-neutral-800 dark:bg-neutral-900">
                  <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-neutral-200 dark:border-neutral-800">
                    <div className="min-w-0">
                      <DialogTitle className="text-base font-semibold text-primary">{active?.title}</DialogTitle>
                      {active?.updatedAt && <div className="text-xs text-neutral-500">Updated {formatDate(active.updatedAt)}</div>}
                    </div>
                    <button type="button" onClick={close} className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800" aria-label="Close">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="max-h-[80vh] overflow-y-auto px-5 py-6 text-neutral-700 leading-relaxed dark:text-neutral-400 sm:px-8 lg:px-10">
                    {active && (
                      <ReactMarkdown
                        components={{
                          h1: ({ children }) => <h1 className="text-3xl font-serif font-bold text-primary mt-6 mb-4">{children}</h1>,
                          h2: ({ children }) => <h2 className="text-2xl font-serif font-bold text-primary mt-6 mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-2">{children}</h2>,
                          h3: ({ children }) => <h3 className="text-xl font-semibold text-primary mt-5 mb-3">{children}</h3>,
                          p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
                          ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-1 ml-4">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-1 ml-4">{children}</ol>,
                          li: ({ children }) => <li className="mb-1">{children}</li>,
                          a: ({ ...props }) => (
                            <a
                              {...props}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-accent font-medium hover:underline transition-colors"
                            />
                          ),
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-accent/50 pl-4 italic my-4 text-neutral-600 dark:text-neutral-500">
                              {children}
                            </blockquote>
                          ),
                          strong: ({ children }) => <strong className="font-semibold text-primary">{children}</strong>,
                          em: ({ children }) => <em className="italic text-neutral-600 dark:text-neutral-500">{children}</em>,
                          code: ({ children }) => (
                            <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-sm text-primary dark:bg-neutral-800">
                              {children}
                            </code>
                          ),
                          pre: ({ children }) => (
                            <pre className="mb-4 overflow-x-auto rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-sm dark:border-neutral-800 dark:bg-neutral-950">
                              {children}
                            </pre>
                          ),
                          img: ({ src = '', alt = '' }) => (
                            <span className="block relative w-full h-auto">
                              <img
                                src={typeof src === 'string' ? withBasePath(src) : URL.createObjectURL(src)}
                                alt={alt}
                                className="rounded-xl border border-neutral-200 dark:border-neutral-800 w-full h-auto"
                              />
                            </span>
                          ),
                        }}
                      >
                        {active.content}
                      </ReactMarkdown>
                    )}
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </motion.div>
  );
}
