1. 增加了新的头像悬浮切换的功能, 尽量不修改原始图像导入逻辑,修改位置和切换后图像的路径都在Profile.tsx 116处\



Blogs
专门图片路径： public/blogs/<时间文件夹>/图片文件
时间文件夹建议用：YYYY-MM-DD（也可以 YYYY-MM，只要能排序就行）

例如
public/blogs/2025-12-25/IMG_0001.jpg
public/blogs/2025-12-25/IMG_0002.png
public/blogs/2026-01-02/a.webp

每个日期文件夹 = 一个条目（类似你 repo 里 Card 的样式）

条目下是该日期所有图片的缩略图网格    测试

点击任意缩略图 → 弹出“系统相册”式的放大预览

支持：

左右按钮切换

键盘 ← → 切换

ESC 关闭

Study 页面：像 Publications 一样多个条目，但每个条目来自一个 md 文件，自动取首图做缩略图
你现在需要把 study 的 md 放到这里（专门文件夹）

专门 md 路径： content/study/*.md
content/study/diffusion.md
content/study/transformer.md
content/study/medical-imaging.md

Study 列表规则

每个 *.md 文件 = 一个主题条目

自动读取：

标题：优先用 md 里的第一个 # H1，没有就用文件名

缩略图：自动取 md 里出现的第一张图片 ![...](...)

如果没有图片 → 就不显示缩略图（显示一个虚线占位）

点击条目会弹出 modal 展示全文（就像“文档阅读器”）

Study 图片建议放置位置（可选但推荐）

你可以把 study 相关图片集中放：

public/study-assets/...

然后在 md 里这样引用（推荐用绝对路径）
![cover](/study-assets/diffusion/cover.png)
