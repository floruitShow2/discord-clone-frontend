import { useContext } from 'react'
import PDFRenderer from './pdf/pdfRenderer'
import DOCXRenderer from './doc/docRenderer'
import VideoRenderer from './video/videoRenderer'
import XLSXRenderer from './xlsx/xlsxRenderer'
import ScriptRenderer from './script/scriptRenderer'
import { RendererEntity, RendererProps } from '../index.interface'
import { DocumentContext } from '../index'

const defaultPlugins: RendererEntity[] = [
  {
    fileType: /.pdf$/,
    renderer: PDFRenderer
  },
  {
    fileType: /.(docx|doc)$/,
    renderer: DOCXRenderer
  },
  {
    fileType: /.mp4$/,
    renderer: VideoRenderer
  },
  {
    fileType: /.xlsx$/,
    renderer: XLSXRenderer
  },
  {
    fileType: /.(js|ts|tsx|jsx|html)$/,
    renderer: ScriptRenderer
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
