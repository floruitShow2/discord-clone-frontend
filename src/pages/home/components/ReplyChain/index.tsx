import { useEffect, useState } from 'react'
import { FetchReplyChain } from '@/api/chat-message'
import { cs } from '@/utils/property'
import UserAvatar from '@/components/userAvatar'
import { ReplyChainProps } from './index.interface'
import MessageList from '../MessageList'
import { renderMsg } from '../MessageList/components/MessageEntity'
import { IconClose } from '@arco-design/web-react/icon'

function ReplyChain(props: ReplyChainProps) {
  const { className, messageId, onClose } = props

  const [replyChain, setReplyChain] = useState<Message.Entity[]>([])
  const initReplyChain = async () => {
    const { data } = await FetchReplyChain(messageId)
    setReplyChain(data || [])
  }

  useEffect(() => {
    initReplyChain()
  }, [messageId])

  return (
    <aside
      className={cs(
        'w-[400px] h-full overflow-auto',
        'border-l border-solid border-primary-b',
        'z-[9999]',
        'bg-module shadow-[-4px_0_12px_-1px_rgba(125,125,125,0.1)]',
        className
      )}
    >
      <div
        className={cs(
          'w-full h-[6%] px-4 bg-primary',
          'flex items-center justify-between',
          'text-primary-l'
        )}
      >
        <h4 className="text-lg">话题</h4>
        <IconClose className=" cursor-pointer hover:text-blue-500" onClick={onClose}></IconClose>
      </div>
      {replyChain.length && (
        <div className="w-full h-[94%)] p-4 overflow-auto">
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
            <MessageList msgs={replyChain.slice(1)}></MessageList>
          </div>
        </div>
      )}
    </aside>
  )
}

export default ReplyChain
