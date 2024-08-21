import { useContext, useState } from 'react'
import { Button, Form, Input, Message, Modal, Select } from '@arco-design/web-react'
import { IconSave, IconShareAlt } from '@arco-design/web-react/icon'
import { Viewer, Editor } from '@bytemd/react'
import 'bytemd/dist/index.css'
import { CreateQuestion } from '@/api/questions'
import { cs } from '@/utils/property'
import { compress } from '@/utils/file/compress'
import { copyText } from '@/utils/system/clipboard'
import { PlaygroundContext } from '../../playgroundContext'
import { QuestionPreviewProps } from './index.interface'
import './index.less'

const FormItem = Form.Item

function QuestionPreview(props: QuestionPreviewProps) {
  const { mode = 'viewer' } = props

  const { files } = useContext(PlaygroundContext)

  const [content, setContent] = useState('')
  const handleShare = async () => {
    if (!files) return
    const hash = compress(encodeURIComponent(JSON.stringify(files)))
    copyText({
      text: window.location.href + '#' + hash,
      onSuccess() {
        Message.success('分享链接复制成功')
      },
      onError() {
        Message.error('分享链接复制失败')
      }
    })
  }

  const [visible, setVisible] = useState(false)
  const [form] = Form.useForm()
  const [formState, setFormState] = useState<{ title: string; category?: Question.Category }>({
    title: '',
    category: undefined
  })
  const beforeSave = () => {
    if (!content) {
      Message.warning('请先填写问题内容')
      return
    } else if (!files.length) {
      Message.warning('请添加至少一份初始文件')
      return
    }
    setVisible(true)
  }
  const handleSave = async () => {
    try {
      const { data } = await CreateQuestion({
        content,
        files,
        ...formState
      })
      if (!data) return
      Message.success({
        content: '保存成功'
      })
      setVisible(false)
    } catch (err) {
      console.log(err)
    }
  }
  const handleValuesChange = (val: Partial<any>) => {
    setFormState((prev) => ({ ...prev, ...val }))
  }

  return (
    <div className="question-preview w-full h-full">
      <header
        className={cs(
          'w-full h-10 px-2',
          'flex items-center justify-between',
          'text-sm text-primary-l'
        )}
      >
        <h4 className="">侧边栏，预览题目【markdown】</h4>
        <div className="flex items-center justify-end">
          <Button size="small" type="text" icon={<IconSave />} onClick={beforeSave}></Button>
          <Button size="small" type="text" icon={<IconShareAlt />} onClick={handleShare}></Button>
        </div>
      </header>
      <section className="w-full" style={{ height: 'calc(100% - 2.5rem)' }}>
        {mode === 'editor' ? (
          <Editor value={content} onChange={setContent} />
        ) : (
          <Viewer value={content} />
        )}
      </section>

      <Modal
        title="创建题目"
        visible={visible}
        unmountOnExit
        onOk={handleSave}
        onCancel={() => setVisible(false)}
      >
        <Form form={form} onValuesChange={handleValuesChange}>
          <FormItem
            label="题目名称"
            field="title"
            rules={[{ required: true, message: '请输入题目名称' }]}
          >
            <Input placeholder="请输入" />
          </FormItem>
          <FormItem
            label="题目分类"
            field="category"
            rules={[{ required: true, message: '请选择题目分类' }]}
          >
            <Select options={['Vue', 'React', 'Javascript', 'Typescript']} placeholder="请选择" />
          </FormItem>
        </Form>
      </Modal>
    </div>
  )
}

export default QuestionPreview
