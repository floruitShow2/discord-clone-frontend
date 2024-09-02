import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Button,
  Radio,
  Message,
  Table,
  Select,
  Avatar,
  Spin,
  Form,
  Input
} from '@arco-design/web-react'
import type { ColumnProps } from '@arco-design/web-react/es/Table'
import type { LabeledValue, OptionInfo } from '@arco-design/web-react/es/Select/interface'
import { IconPlus } from '@arco-design/web-react/icon'
import { cs } from '@/utils/property'
import { CreateChannelStepEnum, CreateChannelTypeEnum } from './index.interface'
import type { CreateChannelInput, ChannelTemplate } from './index.interface'
import './index.less'

// 选择群聊模板
function TemplateRenderer(props: { onChange: (code: CreateChannelTypeEnum) => void }) {
  const { onChange } = props
  const availableTemplates: ChannelTemplate[] = [
    {
      name: '默认群组',
      code: CreateChannelTypeEnum.DEFAULT,
      description: '仅包含基础配置，可根据自己的实际需求添加功能模块',
      disabled: false
    },
    {
      name: '团队群组',
      code: CreateChannelTypeEnum.TEAM,
      description: '适用于团队协作和沟通，提供了团队成员管理、文件共享等功能',
      disabled: true
    },
    {
      name: '项目群组',
      code: CreateChannelTypeEnum.PROJECT,
      description: '专为项目管理和任务跟踪设计，支持任务分配、文档管理等',
      disabled: true
    }
  ]

  const [selectedTemplate, setSelectedTemplate] = useState<CreateChannelTypeEnum>()
  const handleUpdateTemplate = (item: ChannelTemplate) => {
    if (item.disabled) return
    setSelectedTemplate(item.code)
    onChange && onChange(item.code)
  }

  return (
    <>
      <h4
        className={cs(
          'w-full mb-3',
          'flex items-center justify-center',
          'text-xl',
          'text-primary-l'
        )}
      >
        创建新群聊
      </h4>
      <p className={cs('w-full mb-4 items-center justify-center', 'text-center', 'text-light-l')}>
        可以选择下列模式快速创建新的群聊
      </p>
      <ul className={cs('w-full h-[250px]', 'gap-x-4 flex items-center justify-between')}>
        {availableTemplates.map((item) => (
          <li
            className={cs(
              'h-full p-4',
              'flex-1 flex flex-col items-center justify-center',
              'border border-1 border-dashed border-heavy-b rounded-xl',
              'cursor-pointer transition-colors',
              'hover:border-blue-500',
              item.disabled ? 'opacity-50 cursor-not-allowed hover:border-heavy-b' : '',
              selectedTemplate === item.code ? 'border-blue-500' : ''
            )}
            key={item.code}
            onClick={() => handleUpdateTemplate(item)}
          >
            <h4 className="text-primary-l leading-9">{item.name}</h4>
            <p className={cs('h-10', 'text-light-l text-center')}>{item.description}</p>
            <Radio
              className="mt-3"
              checked={selectedTemplate === item.code}
              disabled={item.disabled}
            ></Radio>
          </li>
        ))}
      </ul>
    </>
  )
}

// 选择群聊成员
function MembersRenderer(props: { onChange: (ids: string[]) => void }) {
  const { onChange } = props

  const columns: ColumnProps<unknown>[] = [
    {
      title: '成员',
      dataIndex: 'username',
      key: 'username'
    },
    {
      title: '成员账号',
      dataIndex: 'userAccount',
      key: 'userAccount'
    },
    {
      title: '群组角色',
      dataIndex: 'userRole',
      key: 'userRole'
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      render: (_, record: any) => (
        <Button
          onClick={() => removeFinalIds(record.userAccount)}
          type="text"
          size="mini"
          status="danger"
        >
          删除
        </Button>
      )
    }
  ]

  const [options, setOptions] = useState([])
  const [fetching, setFetching] = useState(false)
  const refFetchId = useRef<number>()
  const debouncedFetchUser = useCallback(() => {
    refFetchId.current = Date.now()
    const fetchId = refFetchId.current
    setFetching(true)
    setOptions([])
    fetch('https://randomuser.me/api/?results=5')
      .then((response) => response.json())
      .then((body) => {
        if (refFetchId.current === fetchId) {
          const options = body.results.map((user: any) => ({
            label: (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar size={24} style={{ marginLeft: 6, marginRight: 12 }}>
                  <img alt="avatar" src={user.picture.thumbnail} />
                </Avatar>
                {`${user.name.first} ${user.name.last}`}
              </div>
            ),
            value: user.email
          }))
          setFetching(false)
          setOptions(options)
        }
      })
  }, [])

  const [selectIds, setSelectIds] = useState<Set<string>>(new Set())
  const handleSelect = (value: string | number | LabeledValue) => {
    setSelectIds((prev) => new Set([...prev, value.toString()]))
  }

  const [finalIds, setFinalIds] = useState<Set<string>>(new Set())
  const addFinalIds = () => {
    if (selectIds.size === 0) return

    setFinalIds((prev) => new Set([...prev, ...selectIds]))
    setSelectIds(new Set())
  }
  const removeFinalIds = (account: string) => {
    const result = [...finalIds].filter((id) => id !== account)
    setFinalIds(new Set(result))
    console.log(result)
    onChange && onChange(result)
  }

  const [finalUsers, setFinalUsers] = useState<any[]>([])
  useEffect(() => {
    setFinalUsers([
      ...Array.from(finalIds).map((id) => ({
        username: id,
        userAccount: id,
        userRole: 'MEMBER'
      }))
    ])
  }, [finalIds])

  return (
    <div className={cs('w-full h-full', 'gap-y-1 flex flex-col items-start justify-start')}>
      <h4 className="text-18 text-primary-l">群组成员</h4>
      <p className="text-14 text-light-l">创建者可添加群组成员、配置成员权限，当前已添加0个成员</p>
      <div className="w-full flex flex-col items-start justify-start gap-y-2">
        <div className="w-full flex flex-row items-center justify-between">
          <Select
            style={{ width: 345 }}
            showSearch
            mode="multiple"
            options={options}
            value={[...selectIds]}
            placeholder="请输入关键字搜索"
            filterOption={false}
            renderFormat={(option: any) => {
              return option.children.props.children[1]
            }}
            notFoundContent={
              fetching ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Spin style={{ margin: 12 }} />
                </div>
              ) : null
            }
            onSearch={debouncedFetchUser}
            onSelect={handleSelect}
          />

          <Button icon={<IconPlus />} onClick={addFinalIds}>
            添加
          </Button>
        </div>
        <Table
          className="w-full"
          columns={columns}
          data={finalUsers}
          pagination={false}
          rowKey={(record) => record.userAccount}
        ></Table>
      </div>
    </div>
  )
}

// 群聊信息填写
function FormRenderer() {
  const FormItem = Form.Item

  return (
    <div
      className={cs(
        'create-channel--form',
        'w-full h-full',
        'gap-y-1 flex flex-col items-start justify-start'
      )}
    >
      <Form className={cs('w-full h-full')} layout='vertical'>
        <div className='w-full flex flex-row items-start justify-start gap-x-2'>
          <FormItem className='!min-w-[300px] flex-1' label="群聊名称" field="username" rules={[{ required: true }]}>
            <Input placeholder="请输入" />
          </FormItem>
          <FormItem className='!min-w-[300px] flex-1' label="群聊号">
            <Input disabled />
          </FormItem>
        </div>
        <div className='w-full'>
          <FormItem className='w-full' label="群聊简介">
            <Input.TextArea className='w-full' rows={4} placeholder='请输入' />
          </FormItem>
        </div>
      </Form>
    </div>
  )
}

function CreateChannel() {
  const [createInput, setCreateInput] = useState<CreateChannelInput>({
    template: '',
    members: []
  })

  const [currentStep, setCurrentStep] = useState<CreateChannelStepEnum>(
    CreateChannelStepEnum.TEMPLATE
  )

  const updateCreateInput = (key: keyof CreateChannelInput, value: any) => {
    console.log(key, value)
    setCreateInput((prev) => ({ ...prev, [key]: value }))
  }

  const beforeTemplateSelect = () => {
    if (createInput.template) {
      setCurrentStep(CreateChannelStepEnum.MEMBERS)
      console.log('beforeTemplateSelect', createInput)
    } else {
      Message.warning('请选择模板')
    }
  }
  const beforeMemberSelect = () => {
    if (createInput.members.length > 0) {
      setCurrentStep(CreateChannelStepEnum.FORM)
      console.log('beforeMemberSelect', createInput)
    } else {
      Message.warning('请选择成员')
    }
  }
  const handleNextStep = () => {
    switch (currentStep) {
      case CreateChannelStepEnum.TEMPLATE:
        beforeTemplateSelect()
        break
      case CreateChannelStepEnum.MEMBERS:
        beforeMemberSelect()
        break
    }
  }

  const renderContent = (step: CreateChannelStepEnum) => {
    switch (step) {
      case CreateChannelStepEnum.TEMPLATE:
        return (
          <TemplateRenderer
            key={CreateChannelStepEnum.TEMPLATE}
            onChange={(val) => updateCreateInput('template', val)}
          />
        )
      case CreateChannelStepEnum.MEMBERS:
        return <MembersRenderer onChange={(val) => updateCreateInput('members', val)} />
      case CreateChannelStepEnum.FORM:
        return <FormRenderer />
      default:
        return <div>default</div>
    }
  }

  return (
    <div className={cs('w-full', 'flex flex-col items-center justify-start')}>
      <div className={cs('w-full h-[320px] mb-8')}>{renderContent(currentStep)}</div>
      <div className="w-full flex items-center justify-center">
        <Button
          type="primary"
          size="large"
          shape="round"
          className="w-[200px]"
          onClick={handleNextStep}
        >
          { currentStep === CreateChannelStepEnum.FORM ? '创建' : '下一步' }
        </Button>
      </div>
    </div>
  )
}

export default CreateChannel
