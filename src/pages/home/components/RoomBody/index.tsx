import { useEffect, useState } from 'react'
import { Button, Modal } from '@arco-design/web-react'
import { IconPen, IconQrcode } from '@arco-design/web-react/icon'
import { FetchMessageList } from '@/api/chat-message'
import UserAvatar from '@/components/userAvatar'
import CellGroup, { type CellConfig } from '@/components/cellGroup'
import MemeberList from '../MembersList'
import MessageList from '../MessageList'
import type { BaseProps } from './index.interface'

function RoomBody(props: BaseProps) {
  const { className, info, showDetails = true, onConfigChange } = props

  const members: User.UserEntity[] = new Array(21).fill(0).map(() => ({
    avatar: 'https://avatars.githubusercontent.com/u/82753320?v=4',
    email: '',
    state: 0,
    userId: Math.random() + '',
    username: 'Test'
  }))

  const genDetailsConfig = (): Array<{ group: string; configs: CellConfig[] }> => {
    return [
      {
        group: '群聊信息',
        configs: [
          {
            type: 'text',
            label: '群名称',
            description: '您暂无编辑群名称的权限，请联系管理员获取',
            value: info.roomName,
            allowEdit: true,
            onChange: (newVal: string) => {
              if (!newVal) return
              onConfigChange && onConfigChange('roomName', newVal)
            }
          },
          {
            type: 'text',
            label: '创建时间',
            value: info.createTime
          }
        ]
      },
      {
        group: '个性化设置',
        configs: [
          {
            type: 'text',
            label: '我在本群的昵称',
            description: '由于管理员开启了内部群仅显示真名，此功能被禁用',
            value: '未设置'
          },
          {
            type: 'switch',
            label: '置顶会话',
            defaultChecked: info.isPinned,
            onChange: (newVal: boolean) => {
              onConfigChange && onConfigChange('isPinned', newVal)
            }
          },
          {
            type: 'switch',
            label: '消息免打扰',
            defaultChecked: info.noDisturbing,
            onChange: (newVal: boolean) => {
              onConfigChange && onConfigChange('noDisturbing', newVal)
            }
          }
        ]
      },
      {
        group: '其他操作',
        configs: [
          {
            type: 'btn',
            label: '清空聊天记录',
            onBtnClick() {
              Modal.confirm({
                title: '清空聊天记录',
                content: '确认删除所有聊天记录吗？清空后将无法重新找回',
                onOk() {
                  console.log('ok')
                }
              })
            }
          },
          {
            type: 'btn',
            btnStatus: 'danger',
            label: '退出群聊'
          }
        ]
      }
    ]
  }

  const [messages, setMessages] = useState<Message.Entity[]>([])

  const initMessage = async () => {
    try {
      const { data } = await FetchMessageList({ roomId: info.roomId, page: 1, pageSize: 10 })
      if (!data) return
      setMessages(data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    initMessage()
  }, [])

  return (
    <>
      <div className={`${className} flex items-start justify-between`}>
        <main className="flex-1 h-full bg-module overflow-auto">
          <MessageList msgs={messages} />
        </main>
        {showDetails && (
          <aside className="w-80 h-full p-4 border-l border-primary-b overflow-auto">
            <div className="w-full mb-4 flex items-center justify-between">
              <div className="flex items-center justify-start">
                <UserAvatar
                  className="mr-2"
                  username={info.roomName}
                  avatar={info.roomCover}
                  showState={false}
                />
                <div className="flex flex-col items-start justify-center">
                  <div className="flex items-center justify-start text-primary-l">
                    <span className="mr-1 text-sm">{info.roomName}</span>
                    <IconPen className="cursor-pointer hover:text-blue-500" />
                  </div>
                  <span className="text-xs text-light-l">Lorem ipsum dolor sit amet</span>
                </div>
              </div>
              <Button icon={<IconQrcode />} />
            </div>

            <MemeberList className="mb-4" members={members} />

            {genDetailsConfig().map((details) => (
              <div key={details.group} className="mb-3 flex flex-col items-start justify-start">
                <h4 className="mb-2 text-xs text-light-l leading-5">{details.group}</h4>
                <CellGroup configs={details.configs} />
              </div>
            ))}
          </aside>
        )}
      </div>
    </>
  )
}

export default RoomBody
