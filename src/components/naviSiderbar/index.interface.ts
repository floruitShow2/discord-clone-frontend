import DefaultLocale from '@/locale'

export interface GroupBtnEntity {
    // tooltip 提示信息
    tip: keyof typeof DefaultLocale['zh-CN']
    // 按钮功能代码
    code: string
    // 图标
    icon: React.ReactNode
    callback?: () => void
}