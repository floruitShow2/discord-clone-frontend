import { Button, Skeleton, Tooltip } from '@arco-design/web-react'
import { IconPlus, IconShareAlt } from '@arco-design/web-react/icon'
import useLocale from '@/locale/useLocale'
import type { GroupBtnEntity } from './index.interface'
import { useModal } from '@/hooks/useModal'
import { useServers } from '@/hooks/servers/useServers'
import { useEffect, useState } from 'react'
import { useSession } from '@clerk/clerk-react'
import UserAvatar from '../userAvatar'

function NaviSiderbar() {
  const $t = useLocale()
  const { openModal } = useModal('CreateServerModal')

  const btnsConfig: GroupBtnEntity[] = [
    {
      tip: 'sidebar.plus.tip',
      code: 'plus',
      icon: <IconPlus />,
      callback: () => {
        openModal()
      }
    },
    {
      tip: 'sidebar.share.tip',
      code: 'share',
      icon: <IconShareAlt />
    }
  ]
  const genButtons = () => {
    return btnsConfig.map((btn) => (
      <Tooltip key={btn.code} content={$t[btn.tip]} position="right">
        <Button
          className="!text-primary-l"
          icon={btn.icon}
          shape="round"
          type="text"
          onClick={() => btn.callback && btn.callback()}
        />
      </Tooltip>
    ))
  }

  const { session } = useSession()
  const { servers, loading } = useServers()
  const [serversVisible, setServersVisible] = useState(false)
  const genServers = () => {
    return (
      <Skeleton loading={loading} image={{ shape: 'circle' }}>
        {servers.map((server) => (
          <div key={server.id}>
            <UserAvatar username={server.name} avatar={server.imageUrl}></UserAvatar>
            {/* <span>{server.name}</span> */}
          </div>
        ))}
      </Skeleton>
    )
  }

  useEffect(() => {
    setServersVisible(true)
  }, [session?.user])

  return (
    <div className="w-full h-full py-2 flex flex-col items-center gap-2 justify-start border-r border-primary-b">
      {/* tools */}
      <div className="flex flex-col items-center gap-2 justify-start pb-3 mb-3 border-b border-primary-b">
        {genButtons()}
      </div>
      {/* servers */}
      <div className="flex flex-col items-center gap-3 justify-start">
        {serversVisible && genServers()}
      </div>
    </div>
  )
}

export default NaviSiderbar
