import { useContext, useState } from 'react'
import { useSelector } from 'react-redux'
import { Image, Button, Dropdown, Menu } from '@arco-design/web-react'
import { IconClose, IconCopy, IconUndo, IconPlayCircle } from '@arco-design/web-react/icon'
import { RootState } from '@/store'
import { MessageTypeEnum } from '@/constants'
import { cs } from '@/utils/property'
import { isFunction, isUndefined } from '@/utils/is'
import UserAvatar from '@/components/userAvatar'
import { FilePreviewer } from '@/components/filePreviewer'
import type { NormalMessageProps, DropdownListProps, BaseProps } from './index.interface'
import styles from './index.module.less'
import { RoomContext } from '../RoomWrapper'

const isSelf = (msg: Message.Entity, userInfo: User.UserEntity | null) => {
  if (!userInfo) return false
  return msg.profile?.userId === userInfo.userId
}

function DropdownList(props: DropdownListProps) {
  const { msg, userInfo, handleRecall } = props

  const iconCls = 'text-xs'

  const dropdownList: DropdownItem.Entity[] = [
    {
      label: '复制',
      key: 'copy',
      icon: <IconCopy className={iconCls} />,
      handler() {
        console.log('copy', msg)
      }
    },
    {
      label: '撤回',
      key: 'recall',
      visible: isSelf(msg, userInfo),
      icon: <IconUndo className={iconCls} />,
      async handler() {
        handleRecall && handleRecall(msg)
      }
    }
  ]

  return (
    <Menu>
      {
        dropdownList
          .filter(item => {
            if (isUndefined(item.visible)) return true
            return isFunction(item.visible) ? item.visible() : !!item.visible
          })
          .map((item) => {
            return (
              <Menu.Item key={item.key} className="h-8 leading-8" onClick={item.handler}>
                {item.icon}
                <span className="ml-1 text-xs text-primary-l">{item.label}</span>
              </Menu.Item>
            )
          })
      }
    </Menu>
  )
}

function NormalMessage(props: NormalMessageProps) {
  const { msg, onPreview, onRecall } = props
  const { messageId, profile, createTime } = msg

  const { userInfo } = useSelector((state: RootState) => state.user)

  /**
   * @description 渲染文本标签
   * @param msg
   * @returns
   */
  const genTextMsg = (msg: Message.Entity) => {
    return <p className="text-sm break-all text-primary-l">{msg.content}</p>
  }

  /**
   * @description 渲染图片标签
   * @param msg
   * @returns
   */
  const genImageMsg = (msg: Message.Entity) => {
    return (
      <Image width={200} src={msg.url} alt="lamp" />
    )
  }

  const handleFileDownload = (msg: Message.Entity) => {
    const a = document.createElement('a')
    a.href = msg.url
    a.download = msg.content
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }
  /**
   * @description 渲染文件标签
   * @param msg
   * @returns
   */
  const genFileMessage = (msg: Message.Entity) => {
    return (
      <div className="w-80 flex flex-col items-center justify-between">
        <div className="w-full h-12">
          <h4 className="text-sm text-primary-l">{msg.content}</h4>
          <p className="text-xs text-light-l">
            <span className="mr-2">{msg.createTime}</span>
            <span>{msg.profile.username}</span>
          </p>
        </div>
        {/* <div className='w-full h-48 border border-solid border-primary-b'>{msg.url}</div> */}
        <div className="w-full h-10 gap-x-10 flex items-center justify-between">
          <Button className="flex-1" type="primary" onClick={() => onPreview(msg)}>
            预览
          </Button>
          <Button className="flex-1" type="secondary" onClick={() => handleFileDownload(msg)}>
            下载
          </Button>
        </div>
      </div>
    )
  }

  const genVideoMessage = (msg: Message.Entity) => {
    return (
      <div className={styles['video-overlay']}>
        <video src={msg.url} controls={false} width={300}>
          <p className="text-sm text-primary-l">
            你当前使用的浏览器暂不支持播放视频，点击链接
            <a href={msg.url} download={msg.content}>
              {msg.content}
            </a>
            下载到本地查看
          </p>
        </video>
        <IconPlayCircle
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl text-primary hover:text-blue-400 transition-colors cursor-pointer z-50"
          onClick={() => onPreview(msg)}
        />
      </div>
    )
  }

  const genAudioMessage = (msg: Message.Entity) => {
    return (
      <audio src={msg.url} controls>
        <p className="text-sm text-primary-l">
          你当前使用的浏览器暂不支持播放音频，点击链接
          <a href={msg.url} download={msg.content}>
            {msg.content}
          </a>
          下载到本地查看
        </p>
      </audio>
    )
  }

  const renderMsg = (msg: Message.Entity) => {
    switch (msg.type) {
      case MessageTypeEnum.TEXT:
        return genTextMsg(msg)
      case MessageTypeEnum.IMAGE:
        return genImageMsg(msg)
      case MessageTypeEnum.FILE:
        return genFileMessage(msg)
      case MessageTypeEnum.VIDEO:
        return genVideoMessage(msg)
      case MessageTypeEnum.AUDIO:
        return genAudioMessage(msg)
    }
  }

  return (
    <li
      key={messageId}
      className={cs('w-full py-4 mb-3 flex items-start', isSelf(msg, userInfo) ? 'flex-row-reverse' : '')}
    >
      <UserAvatar
        className={cs(isSelf(msg, userInfo) ? 'ml-2' : 'mr-2')}
        username={profile.username}
        avatar={profile.avatar}
        showState={false}
      />
      <div
        className={cs(
          'max-w-[70%] flex flex-col items-start justify-start',
          isSelf(msg, userInfo) ? 'items-end' : ''
        )}
      >
        <div
          className={cs(
            'mb-1 flex gap-x-3 items-center justify-start',
            isSelf(msg, userInfo) ? 'flex-row-reverse' : ''
          )}
        >
          <h4 className="text-base text-primary-l">{profile.username}</h4>
          <span className="text-xs text-light-l">{createTime}</span>
        </div>
        <Dropdown
          trigger="contextMenu"
          position="bl"
          droplist={DropdownList({
            msg,
            userInfo,
            handleRecall: onRecall
          })}
        >
          <div className="w-fit p-3 rounded-md bg-primary">{renderMsg(msg)}</div>
        </Dropdown>
      </div>
    </li>
  )
}

function MarkerMessage(props: { msg: Message.Entity }) {
  const { msg } = props
  return <li className="w-full text-xs text-primary-l text-center">{msg.content}</li>
}

function MessageList(props: BaseProps) {
  const { className } = props

  const { msgs, handleRecall } = useContext(RoomContext)

  const [isPreview, setIsPreview] = useState(false)
  const [curMessage, setCurMessage] = useState<Message.Entity>()
  const handleFilePreview = (msg: Message.Entity) => {
    setIsPreview(true)
    setCurMessage(msg)
  }

  return (
    <>
      <ul
        className={cs(
          className,
          'relative w-full p-2 flex flex-col items-center justify-start z-50'
        )}
      >
        {msgs.map((msg) => {
          if (msg.type === MessageTypeEnum.ACTION) {
            return <MarkerMessage key={msg.messageId} msg={msg} />
          } else {
            return <NormalMessage key={msg.messageId} msg={msg} onRecall={handleRecall} onPreview={handleFilePreview} />
          }
        })}
      </ul>
      {isPreview && (
        <div className="fixed top-0 bottom-0 left-0 right-0 w-[100vw] h-[100vh] flex items-center justify-center shadow-md z-[999] bg-[#94949457]">
          <div className="w-[70vw] h-[70vh] bg-white rounded-md">
            {curMessage && (
              <>
                <div className="w-full px-3 h-[6vh] min-h-[60px] flex items-center justify-between border-b border-solid border-primary-b">
                  <div className="flex items-center justify-start">
                    <UserAvatar className="mr-1" avatar={curMessage.profile.avatar}></UserAvatar>
                    <div>
                      <h4 className="text-sm text-primary-l">{curMessage.content}</h4>
                      <p className="text-xs text-light-l">
                        <span className="mr-2">{curMessage.createTime}</span>由{' '}
                        <span>{curMessage.profile.username}</span> 上传
                      </p>
                    </div>
                  </div>
                  <div className="gap-x-4 flex items-center justify-end text-primary-l cursor-pointer">
                    <IconClose
                      className="hover:text-blue-500"
                      fontSize={16}
                      onClick={() => setIsPreview(false)}
                    />
                  </div>
                </div>
                <div className="w-full h-[64vh]">
                  <FilePreviewer filename={curMessage.content} url={curMessage.url}></FilePreviewer>
                  {/* <iframe
                    src={`https://view.officeapps.live.com/op/view.aspx?src=${curMessage.url}`}
                    width="100%"
                    height="500px"
                  ></iframe> */}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default MessageList
