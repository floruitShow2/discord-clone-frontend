import { Button } from '@arco-design/web-react'
import { useCoze } from '@/hooks/actions/useCoze'
import ImageCropper from '@/components/imageCropper'

function DashboardFile() {
  const { answer, callCozeChat } = useCoze()

  const onClick = async () => {
    const data = {
      conversationId: 'some-conversation-id',
      question: '简单介绍下 flutter 这个技术'
    }
    callCozeChat(data.conversationId, data.question)
  }

  return (
    <div className="w-full h-full flex flex-col items-start justify-start">
      <Button onClick={onClick}>调用 coze 接口</Button>
      <p>{answer}</p>

      <ImageCropper url='http://127.0.0.1:3000/static/avatar/avatar_2.png' />
    </div>
  )
}

export default DashboardFile
