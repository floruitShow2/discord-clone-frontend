import { useRef, useState } from 'react'
import { Button } from '@arco-design/web-react'
import { CozeConversationStatusEnum } from '@/constants/coze.enum'
import { parseDataString } from '@/utils/coze'

function DashboardFile() {
  const [msg, setMsg] = useState('')
  const isReading = useRef(false)
  const testStream = async () => {
    const data = {
      bot_id: '7414888868773806118',
      user_id: '65b8b9326752f26ab0eb0f32',
      stream: true,
      additional_messages: [
        {
          role: 'user',
          content: '帮我规划一个三天的国庆旅游行程，目标城市北京',
          content_type: 'text'
        }
      ]
    }
    fetch('https://api.coze.cn/v3/chat', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer pat_WdSvHl87B0VA9NsDSB2xP75tPVpbgUa1RJRL7AjqySYBz5yJhA2HCzERLWDySewx`
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
                console.log(event)
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
                        break
                      default:
                        if (isReading.current) {
                          // console.log('data', parseDataString(item))
                          const message = parseDataString(item)
                          setMsg((prev) => prev + (message?.content || ''))
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

  return (
    <div className="w-full h-full flex flex-col items-start justify-start">
      <Button onClick={testStream}>调用 coze 接口</Button>
      <p>{msg}</p>
    </div>
  )
}

export default DashboardFile
