export interface FilenameItemProps {
  name: string
  readonly: boolean
  isActive: boolean

  onRename: (oldName: string, newName: string) => void
  onSelect: (name: string) => void
  onRemove: (name: string) => void
}
