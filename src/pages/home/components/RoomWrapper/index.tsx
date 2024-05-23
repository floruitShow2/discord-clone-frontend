import RoomHeader from '../RoomHeader'
import RoomBody from '../RoomBody'
import RoomInput from '../RoomInput'
import { RoomWrapperProps } from './index.interface'
import styles from './index.module.less'

function RoomWrapper(props: RoomWrapperProps) {
  const { room, onConfigChange } = props
  if (room) {
    return (
      <>
        <RoomHeader info={room} />
        <RoomBody className={styles['room-body']} info={room} onConfigChange={onConfigChange} />
        <RoomInput />
      </>
    )
  } else {
    return <>请先选择联系人</>
  }
}

export default RoomWrapper
