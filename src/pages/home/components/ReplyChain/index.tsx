import { useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Empty, Input } from '@arco-design/web-react'
import { IconClose, IconLocation } from '@arco-design/web-react/icon'
import { RootState } from '@/store'
import { FetchReplyChain } from '@/api/chat-message'
import { MessageTypeEnum } from '@/constants'
import { cs } from '@/utils/property'
import UserAvatar from '@/components/userAvatar'
import { RoomContext } from '../RoomWrapper'
import MessageList from '../MessageList'
import { renderMsg } from '../MessageList/components/MessageEntity'
import type { ReplyChainProps } from './index.interface'
import styles from './index.module.less'

function ReplyChain(props: ReplyChainProps) {
  const { className, messageId, onClose, onLocate } = props

  const { userInfo } = useSelector((state: RootState) => state.user)

  const { room, handleCreate } = useContext(RoomContext)

  const [replyChain, setReplyChain] = useState<Message.Entity[]>([])
  const initReplyChain = async (id: string) => {
    const { data } = await FetchReplyChain(id)
    setReplyChain(data || [])
  }

  const [value, setValue] = useState('')
  const handleKeyDown = async (e: any) => {
    if (!room || !handleCreate) return
    const content = e.target.value
    if (!content) return
    const newMessage = await handleCreate({
      roomId: room.roomId,
      profileId: userInfo?.userId || '',
      replyId: messageId,
      type: MessageTypeEnum.TEXT,
      content,
      url: ''
    })
    setValue('')
    if (newMessage) initReplyChain(newMessage.messageId)
  }

  useEffect(() => {
    initReplyChain(messageId)
  }, [messageId])

  return (
    <aside
      className={cs(
        'w-[400px] h-full overflow-auto',
        'border-l border-solid border-primary-b',
        'z-[9999]',
        'bg-module',
        className
      )}
    >
      <div
        className={cs(
          'w-full h-16 px-4 bg-primary',
          'flex items-center justify-between',
          'text-primary-l'
        )}
      >
        <h4 className="text-lg">话题</h4>
        <div className='flex items-center justify-end gap-3'>
          <IconLocation
            className='cursor-pointer hover:text-blue-500'
            onClick={() => onLocate && onLocate(replyChain[0])}
          ></IconLocation>
          <span className='w-[1px] h-3 bg-light-l'></span>
          <IconClose className="cursor-pointer hover:text-blue-500" onClick={onClose}></IconClose>
        </div>
      </div>
      <div className={cs('w-full p-4 overflow-auto', styles['reply-chain-content'])}>
        {replyChain.length ? (
          <>
            <div className="w-full p-2 rounded-md bg-white">
              <UserAvatar
                className="mb-2"
                username={replyChain[0].profile.username}
                avatar={replyChain[0].profile.avatar}
                description={replyChain[0].createTime}
                showDetails
                showState={false}
              />
              {renderMsg({ msg: replyChain[0] })}
            </div>
            <div className="w-full">
              <MessageList
                msgs={replyChain.slice(1)}
                inReplyChain
                onLocate={onLocate}
              ></MessageList>
            </div>
          </>
        ) : (
          <>
            <Empty description="数据查询失败，尝试重新获取" />
          </>
        )}
      </div>
      <div
        className={cs(
          'w-full h-16 px-4 bg-primary',
          'flex items-center justify-between',
          'text-primary-l'
        )}
      >
        <Input
          value={value}
          placeholder="请输入回复内容"
          onChange={setValue}
          onPressEnter={handleKeyDown}
        ></Input>
      </div>
    </aside>
  )
}

export default ReplyChain
