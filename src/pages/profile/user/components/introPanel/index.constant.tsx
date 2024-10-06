import {
  IconEmail,
  IconFolder,
  IconHome,
  IconLink,
  IconLocation,
  IconPhone
} from '@arco-design/web-react/icon'

export const UserInfoTempList: Array<{
  label: string
  code: keyof User.UserEntity
  icon: JSX.Element
}> = [
  {
    label: 'Company',
    code: 'organization',
    icon: <IconHome />
  },
  {
    label: 'Career',
    code: 'job',
    icon: <IconFolder />
  },
  {
    label: 'Phone',
    code: 'phone',
    icon: <IconPhone />
  },
  {
    label: 'Website',
    code: 'socialAccounts',
    icon: <IconLink />
  },
  {
    label: 'Mail',
    code: 'email',
    icon: <IconEmail />
  },
  {
    label: 'Location',
    code: 'location',
    icon: <IconLocation />
  }
]
