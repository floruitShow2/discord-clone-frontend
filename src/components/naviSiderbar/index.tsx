import { Button, Tooltip } from '@arco-design/web-react'
import { IconPlus, IconShareAlt } from '@arco-design/web-react/icon'
import useLocale from '@/locale/useLocale'
import type { GroupBtnEntity } from './index.interface'
import { useModal } from '@/hooks/useModal'

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

  return (
    <div className="w-full h-full py-2 flex flex-col items-center gap-2 justify-start border-r border-primary-b">
      {genButtons()}
    </div>
  )
}

export default NaviSiderbar
