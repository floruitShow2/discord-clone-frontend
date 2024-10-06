import { createContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { FetchUserInfo } from '@/api/auth'
import { cs } from '@/utils/property'
import UserPanel from './components/userPanel'
import InfoPanel from './components/introPanel'
import { ProfileContextProps } from './index.interface'

export const ProfileContext = createContext<ProfileContextProps>({
  userInfo: null
})

function ProfileCenter() {
  const { id } = useParams()

  const [userInfo, setUserInfo] = useState<User.UserEntity | null>(null)
  const initUserInfo = async (id: string) => {
    try {
      const { data } = await FetchUserInfo(id)
      if (data) setUserInfo(data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (id) initUserInfo(id)
  }, [id])

  return (
    <ProfileContext.Provider value={{ userInfo }}>
      <div className={cs('w-full h-full p-3', 'bg-module')}>
        <div className={cs('w-full', 'gap-x-3 flex items-start justify-between')}>
          <UserPanel />
          <InfoPanel />
        </div>
      </div>
    </ProfileContext.Provider>
  )
}

export default ProfileCenter
