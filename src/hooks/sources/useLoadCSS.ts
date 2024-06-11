import { useEffect } from 'react'

export default function useLoadCSS(url: string) {
  useEffect(() => {
    const link = document.createElement('link')
    link.href = url
    link.rel = 'stylesheet'
    link.type = 'text/css'
    document.head.appendChild(link)

    // 清理函数，卸载组件时移除 link 标签
    return () => {
      document.head.removeChild(link)
    }
  }, [])
}
