import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { getConfig } from "@/lib/config";

// Site-relative asset paths ("icons/x.ico") must carry the base path, or they
// resolve against the current page (/study/icons/...) and 404 on subpages.
function withBase(src: string): string {
  if (/^(https?:)?\/\//.test(src) || src.startsWith('data:')) return src;
  const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const clean = src.replace(/^\/+/, '');
  return `${base}/${clean}`;
}

function iconType(src: string): string {
  if (src.endsWith('.svg')) return 'image/svg+xml';
  if (src.endsWith('.png')) return 'image/png';
  return 'image/x-icon';
}

export async function generateMetadata(): Promise<Metadata> {
  const config = getConfig();
  return {
    title: {
      default: config.site.title,
      template: `%s | ${config.site.title}`
    },
    description: config.site.description,
    keywords: [config.author.name, "PhD", "Research", config.author.institution],
    authors: [{ name: config.author.name }],
    creator: config.author.name,
    publisher: config.author.name,
    icons: {
      icon: withBase(config.site.favicon),
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      title: config.site.title,
      description: config.site.description,
      siteName: `${config.author.name}'s Academic Website`,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = getConfig();
  const lastUpdated = process.env.NEXT_PUBLIC_LAST_UPDATED || config.site.last_updated;

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="icon" href={withBase(config.site.favicon)} type={iconType(config.site.favicon)} />
        {/* Speed up font connections */}
        <link rel="dns-prefetch" href="https://google-fonts.jialeliu.com" />
        <link rel="preconnect" href="https://google-fonts.jialeliu.com" crossOrigin="" />
        {/* Non-blocking Google Fonts: preload + print media swap to avoid render-blocking */}
        <link
          rel="preload"
          as="style"
          href="https://google-fonts.jialeliu.com/css2?family=Inter:wght@300;400;500;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=IBM+Plex+Mono:wght@400;500&display=swap"
        />
        <link
          rel="stylesheet"
          id="gfonts-css"
          href="https://google-fonts.jialeliu.com/css2?family=Inter:wght@300;400;500;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=IBM+Plex+Mono:wght@400;500&display=swap"
          media="print"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                var l = document.getElementById('gfonts-css');
                if (!l) return;
                if (l.media !== 'all') {
                  l.addEventListener('load', function(){ try { l.media = 'all'; } catch(e){} });
                }
              })();
            `,
          }}
        />
        <noscript>
          {/* Fallback for no-JS environments */}
          <link
            rel="stylesheet"
            href="https://google-fonts.jialeliu.com/css2?family=Inter:wght@300;400;500;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=IBM+Plex+Mono:wght@400;500&display=swap"
          />
        </noscript>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme-storage');
                const parsed = theme ? JSON.parse(theme) : null;
                const setting = parsed?.state?.theme || 'system';
                const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                const effective = setting === 'dark' ? 'dark' : (setting === 'light' ? 'light' : (prefersDark ? 'dark' : 'light'));
                var root = document.documentElement;
                root.classList.add(effective);
                root.setAttribute('data-theme', effective);
              } catch (e) {
                var root = document.documentElement;
                root.classList.add('light');
                root.setAttribute('data-theme', 'light');
              }
            `,
          }}
        />
      </head>
      <body className={`font-sans antialiased`}>
        <ThemeProvider>
          <Navigation
            items={config.navigation}
            siteTitle={config.site.title}
            enableOnePageMode={config.features.enable_one_page_mode}
          />
          <main className="min-h-screen pt-16 lg:pt-20">
            {children}
          </main>
          <Footer lastUpdated={lastUpdated} />
        </ThemeProvider>
      </body>
    </html>
  );
}
