declare namespace DropdownItem {
  interface Entity {
    label: string
    key: string
    icon: React.ReactNode
    visible?: boolean | (() => boolean)
    handler: () => void
  }
}
