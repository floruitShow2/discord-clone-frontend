import { HTMLAttributes } from 'react'

export interface CellConfig {
  /**
   * @description 单元格类型
   */
  type: 'text' | 'navi' | 'btn' | 'switch'
  /**
   * @description 单元格左侧提示信息
   */
  label: string
  description?: string
  /**
   * @description 单元格右侧展示的文本
   */
  value?: string
  /**
   * @description 右侧文本是否可编辑
   */
  allowEdit?: boolean
  /**
   * @description switch cell 默认的选中状态
   */
  defaultChecked?: boolean

  btnStatus?: 'default' | 'success' | 'warning' | 'danger'

  /**
   * @description text cell 编辑后，switch cell 切换后触发
   * @param cell 触发事件的 cell config
   * @param index 触发事件的 cell index
   * @returns
   */
  onChange?: (newVal: any, cell: CellConfig, index: number) => void
  onBtnClick?: (cell: CellConfig, index: number) => void
}

export interface BaseProps extends HTMLAttributes<HTMLUListElement> {
  configs: CellConfig[]
}
