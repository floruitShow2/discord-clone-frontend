import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import DefaultLocale from './index'

function useLocale(locale = null) {
  const { lang } = useSelector((state: RootState) => state.settings)

  return (locale || DefaultLocale)[lang] || {}
}

export default useLocale
