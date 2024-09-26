import { createHtmlPlugin } from 'vite-plugin-html'

export default function configHtmlPlugin() {
  const htmlPlugin = createHtmlPlugin({
    minify: true,
    pages: [
      {
        // entry: 'src/main.ts',
        filename: 'index.html',
        template: 'index.html'
      }
    ]
  })
  return htmlPlugin
}
