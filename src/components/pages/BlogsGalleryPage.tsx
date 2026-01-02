'use client';

import { Fragment, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { GalleryPageConfig } from '@/types/page';
import type { BlogGalleryEntry } from '@/lib/blogGallery';
import { cn } from '@/lib/utils';

import { formatGalleryDate } from '@/lib/formatDate';

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

function withBasePath(src: string) {
  if (!BASE_PATH) return src;
  if (src.startsWith(BASE_PATH + "/")) return src; // 避免重复加
  return `${BASE_PATH}${src.startsWith("/") ? "" : "/"}${src}`;
}

interface BlogsGalleryPageProps {
  config: GalleryPageConfig;
  entries: BlogGalleryEntry[];
  embedded?: boolean;
}

export default function BlogsGalleryPage({ config, entries, embedded = false }: BlogsGalleryPageProps) {
  const flat = useMemo(() => {
    const out: Array<{ src: string; alt: string; groupLabel: string }> = [];
    for (const e of entries) {
      for (const img of e.images) {
        out.push({ src: img.src, alt: img.filename, groupLabel: e.label });
      }
    }
    return out;
  }, [entries]);

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const active = flat[activeIndex];

  function openAt(index: number) {
    setActiveIndex(index);
    setOpen(true);
  }

  function close() {
    setOpen(false);
  }

  function prev() {
    setActiveIndex((i) => (i - 1 + flat.length) % flat.length);
  }

  function next() {
    setActiveIndex((i) => (i + 1) % flat.length);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, flat.length]);

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

      {entries.length === 0 ? (
        <div className="text-neutral-600 dark:text-neutral-500">
          No images found. Put your images under <code className="px-1 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded">public/{config.directory}/YYYY-MM-DD/</code>.
        </div>
      ) : (
        <div className={cn('grid', embedded ? 'gap-4' : 'gap-6')}>
          {entries.map((entry, entryIdx) => {
            // Find starting offset for flat index mapping
            const offset = entries.slice(0, entryIdx).reduce((sum, e) => sum + e.images.length, 0);
            return (
              <div
                key={entry.key}
                className={cn(
                  'bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800',
                  embedded ? 'p-4' : 'p-6'
                )}
              >
                <div className="flex items-center justify-between mb-4">
                  {/* <h3 className={cn(embedded ? 'text-lg' : 'text-xl', 'font-semibold text-primary')}>{entry.label}</h3> */}
                  <h3 className={cn(embedded ? 'text-lg' : 'text-xl', 'font-semibold text-primary')}>{formatGalleryDate(entry.label)}</h3>
                  <span className="text-sm text-neutral-500 font-medium bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded">
                    {entry.images.length} photo{entry.images.length === 1 ? '' : 's'}
                  </span>
                </div>

                <div className={cn('grid gap-2', 'grid-cols-3 sm:grid-cols-4 md:grid-cols-6')}>
                  {entry.images.map((img, i) => {
                    const idx = offset + i;
                    return (
                      <button
                        key={img.src}
                        type="button"
                        onClick={() => openAt(idx)}
                        className="group relative overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40"
                        aria-label={`Open image ${img.filename}`}
                      >
                        <div className="relative aspect-square">
                          <Image
                            // src={img.src}
                            src={withBasePath(img.src)}
                            alt={img.filename}
                            fill
                            sizes="(max-width: 768px) 33vw, (max-width: 1024px) 16vw, 10vw"
                            className="object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Transition appear show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={close}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
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
                <DialogPanel className="w-full max-w-5xl overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 shadow-xl border border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
                    <div>
                      <DialogTitle className="text-sm font-semibold text-primary">{active?.groupLabel}</DialogTitle>
                      <div className="text-xs text-neutral-500">{active?.alt}</div>
                    </div>
                    <button
                      type="button"
                      onClick={close}
                      className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      aria-label="Close"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="relative bg-black">
                    <div className="relative w-full aspect-[16/10]">
                      {active && (
                        <Image
                          // src={active.src}
                          src={withBasePath(active.src)}
                          alt={active.alt}
                          fill
                          sizes="100vw"
                          className="object-contain"
                          priority
                        />
                      )}
                    </div>

                    {flat.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={prev}
                          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/15 hover:bg-white/25 text-white"
                          aria-label="Previous"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                          type="button"
                          onClick={next}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/15 hover:bg-white/25 text-white"
                          aria-label="Next"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                      </>
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
