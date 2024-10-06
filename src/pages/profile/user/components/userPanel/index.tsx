import { useContext } from 'react'
import { Button } from '@arco-design/web-react'
import { IconPlus } from '@arco-design/web-react/icon'
import { UpdateUserInfo } from '@/api/auth'
import { cs } from '@/utils/property'
import BgBusiness from '@/assets/images/bg/bg-business.jpg?url'
import ImageCropper from '@/components/imageCropper'
import { ProfileContext } from '../../index'

function UserPanel() {
  const { userInfo } = useContext(ProfileContext)

  const handleAvatarChange = async (url: string) => {
    try {
      await UpdateUserInfo({ avatar: url })
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className={cs('relative h-[300px]', 'flex-1', 'rounded-md bg-primary')}>
      <div className={cs('w-full h-3/5', 'overflow-hidden')}>
        <img className="w-full" src={BgBusiness} alt="" />
      </div>
      <div
        className={cs(
          'absolute top-3/5 left-3',
          '-mt-8 p-[2px]',
          'rounded-full bg-primary shadow-md'
        )}
      >
        {userInfo && (
          <ImageCropper
            size={72}
            shape="circle"
            url={userInfo.avatar}
            onChange={handleAvatarChange}
          />
        )}
      </div>
      {/* 功能按钮行 */}
      <div className={cs('h-[44px] px-3', 'gap-x-2 flex items-center justify-end')}>
        <Button type="primary" size="small" shape="round">
          Message
        </Button>
        <Button type="outline" size="small" shape="round" icon={<IconPlus />}>
          Follow
        </Button>
      </div>
      <div className={cs('p-3', 'flex flex-col items-start justify-center')}>
        <div className="flex items-center justify-start text-primary-l">
          <span className="mr-1 text-sm font-bold">{userInfo?.username}</span>
        </div>
        <span className="text-xs text-light-l">{userInfo?.introduction}</span>
      </div>
    </div>
  )
}

export default UserPanel
