import * as React from 'react'
import { Mentions } from '@arco-design/web-react'
import { IconFaceSmileFill, IconFolderAdd, IconVideoCamera } from '@arco-design/web-react/icon'
import { io, Socket } from 'socket.io-client'
import { MessageType, SocketEmitEvents, SocketOnEvents } from '@/constants'

function RoomInput() {
  const iconBtnCls = 'cursor-pointer hover:text-blue-500'

  const [socket, setSocket] = React.useState<Socket>()

  React.useEffect(() => {
    // connect the first room by default
    const socket = io('http://localhost:3001', { query: { roomId: '6649fb83035a382e127368db' } })
    setSocket(socket)
    socket.on(SocketOnEvents.SOCKET_CONNECT, () => {
      socket.on(SocketOnEvents.MSG_CREATE, (msg) => {
        console.log(msg)
      })
    })
  }, [])

  const handleKeyDown = (e: any) => {
    console.log(socket)
    if (!socket) return
    socket.emit(SocketEmitEvents.CREATE_MESSAGE, {
      roomId: '6649fb83035a382e127368db',
      type: MessageType.TEXT,
      content: e.target.value,
      profileId: '65b8b9326752f26ab0eb0f32'
    })
  }

  return (
    <div className="w-full h-28 px-3 py-2 flex flex-col items-start justify-between border-t border-primary-b">
      <div className="w-full py-2 flex gap-x-2 items-center justify-start text-xl text-light-l">
        <IconFaceSmileFill className={iconBtnCls} />
        <IconFolderAdd className={iconBtnCls} />
        <IconVideoCamera className={iconBtnCls} />
      </div>
      <Mentions
        placeholder="You can use @ Plato to mention Platon"
        options={['Jack', 'Steven', 'Platon', 'Mary']}
        alignTextarea={false}
        rows={2}
        onPressEnter={handleKeyDown}
      />
    </div>
  )
}

export default RoomInput
