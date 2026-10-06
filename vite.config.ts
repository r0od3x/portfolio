import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// Injects the public site URL into index.html (canonical, Open Graph,
// JSON-LD) and emits robots.txt + sitemap.xml. Set VITE_SITE_URL in
// .env.production or in your host's environment variables, e.g.
// VITE_SITE_URL=https://redaghalbi.dev
function siteMeta(siteUrl: string): Plugin {
  return {
    name: 'site-meta',
    transformIndexHtml(html) {
      // A relative canonical is worse than none, so drop it until a URL is set.
      if (!siteUrl) html = html.replace(/\s*<link rel="canonical"[^>]*>/, '')
      return html.replaceAll('%SITE_URL%', siteUrl)
    },
    generateBundle() {
      const robots = siteUrl
        ? `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`
        : 'User-agent: *\nAllow: /\n'
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots })

      if (siteUrl) {
        const today = new Date().toISOString().slice(0, 10)
        this.emitFile({
          type: 'asset',
          fileName: 'sitemap.xml',
          source: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${siteUrl}/</loc><lastmod>${today}</lastmod></url>
</urlset>
`,
        })
      }
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = (env.VITE_SITE_URL ?? '').replace(/\/+$/, '')

  return {
    plugins: [react(), tailwindcss(), siteMeta(siteUrl)],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      // The 3D hero illustration (three.js) is lazy-loaded in its own chunk
      // and is expected to be large.
      chunkSizeWarningLimit: 1000,
    },
  }
})
