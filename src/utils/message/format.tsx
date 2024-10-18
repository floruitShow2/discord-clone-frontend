import { cs } from '../property'

export const formatMessage = (message: Message.Entity) => {
  const { mentions, emojis, content: text } = message
  type MentionEntity = Message.Mention & { type: 'mention' }
  type EmojiEntity = Message.Emoji & { type: 'emoji' }

  const entities = [
    ...(mentions || []).map((mention) => ({ ...mention, type: 'mention' })),
    ...(emojis || []).map((emoji) => ({ ...emoji, type: 'emoji' }))
  ].sort((a, b) => a.offset - b.offset) as Array<MentionEntity | EmojiEntity>

  const result: (string | JSX.Element)[] = []
  let lastIndex = 0

  entities.forEach((entity, index) => {
    if (entity.offset > lastIndex) {
      const label = text.slice(lastIndex, entity.offset)
      result.push(
        <span key={`label-${lastIndex}-${label}`} className="text-sm break-all text-primary-l">
          {label}
        </span>
      )
    }

    if (entity.type === 'mention') {
      result.push(
        <div
          key={`mention-${index}-${entity.userId}`}
          className={cs('text-blue-500')}
          onClick={() => {
            console.log('mention', entity)
          }}
        >
          @{entity.username}
        </div>
      )
      lastIndex = entity.offset + entity.username.length + 1
    } else if (entity.type === 'emoji') {
      result.push(
        <img
          key={`emoji-${index}-${entity.url}`}
          src={entity.url}
          alt="emoji"
          className="inline-block w-5 h-5 mx-[2px] align-text-bottom"
        />
      )
      lastIndex = entity.offset + `<emoji src="${entity.url}">`.length
    }
  })

  if (lastIndex < text.length) {
    const label = text.slice(lastIndex)
    result.push(
      <span key={`label-${lastIndex}-${label}`} className="text-sm break-all text-primary-l">
        {label}
      </span>
    )
  }

  return result
}
