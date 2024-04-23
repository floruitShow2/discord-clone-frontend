import { FunctionComponent, useState } from 'react'
import { Button, Input, Switch } from '@arco-design/web-react'
import { IconPen } from '@arco-design/web-react/icon'
import { cs } from '@/utils/property'
import type { BaseProps, CellConfig } from './index.interface'
import styles from './index.module.less'

const CellGroup: FunctionComponent<BaseProps> = (props) => {
  const { configs } = props

  const cellBaseCls: string = cs(
    styles.cell,
    'w-full p-3 flex flex-col items-start justify-start border-b border-primary-b cursor-pointer hover:bg-module'
  )

  const genTextCell = (cell: CellConfig, index: number) => {
    const { label = '', value = '', description = '', allowEdit = false, onChange } = cell

    const [isEditing, setIsEditing] = useState(false)

    const handleInputChange = (val: string) => {
      console.log(1, val)
      onChange && onChange(val, cell, index)
    }

    return (
      <li key={index} className={cellBaseCls}>
        <div className="w-full flex items-center justify-between">
          <h4 className="text-sm text-black dark:text-white">{label}</h4>
          <div className="text-xs text-light-l">
            {isEditing ? (
              <Input
                value={value}
                size="mini"
                onChange={handleInputChange}
                onBlur={() => setIsEditing(false)}
              />
            ) : (
              <span>{value}</span>
            )}
            {allowEdit && !isEditing && (
              <IconPen
                className="ml-1 cursor-pointer hover:text-blue-500"
                onClick={() => setIsEditing(true)}
              />
            )}
          </div>
        </div>
        {description && <p className="mt-1 text-xs text-light-l">{description}</p>}
      </li>
    )
  }

  const genSwitchCell = (cell: CellConfig, index: number) => {
    const { label = '', description = '', defaultChecked = false, onChange } = cell

    const handleChange = (val: boolean) => {
      onChange && onChange(val, cell, index)
    }

    return (
      <li key={index} className={cellBaseCls}>
        <div className="w-full flex items-center justify-between">
          <h4 className="text-sm text-black dark:text-white">{label}</h4>
          <Switch checked={defaultChecked} onChange={handleChange} />
        </div>
        {description && <p className="mt-1 text-xs text-light-l">{description}</p>}
      </li>
    )
  }

  const genBtnCell = (cell: CellConfig, index: number) => {
    const { label, btnStatus = 'default', onBtnClick } = cell

    const handleBtnClick = () => {
      onBtnClick && onBtnClick(cell, index)
    }

    return (
      <li key={index} className={cellBaseCls}>
        <div className="w-full flex items-center justify-center">
          <Button
            className="!bg-transparent"
            type="text"
            status={btnStatus}
            onClick={handleBtnClick}
          >
            {label}
          </Button>
        </div>
      </li>
    )
  }

  return (
    <ul className="w-full flex flex-col items-center justify-start border border-primary-b rounded-md">
      {configs.map((cell, index) => {
        switch (cell.type) {
          case 'text':
            return genTextCell(cell, index)
          case 'switch':
            return genSwitchCell(cell, index)
          case 'btn':
            return genBtnCell(cell, index)
        }
      })}
    </ul>
  )
}

export type { CellConfig }
export default CellGroup
