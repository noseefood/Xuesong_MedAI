'use client';

import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import Image from 'next/image';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { GalleryPageConfig } from '@/types/page';
import type { BlogGalleryEntry } from '@/lib/blogGallery';
import { cn } from '@/lib/utils';
import PageHeader from '@/components/ui/PageHeader';

import { formatGalleryDate } from '@/lib/formatDate';

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

function withBasePath(src: string) {
  if (!BASE_PATH) return src;
  if (src.startsWith(BASE_PATH + '/')) return src;
  return `${BASE_PATH}${src.startsWith('/') ? '' : '/'}${src}`;
}

interface BlogsGalleryPageProps {
  config: GalleryPageConfig;
  entries: BlogGalleryEntry[];
  embedded?: boolean;
}

export default function BlogsGalleryPage({ config, entries, embedded = false }: BlogsGalleryPageProps) {
  const flat = useMemo(() => {
    const out: Array<{ src: string; alt: string; caption: string; groupLabel: string }> = [];
    for (const e of entries) {
      for (const img of e.images) {
        out.push({ src: img.src, alt: img.filename, caption: img.caption, groupLabel: e.label });
      }
    }
    return out;
  }, [entries]);

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const swipeStartX = useRef<number | null>(null);

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

  function handlePointerDown(e: PointerEvent<HTMLDivElement>) {
    swipeStartX.current = e.clientX;
  }

  function handlePointerUp(e: PointerEvent<HTMLDivElement>) {
    if (swipeStartX.current === null || flat.length <= 1) return;

    const deltaX = e.clientX - swipeStartX.current;
    swipeStartX.current = null;

    if (Math.abs(deltaX) < 50) return;
    if (deltaX > 0) {
      prev();
    } else {
      next();
    }
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
      transition={{ duration: 0.35 }}
    >
      <PageHeader
        title={config.title}
        description={config.description}
        embedded={embedded}
        note="Images are compressed previews for faster loading."
      />

      {entries.length === 0 ? (
        <div className="text-neutral-600 dark:text-neutral-500">
          No images found. Put your images under <code className="px-1 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded">public/{config.directory}/YYYY-MM-DD/</code>.
        </div>
      ) : (
        <div className={cn('grid', embedded ? 'gap-4' : 'gap-6')}>
          {entries.map((entry, entryIdx) => {
            const offset = entries.slice(0, entryIdx).reduce((sum, e) => sum + e.images.length, 0);
            return (
              <div
                key={entry.key}
                className={cn(
                  'border-t fine-divider',
                  embedded ? 'pt-4' : 'pt-6'
                )}
              >
                <div className="mb-4 flex items-center gap-3">
                  <h3 className={cn(embedded ? 'text-lg' : 'text-xl', 'font-serif font-semibold text-primary')}>{formatGalleryDate(entry.label)}</h3>
                  <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
                  <span className="text-xs text-neutral-500 font-medium border border-neutral-200 dark:border-neutral-800 px-2 py-1 rounded-full">
                    {entry.images.length} photo{entry.images.length === 1 ? '' : 's'}
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 auto-rows-fr">
                  {entry.images.map((img, i) => {
                    const idx = offset + i;
                    const isFeature = i === 0 && entry.images.length > 3;
                    return (
                      <button
                        key={img.src}
                        type="button"
                        onClick={() => openAt(idx)}
                        className={cn(
                          'group relative overflow-hidden rounded-md bg-neutral-50 dark:bg-neutral-800/40',
                          isFeature && 'col-span-3 row-span-2 sm:col-span-2'
                        )}
                        aria-label={`Open image ${img.filename}`}
                      >
                        <div className="relative aspect-square">
                          <Image
                            src={withBasePath(img.src)}
                            alt={img.caption}
                            fill
                            sizes={isFeature ? '(max-width: 768px) 66vw, (max-width: 1024px) 50vw, 22vw' : '(max-width: 768px) 33vw, (max-width: 1024px) 16vw, 10vw'}
                            className="object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                          />
                          <span className="absolute inset-x-0 bottom-0 translate-y-full bg-black/55 px-2 py-1.5 text-left text-xs text-white backdrop-blur-sm transition-transform duration-200 group-hover:translate-y-0">
                            {img.caption}
                          </span>
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
                      <div className="text-xs text-neutral-500">{active?.caption}</div>
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

                  <div
                    className="relative bg-black touch-pan-y select-none"
                    onPointerDown={handlePointerDown}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={() => {
                      swipeStartX.current = null;
                    }}
                  >
                    <div className="relative w-full aspect-[16/10]">
                      {active && (
                        <Image
                          src={withBasePath(active.src)}
                          alt={active.caption}
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
