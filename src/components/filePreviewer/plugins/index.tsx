import { useContext } from 'react'
import PDFRenderer from './pdf/pdfRenderer'
import { RendererEntity, RendererProps } from '../index.interface'
import { DocumentContext } from '../index'

const defaultPlugins: RendererEntity[] = [
  {
    fileType: /\s*(.pdf)$/,
    renderer: PDFRenderer
  }
]

function ProxyRenderer(props: RendererProps) {
  const { filename, url } = props

  const { currentPlugin: CurrentPlugin } = useContext(DocumentContext)

  if (CurrentPlugin?.renderer) {
    return <CurrentPlugin.renderer filename={filename} url={url}></CurrentPlugin.renderer>
  } else {
    return <span className="text-sm text-primary-l">暂不支持预览当前格式的文件</span>
  }
}

export { defaultPlugins, ProxyRenderer }
