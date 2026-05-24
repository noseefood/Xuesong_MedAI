import fs from 'fs';
import path from 'path';

function joinUrl(...parts: string[]) {
  const url = parts
    .filter(Boolean)
    .join("/")
    .replace(/\/+/g, "/")
    .replace(/\/$/, "");

  return url.startsWith("/") ? url : `/${url}`;
}

export interface BlogGalleryImage {
  /** Public URL path starting with '/' (Next.js basePath will be applied automatically). */
  src: string;
  filename: string;
}

export interface BlogGalleryEntry {
  /** Folder name such as '2025-12-25' or '2025-12'. */
  key: string;
  /** Display label (kept as folder name to avoid locale/date parsing surprises). */
  label: string;
  images: BlogGalleryImage[];
}

const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif']);
const DATE_FOLDER_RE = /^\d{4}(?:-\d{2}){0,2}$/;

function isImageFile(name: string) {
  return IMAGE_EXTS.has(path.extname(name).toLowerCase());
}

function sortGalleryFolders(a: string, b: string) {
  const aIsDate = DATE_FOLDER_RE.test(a);
  const bIsDate = DATE_FOLDER_RE.test(b);

  if (aIsDate && bIsDate) return a < b ? 1 : a > b ? -1 : 0;
  if (aIsDate) return -1;
  if (bIsDate) return 1;
  return a.localeCompare(b);
}

/**
 * Reads a gallery directory under /public and groups images by date-folder.
 * Example structure:
 *   public/blogs/2025-12-25/a.jpg
 *   public/blogs/2025-12-25/b.png
 */
export function getBlogGalleryEntries(publicDirName: string): BlogGalleryEntry[] {
  const publicRoot = path.join(process.cwd(), 'public');
  const dirPath = path.join(publicRoot, publicDirName);

  if (!fs.existsSync(dirPath)) return [];

  const folders = fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort(sortGalleryFolders);

  return folders
    .map((folder) => {
      const folderPath = path.join(dirPath, folder);
      const files = fs
        .readdirSync(folderPath, { withFileTypes: true })
        .filter((f) => f.isFile() && isImageFile(f.name))
        .map((f) => f.name)
        .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));

      const images: BlogGalleryImage[] = files.map((filename) => ({
        filename,
        src: joinUrl(
          publicDirName,
          encodeURIComponent(folder),
          encodeURIComponent(filename),
        ),
      }));

      return {
        key: folder,
        label: folder,
        images,
      } as BlogGalleryEntry;
    })
    .filter((e) => e.images.length > 0);
}
