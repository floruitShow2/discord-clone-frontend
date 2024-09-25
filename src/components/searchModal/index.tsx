import { useState } from 'react'
// import type { FormEventHandler } from 'react'
import { Button, Input } from '@arco-design/web-react'
import { IconSearch } from '@arco-design/web-react/icon'
import { cs } from '@/utils/property'
import { SearchModalProps } from './index.interface'
import './index.less'

export default function SearchModal(props: SearchModalProps) {
  const { className, children } = props

  const [_isSearchPanelShow, setIsSearchPanelShow] = useState(false)
  const handleTriggerClick = () => {
    setIsSearchPanelShow(true)
  }

  const [searchQuery] = useState('')
  // const handleInput: FormEventHandler<HTMLInputElement> = (e) => {
  //   console.log(e)
  // }

  return (
    <>
      {/* trigger */}
      <div className={cs(className)} onClick={handleTriggerClick}>
        {children ? children : <Button icon={<IconSearch />} />}
      </div>
      {/* search panel */}
      <div
        className={cs(
          'search-modal-popup',
          'fixed top-0 left-0 right-0 bottom-0 bg-[#00000059] z-[999]',
          'gap-y-4 flex flex-col items-center justify-center'
        )}
      >
        {/* input */}
        <div
          className={cs(
            'border-solid border-2 border-transparent',
            'outline outline-4 outline-transparent',
            'w-[40vw] bg-[#f2f3f5]',
            'rounded-lg overflow-hidden',
            'transition-all duration-300 ease-in-out',
            'focus-within:!bg-white',
            'focus-within:!border-blue-300 focus-within:!outline-blue-100'
          )}
        >
          <Input value={searchQuery} size="large" prefix={<IconSearch />}></Input>
        </div>
        {/* list */}
        <div
          className={cs('w-[40vw] h-[40vh] p-3 bg-[#f2f3f5]', 'border border-solid border-primary-b rounded-lg')}
        >
          <header className={cs('w-full pb-2', 'border-b border-solid border-b-gray-200')}>
            <h4 className='text-primary-l'>Searching For</h4>
            <ul>
              <li></li>
            </ul>
          </header>
            <section></section>
            <footer>
              
            </footer>
        </div>
      </div>
    </>
  )
}
