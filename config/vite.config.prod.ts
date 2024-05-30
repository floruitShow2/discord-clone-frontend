import { mergeConfig } from 'vite'
import BaseConfig from './vite.config.base'

export default mergeConfig(
  {
    mode: 'production'
  },
  BaseConfig
)
