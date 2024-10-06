import { useContext } from 'react'
import { cs } from '@/utils/property'
import { ProfileContext } from '../../index'
import { UserInfoTempList } from './index.constant'

function InfoPanel() {
  const { userInfo } = useContext(ProfileContext)
  return (
    <div className={cs('w-[300px] h-[300px]', 'rounded-md bg-primary')}>
      <h4 className="p-3 mb-3 border-b border-solid border-primary-b">Intro</h4>
      {userInfo && (
        <ul
          className={cs('w-full px-3', 'flex flex-col items-center justify-between')}
          style={{ height: 'calc(300px - 72px)' }}
        >
          {UserInfoTempList.map((message) => (
            <li
              className={cs('w-full', 'flex items-center justify-between', 'text-primary-l')}
              key={message.label}
            >
              <div className={cs('gap-x-2 flex items-center justify-start')}>
                <div
                  className={cs(
                    'w-7 h-7',
                    'flex items-center justify-center',
                    'rounded-full bg-module'
                  )}
                >
                  {message.icon}
                </div>
                <span className='text-sm'>{message.label}</span>
              </div>
              <span className="font-bold">{userInfo[message.code] || '-'}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default InfoPanel
