import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import { CozeConversationStatusEnum } from '@/constants/coze.enum'
import { setAnswer, setCoze, setIsReading } from '@/store/slices/coze.slice'
import { parseDataString } from '@/utils/coze'
import { isUndefined } from '@/utils/is'

export function useCoze() {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(setCoze(null))
  }, [dispatch])

  const answer = useSelector((state: RootState) => state.coze.answer)
  const userInfo = useSelector((state: RootState) => state.user.userInfo)

  const isReading = useRef(false)

  const callCozeChat = async (conversationId: string, question: string) => {
    if (!userInfo) return
    console.log(conversationId)
    const data = {
      bot_id: import.meta.env.VITE_COZE_BOT_ID,
      user_id: userInfo.userId,
      stream: true,
      additional_messages: [
        {
          role: 'user',
          content: question,
          content_type: 'text'
        }
      ]
    }
    fetch(`https://api.coze.cn/v3/chat`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_COZE_AUTHORIZATION}`
      },
      body: JSON.stringify(data)
    })
      .then((response) => response.body)
      .then((body) => {
        if (!body) return
        const reader = body.getReader()
        const decoder = new TextDecoder()
        return new ReadableStream({
          start(controller) {
            function pump(): any {
              return reader.read().then((event) => {
                const { done, value } = event
                if (done) {
                  controller.close()
                  return
                }
                const chunk = decoder.decode(value)
                chunk
                  .split('\n')
                  .filter((item) => !!item)
                  .forEach((item) => {
                    switch (item) {
                      case CozeConversationStatusEnum.CREATED:
                        // console.log('created')
                        isReading.current = true
                        dispatch(setIsReading(true))
                        break
                      case CozeConversationStatusEnum.IN_PROGRESS:
                        // console.log('in progress')
                        break
                      case CozeConversationStatusEnum.DELTA:
                        // console.log('delta')
                        break
                      case CozeConversationStatusEnum.COMPLETE:
                        console.log('complete')
                        isReading.current = false
                        dispatch(setIsReading(false))
                        break
                      default:
                        if (isReading.current) {
                          const message = parseDataString(item)
                          dispatch(setAnswer(message?.content || ''))
                        }
                        break
                    }
                  })
                if (isReading.current) pump()
              })
            }
            pump()
          }
        })
      })
  }

  return {
    answer,
    isReading,
    callCozeChat
  }
}
