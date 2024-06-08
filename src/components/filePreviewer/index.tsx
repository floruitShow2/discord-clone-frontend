import { createContext } from 'react'
import { ProxyRenderer, defaultPlugins } from './plugins'
import type {
  DocumentProviderProps,
  FilePreviewerProps,
  DocumentContextProps
} from './index.interface'

export const DocumentContext = createContext<DocumentContextProps>({
  plugins: [],
  currentPlugin: undefined
})

/**
 * @description 根据文件名自行匹配插件中对应的配置项
 * @param props
 * @returns
 */
export function DocumentProvider(props: DocumentProviderProps) {
  const { children, plugins, filename } = props

  const findPlugin = plugins.find((plugin) => {
    return plugin.fileType.test(filename)
  })

  return (
    <DocumentContext.Provider value={{ plugins, currentPlugin: findPlugin }}>
      {children}
    </DocumentContext.Provider>
  )
}

/**
 * @description 文件预览组件
 * @param props
 * @returns
 */
export function FilePreviewer(props: FilePreviewerProps) {
  const { url, filename, customPlugins } = props

  return (
    <DocumentProvider plugins={[...defaultPlugins, ...(customPlugins || [])]} filename={filename}>
      <div className="relative w-full h-full flex items-center justify-center bg-module">
        <ProxyRenderer url={url} filename={filename}></ProxyRenderer>
      </div>
    </DocumentProvider>
  )
}
