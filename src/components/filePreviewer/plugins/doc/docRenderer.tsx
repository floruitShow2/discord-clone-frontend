import { useEffect, useRef, useState } from 'react'
import * as docx from 'docx-preview'
import useZoom, { ZoomEventsEnum } from '@/hooks/useZoom'
import { cs } from '@/utils/property'
import type { RendererProps } from '@/components/filePreviewer/index.interface'
import FileToolBar, { PageEventsEnum } from '@/components/filePreviewer/components/toolbar'
import './index.less'

export default function DOCXRenderer(props: RendererProps) {
  const { url } = props

  const documentRef = useRef<HTMLDivElement>(null)
  // relative to pages
  const pagesRef = useRef<Element[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const genDocxPages = () => {
    if (!documentRef.current) return
    const pages = documentRef.current.querySelectorAll('.docx')
    pagesRef.current = Array.from(pages)
    setTotalPages(pages.length)
  }
  const handlePageChange = (type: PageEventsEnum) => {
    if (!documentRef.current) return
    const nextPage = type === PageEventsEnum.PREV ? currentPage - 1 : currentPage + 1
    const domRef = pagesRef.current[nextPage - 1]
    if (domRef) {
      domRef.scrollIntoView({ behavior: 'auto' })
      setCurrentPage(nextPage)
    }
  }
  const handleScroll = (e: any) => {
    if (!documentRef.current) return
    const { height } =
      pagesRef.current[currentPage - 2 <= 0 ? 0 : currentPage].getBoundingClientRect()
    const val = Math.min(Math.floor((e.target.scrollTop + 500) / height) + 1, totalPages)
    setCurrentPage(val)
  }

  const handleRenderDocx = async () => {
    if (!documentRef.current) return
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      await docx.renderAsync(blob, documentRef.current)
      genDocxPages()
    } catch (err) {
      console.log(err)
    }
  }

  const { zoomLevel, handleZoomChange } = useZoom({ wait: 16.66666666666667 })

  useEffect(() => {
    handleRenderDocx()
  }, [url])

  return (
    <>
      <div
        className={cs(
          'w-full h-full flex flex-col items-center justify-start origin-center overflow-y-auto'
        )}
        onScroll={handleScroll}
      >
        <div
          ref={documentRef}
          className={cs('w-full h-full bg-white')}
          style={{ transform: `scale(${zoomLevel})` }}
        />
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
