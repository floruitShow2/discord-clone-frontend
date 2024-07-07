import { useRef } from 'react'
import { CSSTransition } from 'react-transition-group'
import { RoomDrawerContentEnum, RoomDrawerContentProps, RoomDrawerProps } from './index.interface'
import { cs } from '@/utils/property'
import ReplyChain from '../ReplyChain'
import './index.less'

function RoomDrawer(props: RoomDrawerProps) {
  const { visible, children, onClose } = props

  const drawerRef = useRef<HTMLDivElement>(null)

  return (
    <CSSTransition
      nodeRef={drawerRef}
      in={visible}
      timeout={500}
      unmountOnExit
      classNames="room-drawer"
    >
      <div
        ref={drawerRef}
        className={cs(
          'absolute top-0 left-0 w-full h-full',
          'flex items-end justify-end',
          'z-[999]'
        )}
        onClick={onClose}
      >
        <div
          className={cs('h-full', 'bg-primary shadow-[-4px_2px_12px_-1px_rgba(125,125,125,0.1)]')}
          onClick={(e) => e.stopPropagation()}
        >
          {visible && children}
        </div>
      </div>
    </CSSTransition>
  )
}

export { RoomDrawerContentEnum } from './index.interface'

export function renderRoomDrawer(props: RoomDrawerContentProps) {
  const { type, messageId, onClose, onLocate } = props
  switch (type) {
    case RoomDrawerContentEnum.REPLY_CHAIN:
      return <ReplyChain messageId={messageId || ''} onClose={onClose} onLocate={onLocate} />
    default:
      return <></>
  }
}

export default RoomDrawer
