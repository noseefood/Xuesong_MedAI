'use client';

import { Fragment, useMemo, useState } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { X } from 'lucide-react';
import { StudyPageConfig } from '@/types/page';
import type { StudyEntry } from '@/lib/studyIndex';
import { cn, formatDate } from '@/lib/utils';

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
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter((e) => (e.title + ' ' + (e.excerpt ?? '')).toLowerCase().includes(q));
  }, [entries, query]);

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
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className={embedded ? 'mb-4' : 'mb-8'}>
        <h1 className={`${embedded ? 'text-2xl' : 'text-4xl'} font-serif font-bold text-primary mb-4`}>{config.title}</h1>
        {config.description && (
          <p className={`${embedded ? 'text-base' : 'text-lg'} text-neutral-600 dark:text-neutral-500 max-w-2xl`}>
            {config.description}
          </p>
        )}
      </div>

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
      </div>

      {filtered.length === 0 ? (
        <div className="text-neutral-600 dark:text-neutral-500">
          No study notes found. Put markdown files under <code className="px-1 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded">content/{config.directory}/</code>.
        </div>
      ) : (
        <div className={cn('grid', embedded ? 'gap-4' : 'gap-6')}>
          {filtered.map((e, idx) => (
            <motion.button
              key={e.slug}
              type="button"
              onClick={() => openEntry(e)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 * idx }}
              className={cn(
                'text-left w-full bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 hover:shadow-lg transition-all duration-200 hover:scale-[1.01]',
                embedded ? 'p-4' : 'p-6'
              )}
            >
              <div className="flex items-start gap-4">
                {e.thumbnail ? (
                  <div className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40">
                    <Image src={withBasePath(e.thumbnail)} alt={e.title} fill className="object-cover" sizes="96px" />
                  </div>
                ) : (
                  <div className="w-24 h-24 shrink-0 rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/20" />
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className={cn(embedded ? 'text-lg' : 'text-xl', 'font-semibold text-primary')}>
                      {e.title}
                    </h3>
                    <span className="text-xs text-neutral-500 font-medium bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded whitespace-nowrap">
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
                <DialogPanel className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 shadow-xl border border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
                    <div>
                      <DialogTitle className="text-base font-semibold text-primary">{active?.title}</DialogTitle>
                      {active?.updatedAt && <div className="text-xs text-neutral-500">Updated {formatDate(active.updatedAt)}</div>}
                    </div>
                    <button type="button" onClick={close} className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800" aria-label="Close">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="px-5 py-6 text-neutral-700 dark:text-neutral-600 leading-relaxed">
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
