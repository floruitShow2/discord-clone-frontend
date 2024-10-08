import { mergeConfig } from 'vite'
import BaseConfig from './vite.config.base'
import configCompressPlugin from './plugin/compress'
import configImageminPlugin from './plugin/imagemin'
import configHtmlPlugin from './plugin/html'

export default mergeConfig(
  {
    mode: 'production',
    plugins: [configCompressPlugin('gzip'), configImageminPlugin(), configHtmlPlugin()],
    build: {
      outDir: 'meleon-chat-panel',
      // 默认情况下，若 outDir 在 root 目录下，则 Vite 会在构建时清空该目录。
      emptyOutDir: true,
      // 启用/禁用 reportCompressedSize 压缩大小报告
      reportCompressedSize: true,
      // chunks 大小限制
      chunkSizeWarningLimit: 1500
    }
  },
  BaseConfig
)
