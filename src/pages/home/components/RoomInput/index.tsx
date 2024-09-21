import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Tooltip, Upload, Message, Input, Mentions } from '@arco-design/web-react'
import {
  IconFaceSmileFill,
  IconFolderAdd,
  IconVideoCamera,
  IconCloseCircle
} from '@arco-design/web-react/icon'
import type { RefInputType } from '@arco-design/web-react/es/Input'
import type { UploadInstance, UploadItem } from '@arco-design/web-react/es/Upload'
import { TUICallKit, TUICallKitServer, TUIGlobal } from '@tencentcloud/call-uikit-react'
// @ts-ignore
import * as GenerateTestUserSig from '@/debug/GenerateTestUserSig-es'
import { RootState } from '@/store'
import { MessageTypeEnum } from '@/constants'
import { CreateFilesMessage, FetchMessageById } from '@/api/chat-message'
import { cs } from '@/utils/property'
import { RoomContext } from '../RoomWrapper'
import ChatInput from '../ChatInput'
import type { RoomInputProps } from './index.interface'

function RoomInput(props: RoomInputProps) {
  const { className } = props
  const { room, replyId, createMessage, cancelReply } = useContext(RoomContext)
  const [replyMessage, setReplyMessage] = useState<Message.Entity | null>(null)
  const fetchReplyMessage = async () => {
    if (!replyId) return
    const { data } = await FetchMessageById(replyId)
    if (!data) return
    inputRef.current && inputRef.current.focus()
    setReplyMessage(data)
  }
  const handleCloseReply = () => {
    cancelReply && cancelReply()
    setReplyMessage(null)
  }
  useEffect(() => {
    fetchReplyMessage()
  }, [replyId])

  const { userInfo } = useSelector((state: RootState) => state.user)

  const iconBtnCls = 'text-light-l cursor-pointer hover:text-blue-500'

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

  const inputRef = useRef<RefInputType>(null)
  const [inputValue, setInputValue] = useState('')
  const [inputMentions, setInputMentions] = useState<Message.Mention[]>([])

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

  const uploadRef = useRef<UploadInstance>(null)
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
  const onInputChange = async (value: string, mentionList: Message.Mention[]) => {
    try {
      setInputValue(value)
      setInputMentions(mentionList)
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
      url: ''
    })
    const hasCozeRobot = inputMentions.some(
      (mention) => mention.userId === '66ec4c9631b1d49faf0e429d'
    )
    if (hasCozeRobot) {
      setTimeout(() => {
        createMessage({
          roomId: room.roomId,
          profileId: '66ec4c9631b1d49faf0e429d',
          replyId,
          type: MessageTypeEnum.CHAT,
          content: inputValue.replace('@test', '').trim(),
          mentions: [],
          url: ''
        })
      }, 500);
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
          <IconFaceSmileFill className={iconBtnCls} />
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
        {/* <Input
          ref={inputRef}
          value={inputValue}
          onChange={(val) => setInputValue(val)}
          onPressEnter={handleKeyDown}
        /> */}
        <ChatInput
          value={inputValue}
          mentions={inputMentions}
          loadMembers={loadMembers}
          onInputChange={onInputChange}
          onConfirm={onInputConfirm}
        />
      </div>
    </>
  )
}

export default RoomInput
