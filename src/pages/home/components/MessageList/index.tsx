import { useSelector } from 'react-redux'
import { Image } from '@arco-design/web-react'
import { RootState } from '@/store'
import { cs } from '@/utils/property'
import UserAvatar from '@/components/userAvatar'
import type { BaseProps } from './index.interface'
import { MessageType } from '@/constants'

function NormalMessage(props: { msg: Message.Entity }) {

  const { msg } = props
  const { messageId, profile, createTime } = msg

  const { userInfo } = useSelector((state: RootState) => state.user)

  const isSelf = (msg: Message.Entity) => {
    if (!userInfo) return false
    return msg.profile?.userId === userInfo.userId
  }

  const genTextMsg = (msg: Message.Entity) => {
    return <p className="text-sm break-all text-primary-l">{msg.content}</p>
  }

  const genImageMsg = (msg: Message.Entity) => {
    return (
      <>
        <Image width={200} src={msg.url} alt="lamp" />
      </>
    )
  }

  const renderMsg = (msg: Message.Entity) => {
    switch (msg.type) {
      case MessageType.TEXT:
        return genTextMsg(msg)
      case MessageType.IMAGE:
        return genImageMsg(msg)
    }
  }
  
  return (
    <li
      key={messageId}
      className={cs(
        'w-full py-4 mb-3 flex items-start',
        isSelf(msg) ? 'flex-row-reverse' : ''
      )}
    >
      <UserAvatar
        className={cs(isSelf(msg) ? 'ml-2' : 'mr-2')}
        username={profile.username}
        avatar={profile.avatar}
        showState={false}
      />
      <div
        className={cs(
          'max-w-[70%] flex flex-col items-start justify-start',
          isSelf(msg) ? 'items-end' : ''
        )}
      >
        <div
          className={cs(
            'mb-1 flex gap-x-3 items-center justify-start',
            isSelf(msg) ? 'flex-row-reverse' : ''
          )}
        >
          <h4 className="text-base text-primary-l">{profile.username}</h4>
          <span className="text-xs text-light-l">{createTime}</span>
        </div>
        <div className="w-fit p-3 rounded-md bg-primary">{renderMsg(msg)}</div>
      </div>
    </li>
  )
}

function MarkerMessage(props: { msg: Message.Entity }) {
  const { msg } = props
  return <li className='w-full text-xs text-primary-l text-center'>{ msg.content }</li>
}

function MessageList(props: BaseProps) {
  const { className, msgs } = props

  return (
    <ul className={cs(className, 'w-full p-2 flex flex-col items-center justify-start')}>
      {msgs.map((msg) => {
        if (msg.type === MessageType.TIMESTAMP) {
          return <MarkerMessage key={msg.messageId} msg={msg} />
        } else {
          return <NormalMessage key={msg.messageId} msg={msg} />
        }
      })}
    </ul>
  )
}

export default MessageList
