declare namespace DropdownItem {
  interface Entity {
    label: string
    key: string
    icon: React.ReactNode
    handler: () => void
  }
}
