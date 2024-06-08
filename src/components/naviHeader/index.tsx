import { Tooltip, Button, Select, Message } from '@arco-design/web-react'
import { IconLanguage, IconMoonFill, IconSunFill } from '@arco-design/web-react/icon'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '@/store'
import { toggleTheme, toggleLang } from '@/store/slices/settings.slice'
import DefaultLocale from '@/locale'
import useLocale from '@/locale/useLocale'
import Logo from '@/assets/images/logo/meleon.png'

function NaviSidebar() {
  const dispatch = useDispatch()
  const { theme, lang } = useSelector((state: RootState) => state.settings)

  const $t = useLocale()

  return (
    <div className="w-full h-full p-4 pr-6 flex items-center bg-primary justify-between border-b border-primary-b shadow-sm">
      {/* Logo */}
      <div className="flex items-center justify-start">
        <img className="h-10" src={Logo} alt="" />
        <h4 className="font-bold text-primary-l">Meleon Discord Clone</h4>
      </div>
      {/* Operation btns */}
      <div className="flex items-center justify-end gap-2">
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
      </div>
    </div>
  )
}

export default NaviSidebar
