import React, { ReactElement } from 'react'

export interface RendererProps {
  filename: string
  url: string
}

export interface RendererEntity {
  /**
   * @description 匹配文件类型
   */
  fileType: RegExp
  /**
   * @description 渲染器
   */
  renderer: (props: RendererProps) => ReactElement
}

export interface DocumentContextProps {
  plugins: RendererEntity[]
  currentPlugin?: RendererEntity
}

export interface DocumentProviderProps {
  children: React.ReactNode
  /**
   * @description 根据文件名匹配插件内的渲染组件
   */
  filename: string
  plugins: RendererEntity[]
}

export interface FilePreviewerProps extends RendererProps {
  customPlugins?: RendererEntity[]
}
