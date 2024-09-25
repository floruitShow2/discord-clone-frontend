import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Tooltip, Upload, Message, Popover } from '@arco-design/web-react'
import {
  IconFaceSmileFill,
  IconFolderAdd,
  IconVideoCamera,
  IconCloseCircle
} from '@arco-design/web-react/icon'
import type { UploadInstance, UploadItem } from '@arco-design/web-react/es/Upload'
import { TUICallKit, TUICallKitServer, TUIGlobal } from '@tencentcloud/call-uikit-react'
// @ts-ignore
import * as GenerateTestUserSig from '@/debug/GenerateTestUserSig-es'
import { RootState } from '@/store'
import { MessageTypeEnum, StorageIdEnum } from '@/constants'
import { CreateFilesMessage, FetchMessageById } from '@/api/chat-message'
import { cs } from '@/utils/property'
import { useStorage } from '@/utils/storage'
import { RoomContext } from '../RoomWrapper'
import ChatInput from '../ChatInput'
import { ChatInputMethod } from '../ChatInput/index.interface'
import type { RoomInputProps } from './index.interface'
import './index.less'
import { CozeUsers } from '@/constants/coze.enum'

const iconBtnCls = 'text-light-l cursor-pointer hover:text-blue-500'

function EmojiTool(props: { onSelect: (url: string) => void }) {
  const { genKey, get, set } = useStorage()
  const tokenKey = genKey(StorageIdEnum.EMOJI)
  const [commonUsedEmoji, setCommonUsedEmoji] = useState<string[]>([])

  const [popupVisible, setPopupVisible] = useState(false)

  useEffect(() => {
    setCommonUsedEmoji(get(tokenKey) || [])
  }, [])
  const handleEmojiClick = (url: string) => {
    const newCommonUsedEmoji = [...new Set([url, ...commonUsedEmoji])].slice(0, 20)
    setCommonUsedEmoji(newCommonUsedEmoji)
    set(tokenKey, newCommonUsedEmoji)

    props.onSelect && props.onSelect(url)

    setPopupVisible(false)
  }

  const renderPopoverContent = () => {
    return (
      <div className="w-[340px]">
        {/* 当前分类下表情包列表 */}
        <div className="w-full h-[220px] p-3 bg-white overflow-auto">
          {/* 最近常用 */}
          {commonUsedEmoji.length > 0 && (
            <div className={cs('w-full mb-1', 'gap-y-1 flex flex-col items-start justify-start')}>
              <h4>最近使用</h4>
              <ul
                className={cs(
                  'w-full',
                  'gap-3 flex flex-wrap items-start justify-start content-start'
                )}
              >
                {commonUsedEmoji.map((url, index) => (
                  <li
                    key={index}
                    className={cs(
                      'w-7 h-7 p-1 rounded-sm',
                      'bg-cover bg-center',
                      'cursor-pointer hover:bg-module'
                    )}
                    onClick={() => handleEmojiClick(url)}
                  >
                    <img src={url} alt="" />
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* 默认表情 */}
          <div className="w-full gap-y-1 flex flex-col items-start justify-start">
            <h4>默认表情</h4>
            <ul
              className={cs(
                'w-full',
                'gap-3 flex flex-wrap items-start justify-start content-start'
              )}
            >
              {new Array(130).fill(0).map((_, index) => {
                const url = `${import.meta.env.VITE_SERVICE_URL}/static/emojis/${index}.png`
                return (
                  <li
                    key={index}
                    className={cs(
                      'w-7 h-7 p-1 rounded-sm',
                      'bg-cover bg-center',
                      'cursor-pointer hover:bg-module'
                    )}
                    onClick={() => handleEmojiClick(url)}
                  >
                    <img src={url} alt="" />
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
        {/* 表情包分类 */}
        <ul className="w-full h-[40px] bg-module"></ul>
      </div>
    )
  }

  return (
    <Popover
      className="emoji-icon-popover"
      popupVisible={popupVisible}
      trigger="click"
      content={renderPopoverContent()}
      onVisibleChange={setPopupVisible}
    >
      <IconFaceSmileFill className={iconBtnCls} />
    </Popover>
  )
}

function RoomInput(props: RoomInputProps) {
  const { className } = props
  const { userInfo } = useSelector((state: RootState) => state.user)

  // reply
  const { room, replyId, createMessage, cancelReply } = useContext(RoomContext)
  const [replyMessage, setReplyMessage] = useState<Message.Entity | null>(null)
  const fetchReplyMessage = async () => {
    if (!replyId) return
    const { data } = await FetchMessageById(replyId)
    if (!data) return
    chatInputRef.current && chatInputRef.current.focus()
    setReplyMessage(data)
  }
  const handleCloseReply = () => {
    cancelReply && cancelReply()
    setReplyMessage(null)
  }
  useEffect(() => {
    fetchReplyMessage()
  }, [replyId])

  // trtc audio & video
  const callData = {
    // SDKAppID: 1600038806,
    // SecretKey: '0f97219de275acfe9e25d9411f362c57dfdf0e80a2ef1e04c976c536edf4aeca'
    SDKAppID: 0,
    SecretKey: ''
  }
  const login = async (SDKAppID: number, SecretKey: string, userID: string) => {
    const { userSig } = GenerateTestUserSig.genTestUserSig({
      userID,
      SDKAppID,
      SecretKey
    })
    await TUICallKitServer.init({
      userID,
      userSig,
      SDKAppID
    })
  }
  const call = async () => {
    await TUICallKitServer.call({ userID: '664aaaaae5d0d07d6de682c0', type: 2 }) //【2】Make a 1v1 video call
  }
  const init = async () => {
    const { SDKAppID, SecretKey } = callData
    const userID = userInfo?.userId
    if (SDKAppID && SecretKey && userID) {
      try {
        await login(SDKAppID, SecretKey, userID)
      } catch (error) {
        console.error(error)
      }
    } else {
      console.log('[TUICallKit] Please fill in the SDKAppID, userID and SecretKey.')
    }
  }
  useEffect(() => {
    init()
  }, [userInfo])

  const callKitStyle = useMemo<any>(() => {
    if (TUIGlobal.isPC) {
      return {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '960px',
        height: '630px',
        margin: '0 auto',
        zIndex: 999
      }
    }
    return {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: window.innerHeight,
      zIndex: 999
    }
  }, [TUIGlobal.isPC])

  // file upload
  const uploadRef = useRef<UploadInstance>(null)
  // 用于清空上传组件缓存的文件
  const [fileList, setFileList] = useState<UploadItem[]>([])
  const handleChangeFiles = async (files: UploadItem[]) => {
    if (!room) return
    const fd = new FormData()
    fd.append('roomId', room.roomId)
    files.forEach((file) => {
      if (file.originFile) fd.append('files', file.originFile)
    })
    await CreateFilesMessage(fd)
    setFileList([])
  }

  // emoji
  const onEmojiSelect = (url: string) => {
    chatInputRef.current?.focus()
    setTimeout(() => {
      chatInputRef.current?.createEmoji(url)
    }, 200)
  }

  // chat input
  const chatInputRef = useRef<ChatInputMethod>(null)
  const [inputValue, setInputValue] = useState('')
  const [inputMentions, setInputMentions] = useState<Message.Mention[]>([])
  const [inputEmojis, setInputEmojis] = useState<Message.Emoji[]>([])

  const loadMembers = (query: string): Promise<User.UserEntity[]> => {
    return new Promise((resolve) => {
      const members = room?.members || []
      resolve(
        members.filter(
          (member) => member.username.indexOf(query) !== -1 && member.userId !== userInfo?.userId
        )
      )
    })
  }
  const onInputChange = async (
    value: string,
    mentionList: Message.Mention[],
    emojis: Message.Emoji[]
  ) => {
    try {
      setInputValue(value)
      setInputMentions(mentionList)
      setInputEmojis(emojis)
    } catch (err) {
      console.log(err)
    }
  }
  const onInputConfirm = () => {
    if (!room || !createMessage) return
    if (!inputValue) return

    createMessage({
      roomId: room.roomId,
      profileId: userInfo?.userId || '',
      replyId,
      type: MessageTypeEnum.TEXT,
      content: inputValue,
      mentions: inputMentions,
      emojis: inputEmojis,
      url: ''
    })
    const hasCozeRobot = inputMentions.some(
      (mention) => CozeUsers.indexOf(mention.userId) !== -1
    )
    if (hasCozeRobot) {
      setTimeout(() => {
        createMessage({
          roomId: room.roomId,
          profileId: inputMentions[0].userId,
          replyId,
          type: MessageTypeEnum.CHAT,
          content: inputValue.replace('@test', '').trim(),
          mentions: [],
          emojis: [],
          url: ''
        })
      }, 500)
    }

    setInputValue('')
    cancelReply && cancelReply()
  }

  return (
    <>
      <TUICallKit style={callKitStyle}></TUICallKit>
      <div
        className={cs(
          className,
          'relative w-full px-3 py-2',
          'flex flex-col items-start justify-between',
          'border-t border-primary-b'
        )}
      >
        {replyId && replyMessage && (
          <div
            className={cs(
              'absolute top-0 left-0 -translate-y-full',
              'w-full h-16 py-3 px-4',
              'border-b border-solid bg-white shadow-[0_-4px_12px_-1px_rgba(125,125,125,0.1)]',
              'z-50'
            )}
          >
            <div className={cs('relative w-full h-full', 'flex items-center justify-start')}>
              <div
                className={cs(
                  'w-full h-full pl-4',
                  'flex flex-col items-start justify-center',
                  'text-sm text-light-l',
                  "before:content-[''] before:absolute before:left-0 before:top-0",
                  'before:block before:w-1 before:h-full',
                  'before:bg-module'
                )}
              >
                <span>{replyMessage.profile.username}</span>
                <span>{replyMessage.content}</span>
              </div>
              <IconCloseCircle
                className={cs(iconBtnCls, 'absolute top-0 right-0')}
                onClick={handleCloseReply}
              />
            </div>
          </div>
        )}
        {/* 工具栏 */}
        <div className="w-full py-2 flex gap-x-2 items-center justify-start text-xl text-light-l">
          <EmojiTool onSelect={onEmojiSelect} />
          <Upload
            ref={uploadRef}
            multiple
            limit={5}
            fileList={fileList}
            autoUpload={false}
            showUploadList={false}
            accept=".jpg,.png,.mp4,.mp3,.pdf,.xlsx,.js,.jsx,.ts,.tsx,.html"
            onChange={handleChangeFiles}
            onExceedLimit={() => {
              Message.warning('超过上传数量限制！最多上传3个')
            }}
          >
            <Tooltip content="上传文件">
              <IconFolderAdd className={iconBtnCls} />
            </Tooltip>
          </Upload>
          <Tooltip content="语音通话">
            <IconVideoCamera className={iconBtnCls} onClick={call} />
          </Tooltip>
        </div>
        {/* 输入框 */}
        <ChatInput
          ref={chatInputRef}
          value={inputValue}
          mentions={inputMentions}
          emojis={inputEmojis}
          loadMembers={loadMembers}
          onInputChange={onInputChange}
          onConfirm={onInputConfirm}
        />
      </div>
    </>
  )
}

export default RoomInput
