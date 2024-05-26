import { createSlice } from '@reduxjs/toolkit'
import { useStorage } from '@/utils/storage'
import { StorageIdEnum } from '@/constants/storage'

const { genKey, get, set } = useStorage()

const initialSettings: Global.Settings = {
  theme: get(genKey(StorageIdEnum.APP_THEME)) || 'light',
  lang: get(genKey(StorageIdEnum.APP_LANG)) || 'zh-CN'
}

const SettingsSlice = createSlice({
  name: 'settings',
  initialState: initialSettings,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark'
      set(genKey(StorageIdEnum.APP_THEME), state.theme)
    },
    toggleLang: (state, val) => {
      state.lang = val.payload ?? (state.lang === 'zh-CN' ? 'en-US' : 'zh-CN')
      set(genKey(StorageIdEnum.APP_LANG), state.lang)
    }
  }
})

export const { toggleLang, toggleTheme } = SettingsSlice.actions

export default SettingsSlice.reducer
