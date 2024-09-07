import { useState, useEffect, useContext } from 'react'
import { Button, Modal, Drawer } from '@arco-design/web-react'
import { IconPen, IconQrcode } from '@arco-design/web-react/icon'
import Qrcode from 'qrcode'
import { FetchInviteCode, FetchRoomMembers } from '@/api/chat-room'
import UserAvatar from '@/components/userAvatar'
import CellGroup, { type CellConfig } from '@/components/cellGroup'
import MemeberList from '../MembersList'
import { RoomDetailsProps } from './index.interface'
import { translateToDateTime } from '@/utils/time'
import { RoomContext } from '../RoomWrapper'

function QrcodeCardWrapper({ info }: { info: Room.RoomEntity }) {
  const [qrcodeUrl, setQrcodeUrl] = useState<string>('')
  const initQrcode = async () => {
    try {
      const { data } = await FetchInviteCode(info.roomId)
      if (!data) return
      const targetUrl = `${import.meta.env.VITE_APP_URL}/action/join?inviteCode=${data}`
      Qrcode.toDataURL(
        targetUrl,
        {
          type: 'image/png',
          errorCorrectionLevel: 'H',
          color: {
            dark: '#555555',
            light: '#ffffff'
          }
        },
        function (err, url) {
          console.log(err)
          setQrcodeUrl(url)
        }
      )
    } catch (err) {
      console.log(err)
    }
  }

  const handleDownloadQrcode = () => {
    const a = document.createElement('a')
    a.download = `${info.roomName}-${translateToDateTime(new Date())}.png`
    a.href = qrcodeUrl
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  useEffect(() => {
    initQrcode()
  }, [])

  return (
    <div className="w-full h-full">
      <div className="w-full p-4 mb-8 flex flex-col items-start justify-center rounded-md shadow-md">
        <span className="mb-2 text-md text-primary-l">{info.roomName}</span>
        <p className="mb-2 p-2 rounded-md text-sm text-light-l bg-module">
          通过扫描下方二维码加入群聊，分享前请注意甄别对方信息，避免群聊信息泄露
        </p>
        <div className="w-full h-60 flex items-center justify-center">
          <img className="h-full" src={qrcodeUrl} alt="" />
        </div>
      </div>
      <div className="w-full flex gap-x-4 items-center justify-center">
        <Button type="primary" onClick={handleDownloadQrcode}>
          保存到本地
        </Button>
        <Button disabled>分享</Button>
      </div>
    </div>
  )
}

function RoomDetails(props: RoomDetailsProps) {
  const { onConfigChange } = props
  const { room: info, clearRecords } = useContext(RoomContext)

  const [members, setMembers] = useState<User.UserEntity[]>([])

  const genDetailsConfig = (): Array<{ group: string; configs: CellConfig[] }> => {
    return [
      {
        group: '群聊信息',
        configs: [
          {
            type: 'text',
            label: '群名称',
            description: '您暂无编辑群名称的权限，请联系管理员获取',
            value: info?.roomName,
            allowEdit: true,
            onChange: (newVal: string) => {
              if (!newVal) return
              onConfigChange && onConfigChange('roomName', newVal)
            }
          },
          {
            type: 'text',
            label: '创建时间',
            value: info?.createTime
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
            defaultChecked: info?.isPinned,
            onChange: (newVal: boolean) => {
              onConfigChange && onConfigChange('isPinned', newVal)
            }
          },
          {
            type: 'switch',
            label: '消息免打扰',
            defaultChecked: info?.noDisturbing,
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
                alignCenter: true,
                content: '确认删除所有聊天记录吗？清空后将无法重新找回',
                onOk() {
                  console.log('ok')
                  if (info && clearRecords) clearRecords(info.roomId)
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

  const [qrcodeVisible, setQrcodeVisible] = useState<boolean>(false)

  const initRoomMembers = async () => {
    try {
      const { data } = await FetchRoomMembers(info?.roomId || '')
      if (!data) return
      setMembers(data)
    } catch (err) {
      console.log(err)
      setMembers([])
    }
  }

  useEffect(() => {
    initRoomMembers()
  }, [])

  return (
    <aside className="w-80 h-full p-4 border-l border-primary-b overflow-auto">
      <div className="w-full mb-4 flex items-center justify-between">
        <div className="flex items-center justify-start">
          <UserAvatar
            className="mr-2"
            username={info?.roomName}
            avatar={info?.roomCover || ''}
            showState={false}
          />
          <div className="flex flex-col items-start justify-center">
            <div className="flex items-center justify-start text-primary-l">
              <span className="mr-1 text-sm">{info?.roomName}</span>
              <IconPen className="cursor-pointer hover:text-blue-500" />
            </div>
            <span className="text-xs text-light-l">{info?.roomDescription}</span>
          </div>
        </div>
        <Button
          icon={<IconQrcode />}
          onClick={() => {
            setQrcodeVisible(true)
          }}
        />
      </div>

      <MemeberList className="mb-4" members={members} />

      {genDetailsConfig().map((details) => (
        <div key={details.group} className="mb-3 flex flex-col items-start justify-start">
          <h4 className="mb-2 text-xs text-light-l leading-5">{details.group}</h4>
          <CellGroup configs={details.configs} />
        </div>
      ))}

      <Drawer
        width={450}
        title={<span>群聊二维码</span>}
        visible={qrcodeVisible}
        footer={null}
        onOk={() => {
          setQrcodeVisible(false)
        }}
        onCancel={() => {
          setQrcodeVisible(false)
        }}
      >
        {info && <QrcodeCardWrapper info={info} />}
      </Drawer>
    </aside>
  )
}

export default RoomDetails
