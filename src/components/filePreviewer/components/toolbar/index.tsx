import { IconZoomIn, IconZoomOut, IconArrowLeft, IconArrowRight } from '@arco-design/web-react/icon'
import { cs } from '@/utils/property'
import type { FileToolBarProps } from './index.interface'

export * from './index.interface'
export default function FileToolBar(props: FileToolBarProps) {
  const {
    currentPage,
    totalPages,
    minZoom = 0.5,
    maxZoom = 1.5,
    currentZoom = 1,
    onPrev,
    onNext,
    onZoomIn,
    onZoomOut
  } = props

  const baseCls =
    'w-12 h-8 flex items-center justify-center border-r border-primary-b text-primary-l'
  const iconBtnCls = 'hover:text-blue-500 cursor-pointer hover:bg-gray-100'
  const disabledBtnCls = 'text-gray-400 cursor-not-allowed! pointer-events-none'

  return (
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center justify-center border border-primary-b rounded-full bg-white shadow-xl z-50 overflow-hidden">
      {/* 缩小 */}
      <div
        className={cs(baseCls, iconBtnCls, currentZoom > maxZoom ? disabledBtnCls : '')}
        onClick={onZoomIn}
      >
        <IconZoomIn />
      </div>
      {/* 上一页 */}
      <div
        className={cs(baseCls, iconBtnCls, currentPage === 1 ? disabledBtnCls : '')}
        onClick={onPrev}
      >
        <IconArrowLeft />
      </div>
      <div className={cs(baseCls, 'text-xs')}>
        {currentPage}
        <span className="mx-1 text-xs">/</span>
        {totalPages}
      </div>
      {/* 下一页 */}
      <div
        className={cs(baseCls, iconBtnCls, currentPage === totalPages ? disabledBtnCls : '')}
        onClick={onNext}
      >
        <IconArrowRight />
      </div>
      {/* 放大 */}
      <div
        className={cs(
          baseCls,
          iconBtnCls,
          currentZoom < minZoom ? disabledBtnCls : '',
          'border-r-0'
        )}
        onClick={onZoomOut}
      >
        <IconZoomOut />
      </div>
    </div>
  )
}
