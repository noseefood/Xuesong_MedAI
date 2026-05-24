# Xuesong Li 学术个人主页

[English README](README.md)

这个仓库是一个基于 Next.js、Tailwind CSS、TypeScript 的学术个人主页，并通过静态导出部署到 GitHub Pages。

日常维护网站内容时，通常不需要修改 React 代码。大部分内容都放在 `content/` 目录中，图片和静态资源放在 `public/` 目录中。

## 快速开始

```bash
# 在当前库路径下!
npm install
npm run dev
```

本地开发时需要带上 GitHub Pages 的 base path：

```text
http://localhost:3000/Xuesong_MedAI/
```

其他页面也是同样规则：

```text
http://localhost:3000/Xuesong_MedAI/publications/
http://localhost:3000/Xuesong_MedAI/blogs/
http://localhost:3000/Xuesong_MedAI/study/
```

如果直接打开 `http://localhost:3000/`，可能会看到顶部 layout，但主体显示 404。这是因为项目为了 GitHub Pages 配置了：

```ts
basePath: "/Xuesong_MedAI"
```

构建静态网站：

```bash
npm run build
```

构建产物会生成在 `out/` 目录中，GitHub Actions 会自动部署到 GitHub Pages。

本地 npm 命令和 GitHub Pages 部署是相互独立的：

- `npm run dev` 只会启动本地开发服务器。
- `npm run build` 只会在本地生成构建产物，例如 `out/` 和 `.next/`。
- 这两个命令都不会把文件上传到 GitHub。
- 只有你手动执行 `git add`、`git commit`、`git push` 后，文件才会上传到 GitHub。

## 项目结构

```text
content/                 站点内容：TOML、Markdown、BibTeX
content/study/           Study 页面使用的 Markdown 笔记
public/                  静态资源目录
public/blogs/            Blog 图片墙图片
public/publications/     论文预览图
public/study-assets/     Study 笔记中使用的图片
src/components/          React 组件
src/lib/                 内容读取、解析、路径处理逻辑
src/app/                 Next.js App Router 页面
.github/workflows/       GitHub Pages 自动部署 workflow
```

## 全局配置

编辑 `content/config.toml`。

常用字段：

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

导航栏也在 `content/config.toml` 中配置。每个导航页面都需要有一个对应的 TOML 文件，例如 `/blogs` 对应 `content/blogs.toml`。

## 首页内容

首页由 `content/about.toml` 决定显示哪些 section。

常见 section 类型：

- `markdown`：读取 Markdown 文件，例如 `content/bio.md`
- `publications`：从 `content/publications.bib` 中显示 selected publications
- `list`：从 TOML 列表中读取内容，例如 `content/news.toml`

如果要修改主页个人介绍，一般编辑 `content/about.toml` 中引用的 Markdown 文件，通常是 `content/bio.md`。

## 个人信息栏

个人信息来自 `content/config.toml`。

头像图片放在：

```text
public/icons/
```

当前头像逻辑：

- 默认头像：`author.avatar`
- 鼠标悬停头像：`public/icons/xuesong_icon_US.png`
- 逻辑位置：`src/components/home/Profile.tsx`

Research Interests 从 `content/about.toml` 读取，并显示为小标签。

## Publications / 论文页面

主要文件：

- 页面配置：`content/publications.toml`
- 论文数据：`content/publications.bib`
- 论文预览图：`public/publications/`

添加论文时，把 BibTeX 条目加入 `content/publications.bib`。

常用自定义字段：

```bibtex
selected={true},
preview={speckle2self_Overview.png},
description={Short one or two sentence summary shown in the publication list.},
keywords={Ultrasound, Registration, Robotics},
code={https://github.com/example/repo}
```

预览图规则：

- 预览图放到 `public/publications/`
- BibTeX 中只写文件名：

```bibtex
preview={my_preview.png}
```

网站会自动生成 GitHub Pages 下的访问路径：

```text
/Xuesong_MedAI/publications/my_preview.png
```

作者标记：

- `*`：corresponding author
- `#`：共同一作或需要强调的作者

例子：

```bibtex
author={Li, Xuesong# and Someone, Else*}
```

## Blogs / 图片墙

主要文件：

- 页面配置：`content/blogs.toml`
- 图片目录：`public/blogs/<folder-name>/`
- 缩略图目录：`public/blogs-thumbs/<folder-name>/`
- 可选 caption：`content/blogs.captions.toml`

目录命名示例：

```text
public/blogs/2025-10/
public/blogs/2025-11/
public/blogs/Previous/
```

类似 `2025-11`、`2025-10`、`2025-10-24` 的日期目录会按时间倒序排列。`Previous` 这类非日期目录会排在日期目录后面。

支持的图片后缀：

```text
.png .jpg .jpeg .webp .gif
```

后缀判断不区分大小写，所以 `.JPG` 也可以自动读取。

添加 Blog 图片：

1. 在 `public/blogs/` 下创建或选择一个目录。
2. 把图片放进去。
3. 按 `Place-0001.ext` 的格式命名图片。
4. 在 `public/blogs-thumbs/` 下生成对应缩略图。
5. 提交并 push。

例子：

```text
public/blogs/2026-01/Florence-0001.jpg
public/blogs/2026-01/Florence-0002.png
```

文件命名约定：

```text
Florence(1).jpg -> Florence-0001.jpg
Florence(12).jpg -> Florence-0012.jpg
```

图片墙会自动：

- 按文件夹分组
- 日期文件夹按最新优先排序
- 每组第一张图作为较大的 featured tile
- 如果存在 `public/blogs-thumbs/` 中的对应缩略图，优先加载缩略图
- 点击图片打开 lightbox
- 支持上一张/下一张按钮
- 支持键盘左右键和 `Esc`
- 支持移动端左右滑动切换

### Blog 缩略图

图片墙网格会优先使用 `public/blogs-thumbs/` 中的缩略图。点击图片打开 lightbox 时，仍然使用 `public/blogs/` 中的大图。

例如原图：

```text
public/blogs/2025-10/Florence-0001.jpg
```

对应缩略图应为：

```text
public/blogs-thumbs/2025-10/Florence-0001.webp
```

这样页面滚动和首屏加载会明显更轻，同时仍然保留大图预览。

当前推荐缩略图参数：

- 格式：`.webp`
- 宽度：约 `960px`
- 质量：约 `75`

Windows 下使用 `cwebp` 的单张转换示例：

```powershell
cwebp.exe -q 75 -resize 960 0 "public/blogs/2025-10/example.jpg" -o "public/blogs-thumbs/2025-10/example.webp"
```

如果某张图没有对应缩略图，网站会自动回退到原图。

### Blog Captions

Caption 是可选的。如果没有手动配置，网站会从文件名自动生成一个相对干净的标题。

如需添加或覆盖 caption，编辑 `content/blogs.captions.toml`：

```toml
[captions]
"2025-10/Galaxy of hometown.jpg" = "Galaxy of hometown"
"2025-11/Geroldsee(1).jpg" = "Geroldsee"
```

建议使用 `folder/filename` 作为 key，这样不同文件夹中有同名图片时也不会冲突。

## Study Notes / 学习笔记

主要文件：

- 页面配置：`content/study.toml`
- Markdown 笔记：`content/study/*.md`
- 可选图片：`public/study-assets/`

添加 Study 笔记：

1. 在 `content/study/` 下新建 Markdown 文件。
2. 写一个一级标题。
3. 添加正文和可选图片。

例子：

```text
content/study/diffusion.md
content/study/medical-imaging.md
```

Markdown 示例：

```markdown
# Diffusion Models

![cover](/study-assets/diffusion/cover.png)

Notes and references go here.
```

Study 页面规则：

- 每个 `*.md` 文件生成一个 note。
- 标题优先读取第一个 `# H1`；没有 H1 时使用文件名。
- 缩略图自动取 Markdown 中出现的第一张图片。
- 点击 note 会弹出阅读 modal。
- 桌面端有一个轻量的 notebook summary panel。

推荐图片存放位置：

```text
public/study-assets/<topic-name>/
```

Markdown 中建议使用 public 绝对路径：

```markdown
![cover](/study-assets/diffusion/cover.png)
```

## Text 页面

Text 页面用于渲染 Markdown 内容。

配置示例：

```toml
type = "text"
title = "CV"
description = "Academic CV"
source = "cv.md"
```

然后创建：

```text
content/cv.md
```

## Card 页面

Card 页面适合 services、awards、projects 或紧凑列表。

示例：

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

## 静态资源与路径

`public/` 下的文件会从网站根路径对外提供。

本项目部署在 GitHub Pages 子路径下，配置为：

```ts
basePath: "/Xuesong_MedAI"
assetPrefix: "/Xuesong_MedAI"
```

在 Markdown 或内容文件里，一般不要手动写 `/Xuesong_MedAI`。

例如 Study 图片应写成：

```markdown
![cover](/study-assets/diffusion/cover.png)
```

应用会在需要的位置自动处理 GitHub Pages 的 base path。

## GitHub Pages 部署

部署 workflow：

```text
.github/workflows/deploy.yml
```

流程：

1. 安装依赖
2. 根据构建当天日期设置 `NEXT_PUBLIC_LAST_UPDATED`
3. 执行 `npm run build`
4. 截取视觉 smoke screenshots
5. 上传 `out/` artifact
6. 部署到 GitHub Pages

页脚会优先显示 GitHub Actions 构建时注入的 `NEXT_PUBLIC_LAST_UPDATED`。如果这个变量不存在，则回退使用 `content/config.toml` 中的 `site.last_updated`。

截图步骤是非阻塞的。它会上传一个 artifact：

```text
visual-smoke-screenshots
```

可以用它快速检查桌面端和移动端的构建效果。

目前截图包括：

- Home desktop
- Home mobile
- Publications desktop
- Blogs mobile

## 常用更新流程

修改内容或图片后：

```bash
git status
git add .
git commit -m "update website content"
git push
```

然后检查 GitHub Actions 运行结果和部署页面。

本地开发或本地 build 之后，提交前建议先检查：

```bash
git status
```

不要提交这些本地依赖或构建目录：

```text
node_modules/
.next/
out/
```

这些目录通常已经被 `.gitignore` 忽略。

如果线上页面看起来没变化：

- 等 GitHub Pages 部署完成
- 使用 `Ctrl + F5` 强制刷新
- 用无痕窗口打开
- 在 GitHub Actions 中下载 `visual-smoke-screenshots` artifact 检查截图

## 注意事项

- 大多数 Markdown 图片路径中不要手动添加 `/Xuesong_MedAI`。
- Blog 图片会从 `public/blogs/` 自动发现。
- Publication preview 图片放在 `public/publications/`，BibTeX 中只写文件名。
- Study 图片建议放在 `public/study-assets/`，Markdown 中使用 public 绝对路径。
