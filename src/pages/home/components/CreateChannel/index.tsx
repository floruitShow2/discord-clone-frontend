import { useCallback, useEffect, useState } from 'react'
import {
  Button,
  Radio,
  Message,
  Table,
  Select,
  Avatar,
  Spin,
  Form,
  Input,
  Upload
} from '@arco-design/web-react'
import type { ColumnProps } from '@arco-design/web-react/es/Table'
import type { LabeledValue } from '@arco-design/web-react/es/Select/interface'
import { IconEdit, IconPlus, IconShareExternal } from '@arco-design/web-react/icon'
import { UploadFile } from '@/api/file'
import { FetchUserByQuery } from '@/api/auth'
import { CreateRoom } from '@/api/chat-room'
import { ChatRoomTypeEnum } from '@/enum/chat-room.enum'
import { cs } from '@/utils/property'
import { isUndefined } from '@/utils/is'
import { CreateChannelStepEnum } from './index.interface'
import type { CreateChannelProps, ChannelTemplate } from './index.interface'
import './index.less'
import { UploadItem } from '@arco-design/web-react/es/Upload'

// 选择群聊模板
function TemplateRenderer(props: { onChange: (code: ChatRoomTypeEnum) => void }) {
  const { onChange } = props
  const availableTemplates: ChannelTemplate[] = [
    {
      name: '默认群组',
      code: ChatRoomTypeEnum.NORMAL,
      description: '仅包含基础配置，可根据自己的实际需求添加功能模块',
      disabled: false
    },
    {
      name: '团队群组',
      code: ChatRoomTypeEnum.GROUP,
      description: '适用于团队协作和沟通，提供了团队成员管理、文件共享等功能',
      disabled: true
    },
    {
      name: '项目群组',
      code: ChatRoomTypeEnum.PROJECT,
      description: '专为项目管理和任务跟踪设计，支持任务分配、文档管理等',
      disabled: true
    }
  ]

  const [selectedTemplate, setSelectedTemplate] = useState<ChatRoomTypeEnum>()
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
      title: '成员简介',
      dataIndex: 'introduction',
      key: 'introduction',
      width: 250
    },
    {
      title: '成员邮箱',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      render: (_, record: any) => (
        <Button
          onClick={() => removeFinalIds(record.userId)}
          type="text"
          size="mini"
          status="danger"
        >
          删除
        </Button>
      )
    }
  ]

  const [users, setUsers] = useState<User.UserEntity[]>([])
  const [options, setOptions] = useState<any[]>([])
  const [fetching, setFetching] = useState(false)
  const debouncedFetchUser = useCallback(async (query: string) => {
    setFetching(true)
    setOptions([])

    const { data } = await FetchUserByQuery(query)
    if (!data) {
      setOptions([])
    } else {
      setUsers((prev) => [...prev, ...data])
      setOptions(
        data.map((user) => ({
          label: (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Avatar size={24} style={{ marginLeft: 6, marginRight: 12 }}>
                <img alt="avatar" src={user.avatar} />
              </Avatar>
              {`${user.username}`}
            </div>
          ),
          value: user.userId
        }))
      )
    }
    setFetching(false)
  }, [])

  const [selectIds, setSelectIds] = useState<Set<string>>(new Set())
  const handleSelect = (value: string | number | LabeledValue) => {
    console.log(users)
    setSelectIds((prev) => new Set([...prev, value.toString()]))
  }

  const [finalIds, setFinalIds] = useState<Set<string>>(new Set())
  const addFinalIds = () => {
    if (selectIds.size === 0) return

    const result = [...new Set([...finalIds, ...selectIds])]
    setFinalIds(new Set(result))
    setSelectIds(new Set())
    onChange && onChange(result)
  }
  const removeFinalIds = (userId: string) => {
    const result = [...finalIds].filter((id) => id !== userId)
    setFinalIds(new Set(result))
    setUsers((prev) => prev.filter((user) => user.userId !== userId))
    onChange && onChange(result)
  }

  const [finalUsers, setFinalUsers] = useState<any[]>([])
  useEffect(() => {
    setFinalUsers(users.filter((user) => finalIds.has(user.userId)))
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
          rowKey={(record: User.UserEntity) => record.userId}
        ></Table>
      </div>
    </div>
  )
}

// 群聊信息填写
function FormRenderer(props: {
  room: Room.CreateRoomInput
  onChange: (value: Partial<Room.RoomEntity>) => void
}) {
  const FormItem = Form.Item

  const { room, onChange } = props

  const handleAvatarUpload = async (_files: UploadItem[], currentFile: UploadItem) => {
    if (!currentFile.originFile) return
    const fd = new FormData()
    fd.append('file', currentFile.originFile)

    const res = await UploadFile(fd)
    if (res && onChange) {
      onChange({ roomCover: res.data?.fileSrc })
    }
  }

  return (
    <div
      className={cs(
        'create-channel--form',
        'w-full h-full',
        'gap-y-1 flex flex-col items-start justify-start'
      )}
    >
      <Form
        className={cs('w-full h-full')}
        layout="vertical"
        onValuesChange={(_, values: Partial<Room.RoomEntity>) => {
          onChange && onChange(values)
        }}
      >
        <FormItem className="w-full" label="群聊封面">
          {room.roomCover ? (
            <Avatar
              className="!w-20 !h-20"
              size={72}
              triggerType="mask"
              triggerIcon={
                <Upload
                  accept=".jpg,.png,.jpeg"
                  autoUpload={false}
                  showUploadList={false}
                  onChange={handleAvatarUpload}
                >
                  <IconEdit />
                </Upload>
              }
            >
              <img src={room.roomCover} alt="" />
            </Avatar>
          ) : (
            <Upload
              accept=".jpg,.png,.jpeg"
              autoUpload={false}
              showUploadList={false}
              onChange={handleAvatarUpload}
            >
              <div className="w-20 h-20 flex items-center justify-center rounded-full text-primary-l bg-module transition-colors hover:text-heavy-l">
                <IconShareExternal fontSize={18} />
              </div>
            </Upload>
          )}
        </FormItem>
        <FormItem className="w-full" label="群聊名称" field="roomName" rules={[{ required: true }]}>
          <Input placeholder="请输入" />
        </FormItem>
        <FormItem className="w-full" label="群聊简介" field="roomDescription">
          <Input.TextArea
            className="w-full"
            autoSize={{ minRows: 4, maxRows: 4 }}
            placeholder="请输入"
          />
        </FormItem>
      </Form>
    </div>
  )
}

function CreateChannel(props: CreateChannelProps) {
  const { onSave } = props

  const [createInput, setCreateInput] = useState<Room.CreateRoomInput>({
    roomName: '',
    roomDescription: '',
    roomType: '',
    members: []
  })

  const [currentStep, setCurrentStep] = useState<CreateChannelStepEnum>(
    CreateChannelStepEnum.TEMPLATE
  )

  function updateCreateInput(value: any, key?: keyof Room.CreateRoomInput) {
    if (isUndefined(key)) {
      setCreateInput((prev) => ({ ...prev, ...value }))
    } else {
      setCreateInput((prev) => ({ ...prev, [key]: value }))
    }
  }

  const beforeTemplateSelect = () => {
    if (createInput.roomType) {
      setCurrentStep(CreateChannelStepEnum.MEMBERS)
      console.log('beforeTemplateSelect', createInput)
    } else {
      Message.warning('请选择模板')
    }
  }
  const beforeMemberSelect = () => {
    if (createInput.members?.length) {
      setCurrentStep(CreateChannelStepEnum.FORM)
      console.log('beforeMemberSelect', createInput)
    } else {
      Message.warning('请选择成员')
    }
  }

  const createChannel = async () => {
    console.log(createInput)
    try {
      const { data } = await CreateRoom(createInput)
      if (data) onSave && onSave()
    } catch (err) {
      console.log(err)
    }
  }

  const handleNextStep = async () => {
    switch (currentStep) {
      case CreateChannelStepEnum.TEMPLATE:
        beforeTemplateSelect()
        break
      case CreateChannelStepEnum.MEMBERS:
        beforeMemberSelect()
        break
      case CreateChannelStepEnum.FORM:
        await createChannel()
        break
    }
  }

  const renderContent = (step: CreateChannelStepEnum) => {
    switch (step) {
      case CreateChannelStepEnum.TEMPLATE:
        return (
          <TemplateRenderer
            key={CreateChannelStepEnum.TEMPLATE}
            onChange={(val) => updateCreateInput(val, 'roomType')}
          />
        )
      case CreateChannelStepEnum.MEMBERS:
        return <MembersRenderer onChange={(val) => updateCreateInput(val, 'members')} />
      case CreateChannelStepEnum.FORM:
        return <FormRenderer room={createInput} onChange={(val) => updateCreateInput(val)} />
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
          {currentStep === CreateChannelStepEnum.FORM ? '创建' : '下一步'}
        </Button>
      </div>
    </div>
  )
}

export default CreateChannel
