import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Tooltip, Upload, Message, Input } from '@arco-design/web-react'
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
import { RoomInputProps } from './index.interface'
import { RoomContext } from '../RoomWrapper'
import { cs } from '@/utils/property'

function RoomInput(props: RoomInputProps) {
  const { onMessageEmit } = props

  const { room, replyId, handleReplyCancel } = useContext(RoomContext)
  const [replyMessage, setReplyMessage] = useState<Message.Entity | null>(null)
  const fetchReplyMessage = async () => {
    if (!replyId) return
    const { data } = await FetchMessageById(replyId)
    if (!data) return
    inputRef.current && inputRef.current.focus()
    setReplyMessage(data)
  }
  const handleCloseReply = () => {
    handleReplyCancel && handleReplyCancel()
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
  const handleKeyDown = (e: any) => {
    if (!room) return
    const content = e.target.value
    if (!content) return
    onMessageEmit({
      roomId: room.roomId,
      profileId: userInfo?.userId || '',
      replyId,
      type: MessageTypeEnum.TEXT,
      content,
      url: ''
    })
    setInputValue('')
    handleReplyCancel && handleReplyCancel()
  }

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
    const res = await CreateFilesMessage(fd)
    console.log(res, uploadRef.current)
    setFileList([])
  }

  return (
    <>
      <TUICallKit style={callKitStyle}></TUICallKit>
      <div
        className={cs(
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
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={(val) => setInputValue(val)}
          onPressEnter={handleKeyDown}
        />
      </div>
    </>
  )
}

export default RoomInput
