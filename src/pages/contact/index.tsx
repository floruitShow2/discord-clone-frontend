import { cs } from '@/utils/property'
import { createContext, useState } from 'react'
import { ContactAside, ContactList, ContactActivity } from './components'
import { ContactContextProps, ContactItemEnum } from './index.interface'

export const ContactContext = createContext<ContactContextProps>({
  menu: undefined,
  setMenu: undefined
})

function DashboardContact() {
  const [activeMenu, setActiveMenu] = useState<ContactItemEnum>(ContactItemEnum.ALL_PEOPLE)

  return (
    <ContactContext.Provider value={{ menu: activeMenu, setMenu: setActiveMenu }}>
      <div className={cs('w-full h-full bg-primary-b', 'flex items-start justify-start')}>
        <ContactAside />
        <ContactList />
        <ContactActivity />
      </div>
    </ContactContext.Provider>
  )
}

export default DashboardContact
