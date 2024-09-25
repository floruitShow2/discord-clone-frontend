import { mergeConfig } from 'vite'
import BaseConfig from './vite.config.base'

export default mergeConfig(
  {
    mode: 'production',
    build: {
      outDir: 'meleon-chat-panel',
      // 默认情况下，若 outDir 在 root 目录下，则 Vite 会在构建时清空该目录。
      emptyOutDir: true,
      // 启用/禁用 reportCompressedSize 压缩大小报告
      reportCompressedSize: true,
      // chunks 大小限制
      chunkSizeWarningLimit: 1500,

      // 自定义底层的 Rollup 打包配置
      rollupOptions: {
        output: {
          // 将静态文件进行分类存放
          chunkFileNames: 'source/js/[name]-[hash].js',
          entryFileNames: 'source/js/[name]-[hash].js',
          assetFileNames: 'source/[ext]/[name]-[hash].[ext]',
          // 静态资源分拆打包
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString()
            }
          }
        }
      }
    }
  },
  BaseConfig
)
