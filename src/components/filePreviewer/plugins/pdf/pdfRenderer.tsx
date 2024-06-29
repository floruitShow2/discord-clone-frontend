import { useState, useRef, useEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import type { DocumentProps } from 'react-pdf'
import { cs } from '@/utils/property'
import FileToolBar, {
  PageEventsEnum,
  ZoomEventsEnum
} from '@/components/filePreviewer/components/toolbar'
import type { RendererProps } from '@/components/filePreviewer/index.interface'
import 'react-pdf/dist/Page/TextLayer.css'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import useZoom from '@/hooks/useZoom'

/**
 * @description 找了几个cdn链接，目前看来就这个能用
 */
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`

export default function PDFRenderer(props: RendererProps) {
  const { url } = props

  const wrapperRef = useRef<HTMLDivElement>(null)
  // 预览区域的dom
  const documentRef = useRef<{ pages: { current: HTMLElement[] } }>(null)

  const [rendererWidth, setRendererWidth] = useState(600)

  // relative to pages
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState(0)

  const handlePageChange = (type: PageEventsEnum) => {
    if (!documentRef.current) return
    const nextPage = type === PageEventsEnum.PREV ? currentPage - 1 : currentPage + 1
    const domRef = documentRef.current.pages.current[nextPage - 1]
    if (domRef) {
      domRef.scrollIntoView({ behavior: 'auto' })
      setCurrentPage(nextPage)
    }
  }
  const onLoadSuccess: DocumentProps['onLoadSuccess'] = (val) => {
    setTotalPages(val.numPages)
  }
  const handleScroll = (e: any) => {
    if (!documentRef.current) return
    const { pages } = documentRef.current
    const { height } = pages.current[0].getBoundingClientRect()
    setCurrentPage(Math.floor((e.target.scrollTop + height / 2) / height) + 1)
  }

  // relative to zoom
  const { zoomLevel, handleZoomChange } = useZoom()
  useEffect(() => {
    if (wrapperRef.current) {
      setRendererWidth(wrapperRef.current.clientWidth - 60 * 2)
    }
  }, [wrapperRef])

  return (
    <>
      <div
        ref={wrapperRef}
        className={cs(
          'w-full h-full py-5 flex flex-col items-center justify-start overflow-y-auto'
        )}
        onScroll={handleScroll}
      >
        {url && (
          <>
            <Document ref={documentRef} file={url} onLoadSuccess={onLoadSuccess}>
              {Array.from(new Array(totalPages), (_, index) => (
                <Page
                  key={`page_${index + 1}`}
                  width={rendererWidth * zoomLevel}
                  pageNumber={index + 1}
                />
              ))}
            </Document>
          </>
        )}
      </div>
      <FileToolBar
        currentPage={currentPage}
        totalPages={totalPages}
        currentZoom={zoomLevel}
        onPrev={() => handlePageChange(PageEventsEnum.PREV)}
        onNext={() => handlePageChange(PageEventsEnum.NEXT)}
        onZoomIn={() => handleZoomChange(ZoomEventsEnum.ZOOM_IN)}
        onZoomOut={() => handleZoomChange(ZoomEventsEnum.ZOOM_OUT)}
      />
    </>
  )
}
