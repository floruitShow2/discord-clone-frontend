import { useNavigate } from 'react-router-dom'
import { Button, Tooltip } from '@arco-design/web-react'
import { IconMessage } from '@arco-design/web-react/icon'
import useLocale from '@/locale/useLocale'
import type { GroupBtnEntity } from './index.interface'

function NaviSiderbar() {
  const navigate = useNavigate()
  const $t = useLocale()

  const btnsConfig: GroupBtnEntity[] = [
    {
      tip: 'sidebar.chat.tip',
      code: 'chat',
      icon: <IconMessage />,
      callback() {
        navigate('/dashboard/chat')
      }
    },
    // {
    //   tip: 'sidebar.contact.tip',
    //   code: 'contact',
    //   icon: <IconUserGroup />,
    //   callback() {
    //     navigate('/dashboard/contact')
    //   }
    // },
    // {
    //   tip: 'sidebar.file.tip',
    //   code: 'file',
    //   icon: <IconFolder />,
    //   callback() {
    //     navigate('/dashboard/file')
    //   }
    // }
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
    <div className="w-full h-full py-2 gap-y-2 flex flex-col items-center justify-between border-r border-primary-b">
      {/* tools */}
      <div className="flex flex-col items-center gap-2 justify-start pb-3 mb-3 border-b border-primary-b">
        {genButtons()}
      </div>
    </div>
  )
}

export default NaviSiderbar
