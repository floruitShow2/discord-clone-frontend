import { Button, Dropdown, Menu } from '@arco-design/web-react'
import { IconMoreVertical, IconUser, IconUserAdd } from '@arco-design/web-react/icon'
import { cs } from '@/utils/property'
import UserAvatar from '@/components/userAvatar'
import styles from '../index.module.less'

const renderUserList = (users: User.UserEntity[]) => {
  const operationConfigs: DropdownItem.Entity[] = [
    {
      label: 'Go Profile',
      key: '1',
      icon: <IconUser className="text-primary-l" />,
      handler() {
        console.log('去个人主页')
      }
    },
    {
      label: 'Add Friend',
      key: '2',
      icon: <IconUserAdd className="text-primary-l" />,
      handler() {
        console.log('加好友')
      }
    }
  ]

  return users.map((info) => (
    <li
      key={info.userId}
      className={cs(
        'w-full',
        'flex items-center justify-between',
        'rounded-md cursor-pointer',
        'hover:bg-[#f8f9fa]'
      )}
    >
      {/* left */}
      <div className={cs('max-w-[60%]', 'flex items-center justify-start')}>
        <UserAvatar
          className="mr-2"
          username={info.username}
          avatar={info.avatar || ''}
          showState={false}
        />
        <div className="flex flex-col items-start justify-center">
          <span className="mr-1 text-sm">{info.username}</span>
          <span className={cs(styles['service-modal-find-item--intro'], 'text-xs text-light-l')}>
            {info.introduction}
          </span>
        </div>
      </div>
      {/* right */}
      <div className={cs('flex items-center justify-end')}>
        <Dropdown
          trigger="click"
          droplist={
            <Menu>
              {operationConfigs.map((operation) => (
                <Menu.Item key={operation.key} onClick={() => operation.handler()}>
                  <div className="w-40 h-full flex items-center justify-between">
                    <span className="text-xs text-primary-l">{operation.label}</span>
                    {operation.icon}
                  </div>
                </Menu.Item>
              ))}
            </Menu>
          }
        >
          <Button
            type="text"
            icon={<IconMoreVertical className="text-primary-l hover:text-blue-500" />}
            style={{ background: 'none' }}
          ></Button>
        </Dropdown>
      </div>
    </li>
  ))
}

export default renderUserList
