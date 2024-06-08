import { useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Mentions, Tooltip, Upload, Message } from '@arco-design/web-react'
import { IconFaceSmileFill, IconFolderAdd, IconVideoCamera } from '@arco-design/web-react/icon'
import type { UploadInstance, UploadItem } from '@arco-design/web-react/es/Upload'
import { TUICallKit, TUICallKitServer, TUIGlobal } from '@tencentcloud/call-uikit-react'
// @ts-ignore
import * as GenerateTestUserSig from '@/debug/GenerateTestUserSig-es'
import { RootState } from '@/store'
import { MessageTypeEnum } from '@/constants'
import { CreateFilesMessage } from '@/api/chat-message'
import { RoomInputProps } from './index.interface'

function RoomInput(props: RoomInputProps) {
  const { info, onMessageEmit } = props

  const { userInfo } = useSelector((state: RootState) => state.user)

  const iconBtnCls = 'cursor-pointer hover:text-blue-500'

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

  const [inputValue, setInputValue] = useState('')
  const handleKeyDown = (e: any) => {
    onMessageEmit({
      roomId: '6649fb83035a382e127368db',
      type: MessageTypeEnum.TEXT,
      profileId: userInfo?.userId || '',
      content: e.target.value,
      url: ''
    })
    setInputValue('')
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
  const handleChangeFiles = async (files: UploadItem[]) => {
    const fd = new FormData()
    fd.append('roomId', info.roomId)
    files.forEach((file) => {
      if (file.originFile) fd.append('files', file.originFile)
    })
    const res = await CreateFilesMessage(fd)
    console.log(res)
  }

  return (
    <>
      <TUICallKit style={callKitStyle}></TUICallKit>
      <div className="w-full h-28 px-3 py-2 flex flex-col items-start justify-between border-t border-primary-b">
        <div className="w-full py-2 flex gap-x-2 items-center justify-start text-xl text-light-l">
          <IconFaceSmileFill className={iconBtnCls} />
          <Upload
            ref={uploadRef}
            multiple
            limit={5}
            autoUpload={false}
            showUploadList={false}
            accept=".jpg,.png,.mp4,.mp3,.pdf"
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
        <Mentions
          placeholder="You can use @ Plato to mention Platon"
          options={['Jack', 'Steven', 'Platon', 'Mary']}
          value={inputValue}
          rows={2}
          alignTextarea={false}
          onChange={(val) => setInputValue(val)}
          onPressEnter={handleKeyDown}
        />
      </div>
    </>
  )
}

export default RoomInput
