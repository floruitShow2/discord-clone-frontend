import { Image } from '@arco-design/web-react'
import { cs } from '@/utils/property'
import UserAvatar from '@/components/userAvatar'
import type { BaseProps } from './index.interface'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'

function MessageList(props: BaseProps) {
  const { className, msgs } = props

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
      case 'text':
        return genTextMsg(msg)
      case 'image':
        return genImageMsg(msg)
    }
  }

  return (
    <ul className={cs(className, 'w-full p-2 flex flex-col items-center justify-start')}>
      {msgs.map((msg) => {
        const { messageId, profile, createTime } = msg
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
            <div className={
              cs('max-w-[70%] flex flex-col items-start justify-start', isSelf(msg) ? 'items-end' : '')
            }>
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
      })}
    </ul>
  )
}

export default MessageList
