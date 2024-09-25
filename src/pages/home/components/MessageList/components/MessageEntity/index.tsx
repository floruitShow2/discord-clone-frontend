import { memo, useContext, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Image, Button, Dropdown, Menu, Message } from '@arco-design/web-react'
import {
  IconCopy,
  IconUndo,
  IconMessage,
  IconPlayCircle,
  IconLocation
} from '@arco-design/web-react/icon'
import { Viewer } from '@bytemd/react'
// @ts-ignore
import highlight from '@bytemd/plugin-highlight'
import 'bytemd/dist/index.css'
import 'highlight.js/styles/monokai-sublime.css'
import { RootState } from '@/store'
import { MessageTypeEnum } from '@/constants'
import { useCoze } from '@/hooks/actions/useCoze'
import { cs } from '@/utils/property'
import { isFunction, isUndefined } from '@/utils/is'
import UserAvatar from '@/components/userAvatar'
import { RoomContext } from '../../../RoomWrapper'
import type { NormalMessageProps, DropdownListProps } from './index.interface'
import styles from './index.module.less'
import './index.less'
const isSelf = (msg: Message.Entity, userInfo: User.UserEntity | null) => {
  if (!userInfo) return false
  return msg.profile?.userId === userInfo.userId
}

function DropdownList(props: DropdownListProps) {
  const { msg, disabled, inReplyChain, userInfo, onRecall, onReply, onLocate } = props

  const iconCls = 'text-xs'

  const dropdownList: DropdownItem.Entity[] = [
    {
      label: '复制',
      key: 'copy',
      icon: <IconCopy className={iconCls} />,
      handler() {
        if (msg.type === MessageTypeEnum.TEXT) {
          navigator.clipboard.writeText(msg.content).then(() => {
            Message.success('复制成功')
          })
        } else {
          console.log('copy', msg)
        }
      }
    },
    {
      label: '回复',
      key: 'reply',
      visible: () => !inReplyChain,
      icon: <IconMessage className={iconCls} />,
      handler() {
        console.log('reply', msg)
        onReply && onReply(msg)
      }
    },
    {
      label: '定位到消息',
      key: 'locate',
      visible: () => inReplyChain,
      icon: <IconLocation className={iconCls} />,
      handler() {
        onLocate && onLocate(msg)
      }
    },
    {
      label: '撤回',
      key: 'recall',
      visible: () => {
        return isSelf(msg, userInfo) && !inReplyChain
      },
      icon: <IconUndo className={iconCls} />,
      async handler() {
        onRecall && onRecall(msg)
      }
    }
  ]

  return (
    <Menu>
      {dropdownList
        .filter((item) => {
          if (disabled) return false
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
        })}
    </Menu>
  )
}

// 消息撤回、拍一拍等标记类型的消息
export function MarkerMessage(props: { msg: Message.Entity }) {
  const { msg } = props
  return <li className="w-full text-xs text-light-l text-center leading-10">{msg.content}</li>
}

export function RenderMsg(props: NormalMessageProps) {
  const { msg, disabled = false, onPreview } = props
  const { answer, isReading, callCozeChat } = useCoze()

  const handlePreview = (msg: Message.Entity) => {
    if (disabled || !onPreview) return
    onPreview(msg)
  }

  /**
   * @description 渲染文本标签
   * @param msg
   * @returns
   */
  const genTextMsg = (msg: Message.Entity) => {
    const { content, mentions, emojis } = msg

    const formatMessage = (text: string) => {
      type MentionEntity = Message.Mention & { type: 'mention' }
      type EmojiEntity = Message.Emoji & { type: 'emoji' }

      const entities = [
        ...(mentions || []).map((mention) => ({ ...mention, type: 'mention' })),
        ...(emojis || []).map((emoji) => ({ ...emoji, type: 'emoji' }))
      ].sort((a, b) => a.offset - b.offset) as Array<MentionEntity | EmojiEntity>

      const result: (string | JSX.Element)[] = []
      let lastIndex = 0

      entities.forEach((entity, index) => {
        if (entity.offset > lastIndex) {
          const label = text.slice(lastIndex, entity.offset)
          result.push(
            <span key={`label-${lastIndex}-${label}`} className="text-sm break-all text-primary-l">
              {label}
            </span>
          )
        }

        if (entity.type === 'mention') {
          result.push(
            <div
              key={`mention-${index}-${entity.userId}`}
              className={cs('text-blue-500')}
              onClick={() => {
                console.log('mention', entity)
              }}
            >
              @{entity.username}
            </div>
          )
          lastIndex = entity.offset + entity.username.length + 1
        } else if (entity.type === 'emoji') {
          result.push(
            <img
              key={`emoji-${index}-${entity.url}`}
              src={entity.url}
              alt="emoji"
              className="inline-block w-5 h-5 mx-[2px] align-text-bottom"
            />
          )
          lastIndex = entity.offset + `<emoji src="${entity.url}">`.length
        }
      })

      if (lastIndex < text.length) {
        const label = text.slice(lastIndex)
        result.push(
          <span key={`label-${lastIndex}-${label}`} className="text-sm break-all text-primary-l">
            {label}
          </span>
        )
      }

      return result
    }
    return <div className="flex items-center justify-start flex-wrap">{formatMessage(content)}</div>
  }

  /**
   * @description 渲染图片标签
   * @param msg
   * @returns
   */
  const genImageMsg = (msg: Message.Entity) => {
    return <Image width={200} src={msg.url} preview={!disabled} alt="lamp" />
  }

  const handleFileDownload = async (msg: Message.Entity) => {
    if (disabled) return
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
        {onPreview && (
          <div className="w-full h-10 gap-x-10 flex items-center justify-between">
            <Button className="flex-1" type="primary" onClick={() => handlePreview(msg)}>
              预览
            </Button>
            <Button className="flex-1" type="secondary" onClick={() => handleFileDownload(msg)}>
              下载
            </Button>
          </div>
        )}
      </div>
    )
  }

  const genVideoMessage = (msg: Message.Entity) => {
    return (
      <div
        className={cs(
          'relative',
          "after:content-['']",
          'after:absolute after:top-0 after:left-0',
          'block w-fit max-w-full h-full rounded-md overflow-hidden bg-[rgba(169, 169, 169, 0.2)]'
        )}
      >
        <video src={msg.url} controls={false} width={300}>
          <p className="text-sm text-primary-l">
            你当前使用的浏览器暂不支持播放视频，点击链接
            <a href={msg.url} download={msg.content}>
              {msg.content}
            </a>
            下载到本地查看
          </p>
        </video>
        {onPreview && (
          <IconPlayCircle
            className={cs(
              'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
              'text-4xl text-primary transition-colors',
              'cursor-pointer z-50',
              {
                ['hover:text-blue-400']: !disabled
              }
            )}
            onClick={() => handlePreview(msg)}
          />
        )}
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

  const ChatMessage = memo((props: { msg: Message.Entity }) => {
    const { content, messageId, profile } = props.msg
    const plugins = [highlight()]

    const { room, updateMessage } = useContext(RoomContext)

    if (!room) return <></>

    useEffect(() => {
      if (!isReading) callCozeChat(profile.userId, content)
    }, [content])

    useEffect(() => {
      if (!isReading && answer?.length) {
        try {
          if (!updateMessage) return
          updateMessage({ messageId, type: MessageTypeEnum.MARKDOWN, content: answer })
        } catch (err) {
          console.log(err)
        }
      }
    }, [isReading])

    return <Viewer value={answer || '... ...'} plugins={plugins} />
  })

  const genMarkdownMessage = (msg: Message.Entity) => {
    const { content } = msg
    const plugins = [highlight()]

    return <Viewer value={content} plugins={plugins} />
  }

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
    case MessageTypeEnum.CHAT:
      return <ChatMessage msg={msg} />
    case MessageTypeEnum.MARKDOWN:
      return genMarkdownMessage(msg)
    default:
      return <></>
  }
}

export function NormalMessage(props: NormalMessageProps) {
  const {
    msg,
    locatedId,
    disabled = false,
    inReplyChain = false,
    onPreview,
    onClickReplyMsg
  } = props

  const { replyMessage, recallMessage, locateMessage, clearLocatedId } = useContext(RoomContext)
  const { messageId, profile, createTime } = msg

  const { userInfo } = useSelector((state: RootState) => state.user)

  const handleClickReplyMessage = (msg: Message.Entity) => {
    if (disabled) return
    onClickReplyMsg && onClickReplyMsg(msg)
  }

  useEffect(() => {
    setTimeout(() => {
      clearLocatedId && clearLocatedId()
    }, 5000)
  })

  return (
    <li
      key={messageId}
      className={cs('w-full py-4 mb-3 flex items-start', 'transition-colors', {
        'flex-row-reverse': isSelf(msg, userInfo),
        [styles['fade-out']]: locatedId === messageId
      })}
      data-id={messageId}
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
          <h4 className="text-sm text-primary-l">{profile.username}</h4>
          <span className="text-xs text-light-l">{createTime}</span>
        </div>
        <Dropdown
          trigger="contextMenu"
          position="bl"
          disabled={disabled}
          droplist={DropdownList({
            msg,
            inReplyChain,
            disabled,
            userInfo,
            onReply: replyMessage,
            onRecall: recallMessage,
            onLocate: locateMessage
          })}
        >
          {/* 回复的目标消息 */}
          <div className="w-fit p-3 rounded-md bg-primary cursor-pointer">
            {msg.replyMessage && (
              <div
                className={cs(
                  'relative w-full pl-3 mb-2',
                  "before:content-[''] before:absolute before:top-1/2 before:left-0 before:-translate-y-1/2",
                  'before:w-1 before:h-full',
                  'before:bg-module'
                )}
                onClick={() => handleClickReplyMessage(msg)}
              >
                <span className="text-xs text-light-l">{msg.replyMessage.profile.username}: </span>
                <RenderMsg msg={msg.replyMessage} disabled onPreview={onPreview} />
              </div>
            )}
            {/* 消息本身 */}
            <RenderMsg msg={msg} disabled={disabled} onPreview={onPreview} />
          </div>
        </Dropdown>
      </div>
    </li>
  )
}
