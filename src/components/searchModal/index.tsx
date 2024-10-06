import { useEffect, useRef, useState } from 'react'
import { useDebounceFn } from 'ahooks'
import { Button, Input, Tag } from '@arco-design/web-react'
import type { RefInputType } from '@arco-design/web-react/es/Input'
import {
  IconArrowDown,
  IconArrowUp,
  IconCommand,
  IconExport,
  IconSearch
} from '@arco-design/web-react/icon'
import { FetchRoomByQuery } from '@/api/chat-room'
import { FetchUserByQuery } from '@/api/auth'
import { cs } from '@/utils/property'
import { renderUserList, renderRoomList } from './components'
import { SearchModalProps } from './index.interface'
import './index.less'

export default function SearchModal(props: SearchModalProps) {
  const { className, children } = props

  const [isSearchPanelShow, setIsSearchPanelShow] = useState(false)
  useEffect(() => {
    if (isSearchPanelShow) {
      inputRef.current?.focus?.()
    }
  }, [isSearchPanelShow])
  const handleTriggerClick = () => {
    setIsSearchPanelShow(true)
  }

  const btnCls = cs(
    'w-[28px] h-[28px]',
    'flex items-center justify-center',
    'rounded-[4px] border border-solid border-[#dbdbdb]',
    'shadow-md',
    'text-primary-l'
  )

  const [searchQuery, setSearchQuery] = useState('')
  const handleInput = (e: any) => {
    setSearchQuery(e.target?.value || '')
  }

  const [rooms, setRooms] = useState<Room.RoomEntity[]>([])
  const [users, setUsers] = useState<User.UserEntity[]>([])

  const updateSearchResult = async (query: string) => {
    // if (!query) return
    const res = await Promise.all([FetchRoomByQuery(query), FetchUserByQuery(query)])
    const [roomRes, userRes] = res
    setRooms(roomRes.data || [])
    setUsers(userRes.data || [])
  }
  const { run: debouncedUpdateSearchResult } = useDebounceFn(updateSearchResult, { wait: 200 })
  useEffect(() => {
    debouncedUpdateSearchResult(searchQuery)
  }, [searchQuery])

  const inputRef = useRef<RefInputType>(null)
  const onSearchModalKeydown = (e: KeyboardEvent) => {
    // 开启
    if (e.code === 'KeyK' && e.ctrlKey) {
      e.preventDefault()
      setIsSearchPanelShow(true)
    }
    // 退出
    if (e.code === 'Escape') {
      e.preventDefault()
      setIsSearchPanelShow(false)
    }
    // 上下移
    if (e.code === 'ArrowUp') {
      e.preventDefault()
    }
    if (e.code === 'ArrowDown') {
      e.preventDefault()
    }
    // 确认
    if (e.code === 'Enter') {
      e.preventDefault()
    }
  }
  useEffect(() => {
    window.addEventListener('keydown', onSearchModalKeydown)

    return () => {
      window.removeEventListener('keydown', onSearchModalKeydown)
    }
  }, [])

  return (
    <>
      {/* trigger */}
      <div className={cs(className, 'search-modal')} onClick={handleTriggerClick}>
        {children ? (
          children
        ) : (
          <div
            className={cs(
              'search-modal-trigger',
              'w-[160px] h-[32px] px-2 py-1 rounded-sm',
              'flex items-center justify-between',
              'bg-module'
            )}
          >
            <div className={cs('gap-x-1 flex items-center justify-start', 'text-primary-l')}>
              <IconSearch />
              <span>搜索</span>
            </div>
            <div className={cs('gap-x-1 flex items-center justify-end')}>
              <div className={cs(btnCls, '!w-[18px] !h-[18px] !bg-white !shadow-none')}>
                <IconCommand />
              </div>
              <div className={cs(btnCls, '!w-[18px] !h-[18px] !bg-white !shadow-none')}>
                <span>K</span>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* search panel */}
      {isSearchPanelShow && (
        <div
          className={cs(
            'search-modal-popup',
            'fixed top-0 left-0 right-0 bottom-0 bg-[#00000059] z-[999]',
            'gap-y-4 flex flex-col items-center justify-center'
          )}
          onClick={() => setIsSearchPanelShow(false)}
        >
          {/* input */}
          <div
            className={cs(
              'border-solid border-2 border-transparent',
              'outline outline-4 outline-transparent',
              'w-[40vw] bg-white',
              'rounded-lg overflow-hidden cursor-pointer',
              'transition-all duration-300 ease-in-out',
              'focus-within:!bg-white',
              'focus-within:!border-blue-300 focus-within:!outline-blue-100'
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <Input
              ref={inputRef}
              value={searchQuery}
              size="large"
              prefix={<IconSearch />}
              onInput={handleInput}
            ></Input>
          </div>
          {/* list */}
          <div
            className={cs(
              'search-modal-popup--content',
              'w-[40vw] h-[45vh] px-3 py-3 bg-white',
              'border border-solid border-primary-b rounded-lg',
              'transition-all duration-300 ease-in-out',
              'overflow-hidden'
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <header className={cs('w-full pb-3', 'border-b border-solid border-b-gray-200')}>
              <h4 className="text-primary-l">Searching For</h4>
              <ul>
                <li></li>
              </ul>
            </header>
            <section className={cs('w-full py-3')} style={{ height: 'calc(100% - 80px)' }}>
              {/* users */}
              {users.length > 0 && (
                <div
                  className={cs(
                    'w-full mb-2 pb-3',
                    'gap-y-1 flex flex-col items-start justify-start',
                    'border-b border-solid border-b-primary-b'
                  )}
                >
                  <h4 className="text-primary-l">Users</h4>
                  <ul className={cs('w-full', 'gap-y-1 flex flex-col items-start justify-start')}>
                    {renderUserList(users)}
                  </ul>
                </div>
              )}
              {/* rooms */}
              {rooms.length > 0 && (
                <div className={cs('w-full', 'gap-y-1 flex flex-col items-start justify-start')}>
                  <h4 className="text-primary-l">Rooms</h4>
                  <ul className={cs('w-full', 'gap-y-1 flex flex-col items-start justify-start')}>
                    {renderRoomList(rooms)}
                  </ul>
                </div>
              )}
            </section>
            <footer
              className={cs(
                'w-full pt-3',
                'gap-x-6 flex items-center justify-start',
                'border-t border-solid border-t-gray-200'
              )}
            >
              {/* 上下键移动 */}
              <div className="gap-x-1 flex items-center justify-start opacity-50">
                <div className={btnCls}>
                  <IconArrowUp />
                </div>
                <div className={btnCls}>
                  <IconArrowDown />
                </div>
                <span className="text-primary-l">Move</span>
              </div>
              {/* 回车确认 */}
              <div className="gap-x-1 flex items-center justify-start opacity-50">
                <div className={btnCls}>
                  <i className="iconfont mc-enter"></i>
                </div>
                <span className="text-primary-l">Select</span>
              </div>
              {/* 退出 */}
              <div className="gap-x-1 flex items-center justify-start">
                <div className={btnCls}>
                  <IconExport />
                </div>
                <span className="text-primary-l">Exit</span>
              </div>
            </footer>
          </div>
        </div>
      )}
    </>
  )
}
