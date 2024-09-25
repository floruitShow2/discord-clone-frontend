import { useState } from 'react'
import type { FormEventHandler } from 'react'
import { Input, Modal } from '@arco-design/web-react'
import { IconArrowDown, IconArrowUp, IconSearch } from '@arco-design/web-react/icon'
import { cs } from '@/utils/property'
import { SearchModalProps } from './index.interface'

export default function SearchModal(props: SearchModalProps) {
  const { className, children } = props

  const [isSearchPanelShow, setIsSearchPanelShow] = useState(false)
  const handleTriggerClick = () => {
    setIsSearchPanelShow(true)
  }

  const [searchQuery] = useState('')
  const handleInput: FormEventHandler<HTMLInputElement> = (e) => {
    console.log(e)
  }

  return (
    <>
      {/* trigger */}
      <div className={cs(className)} onClick={handleTriggerClick}>
        {children ? children : <IconSearch />}
      </div>
      {/* search panel */}
      <Modal
        v-model:visible={isSearchPanelShow}
        v-slots={{
          title: () => (
            <Input
              v-model={searchQuery}
              v-slots={{
                prefix: () => <i className="iconfont ws-search"></i>
              }}
              size="large"
              onInput={handleInput}
            ></Input>
          ),
          default: () => {},
          footer: () => {
            ;<div>
              <div>
                <IconArrowUp />
                <IconArrowDown />
              </div>
            </div>
          }
        }}
        closable={false}
        align-center={false}
      />
    </>
  )
}
