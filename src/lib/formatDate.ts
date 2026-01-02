/**
 * Convert folder name like "2026-01-02" to "Jan 2, 2026"
 */
export function formatGalleryDate(folderName: string) {
  const date = new Date(folderName);

  // 防御：如果不是合法日期，直接原样返回
  if (isNaN(date.getTime())) {
    return folderName;
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}