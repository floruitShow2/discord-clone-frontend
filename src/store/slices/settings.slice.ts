import { createSlice } from '@reduxjs/toolkit'
import useStorage from '@/utils/storage/local'

const { genKey, get, set } = useStorage()

const initialSettings: Global.Settings = {
  theme: get(genKey('theme')) || 'light',
  lang: get(genKey('lang')) || 'zh-CN'
}

const SettingsSlice = createSlice({
  name: 'settings',
  initialState: initialSettings,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark'
      set(genKey('theme'), state.theme)
    },
    toggleLang: (state, val) => {
      state.lang = val.payload ?? (state.lang === 'zh-CN' ? 'en-US' : 'zh-CN')
      set(genKey('lang'), state.lang)
    }
  }
})

export const { toggleLang, toggleTheme } = SettingsSlice.actions

export default SettingsSlice.reducer
