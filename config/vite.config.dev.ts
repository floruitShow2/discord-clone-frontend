import { mergeConfig } from 'vite'
import BaseConfig from './vite.config.base'

export default mergeConfig(
  {
    mode: 'development',
    server: {
      open: true,
      cors: true,
      port: 5173,
      fs: {
        strict: true
      }
    }
  },
  BaseConfig
)
