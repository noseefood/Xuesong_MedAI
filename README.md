# Xuesong Li Academic Website

[中文说明](README_cn.md)

This repository contains a configurable academic personal website built with Next.js, Tailwind CSS, TypeScript, and static export for GitHub Pages.

Most day-to-day updates do not require editing React code. Content is mainly managed through files in `content/` and images/assets in `public/`.

## Quick Start

```bash
npm install
npm run dev
```

Open the local site with the GitHub Pages base path:

```text
http://localhost:3000/Xuesong_MedAI/
```

Other local routes follow the same pattern:

```text
http://localhost:3000/Xuesong_MedAI/publications/
http://localhost:3000/Xuesong_MedAI/blogs/
http://localhost:3000/Xuesong_MedAI/study/
```

If you open `http://localhost:3000/` directly, you may see the layout but get a 404 page because this site is configured with `basePath: "/Xuesong_MedAI"` for GitHub Pages.

To build the static site:

```bash
npm run build
```

The static output is generated in `out/`. GitHub Actions deploys it to GitHub Pages.

Local npm commands and GitHub Pages deployment are independent:

- `npm run dev` only starts a local development server.
- `npm run build` only creates local build output such as `out/` and `.next/`.
- Neither command uploads files to GitHub.
- Files are uploaded only after you explicitly run `git add`, `git commit`, and `git push`.

## Project Layout

```text
content/                 Site content: TOML, Markdown, BibTeX
content/study/           Study note Markdown files
public/                  Static assets served from the site root
public/blogs/            Blog gallery images
public/publications/     Publication preview images
public/study-assets/     Images used by study notes
src/components/          React UI components
src/lib/                 Content loading and parsing logic
src/app/                 Next.js App Router pages
.github/workflows/       GitHub Pages deployment workflow
```

## Site Configuration

Edit `content/config.toml`.

Important fields:

```toml
[site]
title = "Xuesong Li"
description = "PhD student at the Technical University of Munich."
favicon = "icons/ultrasound_favicon.ico"
last_updated = "December 25, 2025"

[author]
name = "Xuesong Li"
title = "PhD Student"
institution = "Technical University of Munich"
avatar = "icons/xuesong_icon.png"

[features]
enable_likes = true
enable_one_page_mode = false
```

Navigation items are also defined in `content/config.toml`. Each page must have a matching TOML file in `content/`, for example `content/blogs.toml` for `/blogs`.

## Homepage Content

The homepage uses `content/about.toml` to decide which sections appear.

Common section types:

- `markdown`: reads a Markdown file such as `content/bio.md`
- `publications`: shows selected publications from `content/publications.bib`
- `list`: shows items from a TOML list such as `content/news.toml`

To edit the main biography, update the Markdown file referenced by `content/about.toml`, usually `content/bio.md`.

## Profile Panel

Profile information comes from `content/config.toml`.

Avatar images are stored under `public/icons/`.

Current hover behavior:

- Default avatar: `author.avatar`
- Hover avatar: `public/icons/xuesong_icon_US.png`
- Logic location: `src/components/home/Profile.tsx`

Research interests are read from `content/about.toml` and displayed as small chips.

## Publications

Main files:

- Page config: `content/publications.toml`
- Publication data: `content/publications.bib`
- Preview images: `public/publications/`

To add a publication, add a BibTeX entry to `content/publications.bib`.

Useful custom BibTeX fields:

```bibtex
selected={true},
preview={speckle2self_Overview.png},
description={Short one or two sentence summary shown in the publication list.},
keywords={Ultrasound, Registration, Robotics},
code={https://github.com/example/repo}
```

Preview image rules:

- Put preview images in `public/publications/`
- In BibTeX, use only the filename:

```bibtex
preview={my_preview.png}
```

The site automatically serves it as:

```text
/Xuesong_MedAI/publications/my_preview.png
```

Author markers:

- `*` marks corresponding author
- `#` marks co-first/co-author emphasis

Example:

```bibtex
author={Li, Xuesong# and Someone, Else*}
```

## Blogs / Photo Gallery

Main files:

- Page config: `content/blogs.toml`
- Image folders: `public/blogs/<folder-name>/`
- Thumbnail folders: `public/blogs-thumbs/<folder-name>/`
- Optional captions: `content/blogs.captions.toml`

Folder naming:

```text
public/blogs/2025-10/
public/blogs/2025-11/
public/blogs/Previous/
```

Date-like folders such as `2025-11`, `2025-10`, or `2025-10-24` are sorted newest first. Non-date folders such as `Previous` appear after date folders.

Supported image extensions:

```text
.png .jpg .jpeg .webp .gif
```

Extension matching is case-insensitive, so `.JPG` also works.

To add blog images:

1. Create or choose a folder under `public/blogs/`.
2. Put images into that folder.
3. Name images with the `Place-0001.ext` pattern.
4. Generate thumbnails under `public/blogs-thumbs/`.
5. Commit and push.

Example:

```text
public/blogs/2026-01/Florence-0001.jpg
public/blogs/2026-01/Florence-0002.png
```

Filename convention:

```text
Florence(1).jpg -> Florence-0001.jpg
Florence(12).jpg -> Florence-0012.jpg
```

The gallery automatically:

- Groups images by folder
- Shows the newest date folder first
- Uses the first image in each group as a larger featured tile
- Uses lightweight thumbnails from `public/blogs-thumbs/` when available
- Opens images in a lightbox
- Supports previous/next buttons
- Supports keyboard left/right and `Esc`
- Supports mobile swipe in the lightbox

### Blog Thumbnails

The gallery grid uses thumbnails when matching files exist under `public/blogs-thumbs/`. The lightbox still opens the larger source image from `public/blogs/`.

For a source image:

```text
public/blogs/2025-10/Florence-0001.jpg
```

the thumbnail should be:

```text
public/blogs-thumbs/2025-10/Florence-0001.webp
```

This keeps the visible gallery fast while preserving the larger image for preview.

Current recommended thumbnail settings:

- Format: `.webp`
- Width: about `960px`
- Quality: about `75`

One Windows command pattern using `cwebp`:

```powershell
cwebp.exe -q 75 -resize 960 0 "public/blogs/2025-10/example.jpg" -o "public/blogs-thumbs/2025-10/example.webp"
```

If a thumbnail is missing, the gallery falls back to the original image.

### Blog Captions

Captions are optional. If no caption is provided, the site derives a readable caption from the filename.

To add or override captions, edit `content/blogs.captions.toml`:

```toml
[captions]
"2025-10/Galaxy of hometown.jpg" = "Galaxy of hometown"
"2025-11/Geroldsee(1).jpg" = "Geroldsee"
```

Use `folder/filename` as the key. This is safest when different folders contain files with the same name.

## Study Notes

Main files:

- Page config: `content/study.toml`
- Markdown notes: `content/study/*.md`
- Optional images: `public/study-assets/`

To add a study note:

1. Create a Markdown file under `content/study/`.
2. Add a first-level heading.
3. Add content and optional images.

Example:

```text
content/study/diffusion.md
content/study/medical-imaging.md
```

Example Markdown:

```markdown
# Diffusion Models

![cover](/study-assets/diffusion/cover.png)

Notes and references go here.
```

Study page rules:

- Each `*.md` file becomes one note.
- The title is read from the first `# H1`; otherwise the filename is used.
- The thumbnail is the first Markdown image in the note.
- Clicking a note opens a reading modal.
- Desktop view includes a lightweight notebook summary panel.

Recommended image location:

```text
public/study-assets/<topic-name>/
```

Use absolute public paths in Markdown:

```markdown
![cover](/study-assets/diffusion/cover.png)
```

## Text Pages

Text pages render Markdown content.

Example config:

```toml
type = "text"
title = "CV"
description = "Academic CV"
source = "cv.md"
```

Then create:

```text
content/cv.md
```

## Card Pages

Card pages are useful for services, awards, projects, or compact lists.

Example:

```toml
type = "card"
title = "Services"
description = "Academic and professional service."

[[items]]
title = "Reviewer"
subtitle = "MICCAI"
date = "2025"
content = "Reviewed papers on medical imaging and robotics."
tags = ["Review", "Medical Imaging"]
```

## Static Assets And Paths

Files under `public/` are served from the site root.

For GitHub Pages, this repository uses:

```ts
basePath: "/Xuesong_MedAI"
assetPrefix: "/Xuesong_MedAI"
```

In content files, usually write public paths without the base path:

```markdown
![cover](/study-assets/diffusion/cover.png)
```

The app handles the GitHub Pages base path where needed.

## GitHub Pages Deployment

Deployment workflow:

```text
.github/workflows/deploy.yml
```

The workflow:

1. Installs dependencies
2. Sets `NEXT_PUBLIC_LAST_UPDATED` from the build date
3. Runs `npm run build`
4. Captures visual smoke screenshots
5. Uploads the `out/` artifact
6. Deploys to GitHub Pages

The footer displays `NEXT_PUBLIC_LAST_UPDATED` when the site is built in GitHub Actions. If that variable is not available, it falls back to `site.last_updated` in `content/config.toml`.

The screenshot step is non-blocking. It uploads an artifact named:

```text
visual-smoke-screenshots
```

Use it to quickly inspect desktop/mobile screenshots after a build.

Screenshots currently include:

- Home desktop
- Home mobile
- Publications desktop
- Blogs mobile

## Common Update Checklist

After content or asset changes:

```bash
git status
git add .
git commit -m "update website content"
git push
```

Then check the GitHub Actions run and the deployed site.

Before committing after local development or local builds, check:

```bash
git status
```

Do not commit generated dependency/build folders such as:

```text
node_modules/
.next/
out/
```

They should normally be ignored by `.gitignore`.

If the deployed page looks unchanged:

- Wait for the Pages deployment to finish
- Hard refresh with `Ctrl + F5`
- Try an incognito window
- Check the `visual-smoke-screenshots` artifact in GitHub Actions

## Notes

- Do not include `/Xuesong_MedAI` manually in most Markdown image paths.
- Blog images are discovered automatically from `public/blogs/`.
- Publication previews should be placed in `public/publications/` and referenced by filename only.
- Study images are best placed in `public/study-assets/` and referenced with absolute public paths.
