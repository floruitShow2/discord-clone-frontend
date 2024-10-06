import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Tooltip, Button, Select, Message, Popover, Empty } from '@arco-design/web-react'
import {
  IconLanguage,
  IconMoonFill,
  IconRight,
  IconSunFill,
  IconUser
} from '@arco-design/web-react/icon'
import type { RootState } from '@/store'
import { toggleTheme, toggleLang } from '@/store/slices/settings.slice'
import DefaultLocale from '@/locale'
import useLocale from '@/locale/useLocale'
import Logo from '@/assets/images/logo/meleon.png?url'
import { cs } from '@/utils/property'
import SearchModal from '../searchModal'
import UserAvatar from '../userAvatar'

function NaviSidebar() {
  const navigate = useNavigate()

  const dispatch = useDispatch()
  const { theme, lang } = useSelector((state: RootState) => state.settings)
  const userInfo = useSelector((state: RootState) => state.user.userInfo)

  const $t = useLocale()

  const [isAvatarPopoverShow, setIsAvatarPopoverShow] = useState(false)
  const handleAvatarClick = () => {
    setIsAvatarPopoverShow(true)
  }
  const navigateToProfile = () => {
    if (!userInfo || !userInfo.userId) return
    setIsAvatarPopoverShow(false)
    navigate(`/profile/${userInfo.userId}`)
  }
  const renderUserPopoverContent = () => {
    if (!userInfo) {
      return <Empty description="无用户信息"></Empty>
    } else {
      return (
        <div className={cs('w-[250px]')}>
          <div className="px-2 mb-3 flex items-center justify-start">
            <UserAvatar className="mr-2" avatar={userInfo.avatar} shape="circle" />
            <div className="flex flex-col items-start justify-center">
              <div className="flex items-center justify-start text-primary-l">
                <span className="mr-1 text-sm">{userInfo.username}</span>
              </div>
              <span className="text-xs text-light-l">{userInfo.introduction}</span>
            </div>
          </div>
          <ul className="w-full flex flex-col items-center justify-start">
            <li
              className={cs(
                'w-full h-[40px] px-2',
                'flex items-center justify-between',
                'rounded-md cursor-pointer',
                'hover:bg-module'
              )}
              onClick={navigateToProfile}
            >
              <div className="gap-x-2 flex items-center justify-start">
                <IconUser />
                <span>个人中心</span>
              </div>
              <IconRight />
            </li>
          </ul>
        </div>
      )
    }
  }

  return (
    <div className="w-full h-full p-4 pr-6 flex items-center bg-primary justify-between border-b border-primary-b shadow-sm">
      {/* Logo */}
      <div className="flex items-center justify-start">
        <img className="h-10" src={Logo} alt="" />
        <h4 className="font-bold text-primary-l">Meleon Chat</h4>
      </div>
      {/* Operation btns */}
      <div className="flex items-center justify-end gap-2">
        {/* 全局搜索 */}
        <SearchModal />
        {/* 国际化 */}
        <Select
          triggerElement={
            <Button type="secondary" shape="round" status="default" icon={<IconLanguage />} />
          }
          options={[
            { label: '中文', value: 'zh-CN' },
            { label: 'English', value: 'en-US' }
          ]}
          value={lang}
          triggerProps={{
            autoAlignPopupWidth: false,
            autoAlignPopupMinWidth: true,
            position: 'br'
          }}
          trigger="hover"
          onChange={(value: Global.Settings['lang']) => {
            dispatch(toggleLang(value))
            const nextLocale = DefaultLocale[value]
            Message.info(`${nextLocale['settings.lang.tips']}: ${value}`)
          }}
        />
        {/* 主题色切换 */}
        <Tooltip
          content={theme === 'dark' ? $t['settings.theme.toLight'] : $t['settings.theme.toDark']}
        >
          <Button
            type="secondary"
            shape="round"
            status="default"
            icon={theme === 'dark' ? <IconMoonFill /> : <IconSunFill />}
            onClick={() => dispatch(toggleTheme())}
          />
        </Tooltip>
        {/* 用户 */}
        {userInfo && (
          <Popover
            popupVisible={isAvatarPopoverShow}
            position="br"
            content={renderUserPopoverContent()}
            triggerProps={{
              onClickOutside: () => {
                setIsAvatarPopoverShow(false)
              }
            }}
          >
            <UserAvatar
              avatar={userInfo.avatar}
              size={32}
              shape="circle"
              onClick={handleAvatarClick}
            ></UserAvatar>
          </Popover>
        )}
      </div>
    </div>
  )
}

export default NaviSidebar
