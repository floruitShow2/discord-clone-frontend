import { Button, Message } from '@arco-design/web-react'
import { useContext } from 'react'
import { IconShareAlt } from '@arco-design/web-react/icon'
import { cs } from '@/utils/property'
import { compress } from '@/utils/file/compress'
import { copyText } from '@/utils/system/clipboard'
import { PlaygroundContext } from '../../playgroundContext'

function QuestionPreview() {
  const { files } = useContext(PlaygroundContext)
  const handleShare = async () => {
    if (!files) return
    const hash = compress(encodeURIComponent(JSON.stringify(files)))
    copyText({ text: window.location.href + '#' + hash, onSuccess() {
        Message.success('分享链接复制成功')
    }, onError() {
        Message.error('分享链接复制失败')
    } })
  }

  return (
    <div className="w-full h-full">
      <header
        className={cs(
          'w-full h-10 px-2',
          'flex items-center justify-between',
          'text-sm text-primary-l'
        )}
      >
        <h4 className="">侧边栏，预览题目【markdown】</h4>
        <div className="flex items-center justify-end">
          <Button size="small" type="text" icon={<IconShareAlt />} onClick={handleShare}></Button>
        </div>
      </header>
      <section className="w-full" style={{ height: 'calc(100% - 2.5rem)' }}></section>
    </div>
  )
}

export default QuestionPreview
