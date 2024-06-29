import { MessageTypeEnum } from '@/constants'
import { translateToDateTime } from './translate'

const genTimestampMessage = (message: Message.Entity) => {
  const { createTime, roomId, profile } = message
  const timestampMessage: Message.Entity = {
    messageId: new Date(createTime).getTime().toString(),
    roomId,
    profile,
    metions: [],
    content: translateToDateTime(createTime, 'MM月DD日 HH:mm'),
    url: '',
    type: MessageTypeEnum.ACTION,
    createTime
  }

  return timestampMessage
}

export const transalteMessagesByTime = (
  messages: Message.Entity[],
  minInterval = 5 * 60 * 1000
) => {
  if (!messages.length) return []

  messages = messages.sort((a, b) => new Date(a.createTime).getTime() - new Date(b.createTime).getTime())
  const firstTimestamp = genTimestampMessage(messages[0])

  const result: Message.Entity[] = [firstTimestamp, messages[0]]
  const messageIdSet = new Set<string>([])

  for (let i = 1; i < messages.length; i++) {
    const lastEle = result.at(-1)
    if (!lastEle) return result

    const curEle = messages[i]

    const lastTimestamp = new Date(lastEle.createTime).getTime()
    const curTimestamp = new Date(curEle.createTime).getTime()

    if (messageIdSet.has(curEle.messageId)) continue

    messageIdSet.add(curEle.messageId)
    if (lastTimestamp + minInterval <= curTimestamp) {
      result.push(genTimestampMessage(curEle), curEle)
    } else {
      result.push(curEle)
    }
  }

  return result
}
