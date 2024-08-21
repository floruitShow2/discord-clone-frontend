export enum ContactItemEnum {
  ALL_PEOPLE = 'all-people',
  FAVORITE = 'favorite',
  TAGS = 'tags',
  EVENTS = 'events'
}

export interface ContactContextProps {
  menu?: ContactItemEnum
  setMenu?: React.Dispatch<React.SetStateAction<ContactItemEnum>>
}
