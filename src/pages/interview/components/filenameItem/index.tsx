import { useEffect, useRef, useState } from 'react'
import { Dropdown, Input, Menu, Popconfirm } from '@arco-design/web-react'
import type { RefInputType } from '@arco-design/web-react/es/Input'
import { IconClose, IconEdit } from '@arco-design/web-react/icon'
import { cs } from '@/utils/property'
import { isFunction } from '@/utils/is'
import { FilenameItemProps } from './index.interface'

function FilenameItem(props: FilenameItemProps) {
  const { name, readonly, isActive, onSelect, onRemove, onRename } = props

  const [localName, setLocalName] = useState(name)
  const [isEditing, setIsEditing] = useState(!!name ? false : true)

  const inputRef = useRef<RefInputType>(null)
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  const baseMenu: DropdownItem.Entity[] = [
    {
      label: '重命名',
      key: 'rename',
      visible: () => !readonly,
      icon: <IconEdit />,
      handler() {
        setIsEditing(true)
      }
    }
  ]

  const handleChange = (e: string) => {
    setLocalName(e)
  }
  const handleBlur = () => {
    if (!localName) {
      onRemove && onRemove('')
      return
    }
    onRename(name, localName)
  }
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === 'Enter') {
      handleBlur()
    }
  }
  const handleRemove = () => {
    onRemove && onRemove(localName)
  }

  return (
    <Dropdown
      trigger="contextMenu"
      position="bl"
      droplist={
        <Menu>
          {baseMenu
            .filter((item) => {
              if (isFunction(item.visible)) {
                return item.visible()
              } else {
                return item.visible
              }
            })
            .map((item) => (
              <Menu.Item key={item.key} onClick={() => item.handler()}>
                <div
                  className={cs(
                    'w-full h-full',
                    'gap-x-2 flex items-center justify-center',
                    'text-xs'
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              </Menu.Item>
            ))}
        </Menu>
      }
    >
      <li
        className={cs(
          'h-full px-3',
          'gap-x-1 flex items-center justify-center',
          'text-xs text-primary-l',
          'cursor-pointer',
          'hover:text-blue-500',
          isActive ? 'bg-module' : ''
        )}
        onClick={() => onSelect && onSelect(localName)}
      >
        {isEditing ? (
          <Input
            ref={inputRef}
            className="w-[100px]"
            size="mini"
            value={localName}
            onChange={handleChange}
            onKeyDownCapture={handleKeyDown}
            onBlur={handleBlur}
          />
        ) : (
          <span>{localName}</span>
        )}
        {isActive && !isEditing && !readonly && (
          <Popconfirm
            title="Confirm"
            content={`Are you sure you want to delete ${name}?`}
            onOk={handleRemove}
          >
            <IconClose className="translate-y-[1px]" />
          </Popconfirm>
        )}
      </li>
    </Dropdown>
  )
}

export default FilenameItem
