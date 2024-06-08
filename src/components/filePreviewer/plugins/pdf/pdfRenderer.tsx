import { useState, useRef, useEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import type { DocumentProps } from 'react-pdf'
import { useDebounceFn } from 'ahooks'
import FileToolBar, { PageEventsEnum, ZoomEventsEnum } from '../../components/toolbar'
import type { RendererProps } from '@/components/filePreviewer/index.interface'
import 'react-pdf/dist/Page/TextLayer.css'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import { cs } from '@/utils/property'

/**
 * @description 找了几个cdn链接，目前看来就这个能用
 */
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.mjs`

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
  const [zoomLevel, setZoomLevel] = useState<number>(1)
  const zoomLevelRef = useRef<number>(1)
  const handleZoomChange = useDebounceFn(
    (type: ZoomEventsEnum, delta = 0.1) => {
      if (type === ZoomEventsEnum.ZOOM_IN) {
        zoomLevelRef.current += delta
      } else {
        zoomLevelRef.current -= delta
      }
      setZoomLevel(zoomLevelRef.current)
    },
    { wait: 160 }
  )

  const isCtrl = useRef<boolean>(false)

  useEffect(() => {
    if (wrapperRef.current) {
      setRendererWidth(wrapperRef.current.clientWidth - 60 * 2)
    }
  }, [wrapperRef])

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Control' || e.ctrlKey) {
      isCtrl.current = true
    }
  }
  const handleKeyUp = (e: KeyboardEvent) => {
    e.preventDefault()
    if (e.key === 'Control' || e.ctrlKey) {
      isCtrl.current = false
    }
  }
  const handleWheel = (e: WheelEvent) => {
    if (!isCtrl.current) return
    e.preventDefault()
    if (e.deltaY < 0) {
      handleZoomChange.run(ZoomEventsEnum.ZOOM_IN, 0.05)
    } else {
      handleZoomChange.run(ZoomEventsEnum.ZOOM_OUT, 0.05)
    }
  }
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('wheel', handleWheel)
    }
  }, [])

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
        onZoomIn={() => handleZoomChange.run(ZoomEventsEnum.ZOOM_IN)}
        onZoomOut={() => handleZoomChange.run(ZoomEventsEnum.ZOOM_OUT)}
      />
    </>
  )
}
