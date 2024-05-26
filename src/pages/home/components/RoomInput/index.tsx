import { useState } from 'react'
import { Mentions } from '@arco-design/web-react'
import { IconFaceSmileFill, IconFolderAdd, IconVideoCamera } from '@arco-design/web-react/icon'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { MessageType } from '@/constants'
import { RoomInputProps } from './index.interface'

function RoomInput(props: RoomInputProps) {
  const { onMessageEmit } = props

  const iconBtnCls = 'cursor-pointer hover:text-blue-500'

  const { userInfo } = useSelector((state: RootState) => state.user)

  const [inputValue, setInputValue] = useState('')

  const handleKeyDown = (e: any) => {
    onMessageEmit({
      roomId: '6649fb83035a382e127368db',
      type: MessageType.TEXT,
      profileId: userInfo?.userId || '',
      content: e.target.value,
      url: ''
    })
    setInputValue('')
  }

  return (
    <div className="w-full h-28 px-3 py-2 flex flex-col items-start justify-between border-t border-primary-b">
      <div className="w-full py-2 flex gap-x-2 items-center justify-start text-xl text-light-l">
        <IconFaceSmileFill className={iconBtnCls} />
        <IconFolderAdd className={iconBtnCls} />
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
