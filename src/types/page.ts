export interface BasePageConfig {
    type: 'about' | 'publication' | 'card' | 'text'| 'gallery' | 'study';
    title: string;
    description?: string;
}

export interface PublicationPageConfig extends BasePageConfig {
    type: 'publication';
    source: string;
}

export interface TextPageConfig extends BasePageConfig {
    type: 'text';
    source: string;
}

export interface CardItem {
    title: string;
    subtitle?: string;
    date?: string;
    content?: string;
    tags?: string[];
    link?: string;
    image?: string;
}

export interface CardPageConfig extends BasePageConfig {
    type: 'card';
    items: CardItem[];
}

export interface GalleryPageConfig extends BasePageConfig {
  type: 'gallery';
  /**
   * Directory under /public that stores images grouped by date folders.
   * Example: "blogs" -> /public/blogs/2025-12-25/*.jpg
   */
  directory: string;
}

export interface StudyPageConfig extends BasePageConfig {
  type: 'study';
  /**
   * directory under /content
   * e.g. "study" -> /content/study/*.md
   */
  directory: string;
}