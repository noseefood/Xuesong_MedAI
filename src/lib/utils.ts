import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

// Site assets must be addressed from the site root ("/Xuesong_MedAI/icons/x.png").
// A bare "icons/x.png" resolves against the current URL, so after a client-side
// navigation it can become "/Xuesong_MedAI/publications/icons/x.png" and 404.
export function withBasePath(src: string): string {
  if (/^(https?:)?\/\//.test(src) || src.startsWith('data:') || src.startsWith('blob:')) return src;
  if (BASE_PATH && (src === BASE_PATH || src.startsWith(BASE_PATH + '/'))) return src;
  return `${BASE_PATH}/${src.replace(/^\/+/, '')}`;
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));
}

export function formatYear(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric'
  }).format(new Date(date));
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}