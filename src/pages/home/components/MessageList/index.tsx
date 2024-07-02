import { useState } from 'react'
import { IconClose } from '@arco-design/web-react/icon'
import { MessageTypeEnum } from '@/constants'
import { cs } from '@/utils/property'
import UserAvatar from '@/components/userAvatar'
import { FilePreviewer } from '@/components/filePreviewer'
import type { MessageListProps } from './index.interface'
import { NormalMessage, MarkerMessage } from './components/MessageEntity'

function MessageList(props: MessageListProps) {
  const { className, msgs, ...rest } = props

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
            return (
              <NormalMessage
                key={msg.messageId}
                msg={msg}
                onPreview={handleFilePreview}
                {...rest}
              />
            )
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
