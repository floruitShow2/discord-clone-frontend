import { useRef, useState } from 'react'
import { Mentions, Tooltip, Upload, Message } from '@arco-design/web-react'
import { UploadInstance, UploadItem } from '@arco-design/web-react/es/Upload'
import { IconFaceSmileFill, IconFolderAdd, IconVideoCamera } from '@arco-design/web-react/icon'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { MessageTypeEnum } from '@/constants'
import { CreateFilesMessage } from '@/api/chat-message'
import { RoomInputProps } from './index.interface'

function RoomInput(props: RoomInputProps) {
  const { info, onMessageEmit } = props

  const iconBtnCls = 'cursor-pointer hover:text-blue-500'

  const { userInfo } = useSelector((state: RootState) => state.user)

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
    <div className="w-full h-28 px-3 py-2 flex flex-col items-start justify-between border-t border-primary-b">
      <div className="w-full py-2 flex gap-x-2 items-center justify-start text-xl text-light-l">
        <IconFaceSmileFill className={iconBtnCls} />
        <Upload
          ref={uploadRef}
          multiple
          limit={5}
          autoUpload={false}
          showUploadList={false}
          accept='.jpg,.png,.mp4,.mp3,.pdf'
          onChange={handleChangeFiles}
          onExceedLimit={() => {
            Message.warning('超过上传数量限制！最多上传3个')
          }}
        >
          <Tooltip content="上传文件">
            <IconFolderAdd className={iconBtnCls} />
          </Tooltip>
        </Upload>
        <IconVideoCamera className={iconBtnCls} />
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
  )
}

export default RoomInput
