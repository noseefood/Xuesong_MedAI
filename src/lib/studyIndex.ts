import fs from 'fs';
import path from 'path';
import { generateSlug } from '@/lib/utils';

export interface StudyEntry {
  slug: string;
  title: string;
  /** Optional first image in markdown */
  thumbnail?: string;
  /** Full markdown content for modal rendering */
  content: string;
  /** ISO date string derived from file mtime */
  updatedAt: string;
  excerpt?: string;
}

const MD_IMAGE_RE = /!\[[^\]]*\]\(([^)]+)\)/;

function extractTitle(md: string, fallback: string): string {
  const h1 = md.match(/^\s*#\s+(.+)\s*$/m);
  if (h1?.[1]) return h1[1].trim();

  const line = md
    .split(/\r?\n/)
    .map((l) => l.trim())
    .find((l) => l.length > 0);

  if (line) return line.replace(/^#+\s*/, '').trim();
  return fallback;
}

function extractFirstImage(md: string): string | undefined {
  const m = md.match(MD_IMAGE_RE);
  return m?.[1]?.trim();
}

function extractExcerpt(md: string): string | undefined {
  const cleaned = md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/^\s*#+\s+.*$/gm, ' ')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[[^\]]+\]\([^)]+\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleaned) return undefined;
  return cleaned.length > 180 ? `${cleaned.slice(0, 180)}...` : cleaned;
}

/**
 * Reads markdown files under /content/<directory> and returns topic entries.
 */
export function getStudyEntries(directory: string): StudyEntry[] {
  const contentRoot = path.join(process.cwd(), 'content');
  const dirPath = path.join(contentRoot, directory);
  if (!fs.existsSync(dirPath)) return [];

  const files = fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter((d) => d.isFile() && d.name.toLowerCase().endsWith('.md'))
    .map((d) => d.name);

  const entries: StudyEntry[] = files
    .map((filename) => {
      const filePath = path.join(dirPath, filename);
      const md = fs.readFileSync(filePath, 'utf-8');
      const stat = fs.statSync(filePath);
      const base = filename.replace(/\.md$/i, '');
      const title = extractTitle(md, base);
      const slug = generateSlug(base);

      return {
        slug,
        title,
        thumbnail: extractFirstImage(md),
        content: md,
        updatedAt: stat.mtime.toISOString(),
        excerpt: extractExcerpt(md),
      };
    })
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : a.updatedAt > b.updatedAt ? -1 : 0));

  return entries;
}
