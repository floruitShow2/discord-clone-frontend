import UserAvatar from '@/components/userAvatar'
import { cs } from '@/utils/property'
import type { BaseProps } from './index.interface'
import { IconPlus } from '@arco-design/web-react/icon'

function MemeberList(props: BaseProps) {
  const { className, members = [] } = props

  const genMembersCard = () => {
    const memberList = members.slice(0, 14).map((member) => {
      return (
        <li className="flex flex-col items-center justify-center" key={member.userId}>
          <UserAvatar
            username={member.username}
            avatar={member.avatar}
            showState={false}
          ></UserAvatar>
          <span className="text-xs text-primary-l mt-1">{member.username}</span>
        </li>
      )
    })

    return <>
      {memberList}
      <li className="flex flex-col items-center justify-center" key='plus'>
        <UserAvatar
          avatarClassName='hover:bg-module-2'
          avatar={<IconPlus />}
          showState={false}
        ></UserAvatar>
      </li>
    </>
  }

  return (
    <div className={cs(className, 'w-full p-2 rounded-md border border-primary-b')}>
      <h4 className="mb-2 text-sm text-left text-primary-l">Members</h4>
      <ul className="w-full gap-x-4 gap-y-1 flex items-start justify-start flex-wrap ">
        {genMembersCard()}
      </ul>
      <div className="w-full mt-2 flex items-center justify-center">
        <span className="cursor-pointer text-sm leading-6 text-primary-l hover:text-blue-500">
          view all（{members.length}/100）
        </span>
      </div>
    </div>
  )
}

export default MemeberList
