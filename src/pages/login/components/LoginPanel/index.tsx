import { useRef, useState } from 'react'
import { Form, Input, Button } from '@arco-design/web-react'
import type { FormInstance } from '@arco-design/web-react'
import { Login } from '@/api/auth'
import { useStorage } from '@/utils/storage'
import { StorageIdEnum } from '@/constants/storage'
import './index.less'
import { useLocation } from 'react-router-dom'

const FormItem = Form.Item

function LoginPanel() {
  const { search } = useLocation()

  const { genKey, set } = useStorage()
  const tokenKey = genKey(StorageIdEnum.USER_TOKEN)

  const formRef = useRef<FormInstance>(null)
  const [loginInfo, setLoginInfo] = useState<User.LoginInput>({ username: '', password: '' })

  const handleLogin = async (info: User.LoginInput) => {
    try {
      const { data } = await Login(info)
      if (!data) return
      set(tokenKey, data.accessToken)
      const queryParams = new URLSearchParams(location.search)
      // setLoginInfo({ username: '', password: '' })
      alert(queryParams.get('redirect'))
      location.pathname = queryParams.get('redirect') ?? '/'
    } catch (err) {
      console.log(err)
    }
  }

  const handleSubmit = () => {
    formRef.current?.validate().then((values) => {
      handleLogin(values)
    })
  }

  return (
    <div className="w-1/2 h-full flex flex-col items-center justify-center">
      <div className="w-[45%] mb-5 flex items-center justify-center">
        <svg viewBox="0 0 230 60">
          <defs>
            <linearGradient id="myGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#adbfe1" />
              <stop offset="100%" stopColor="#d7e8ff" />
            </linearGradient>
          </defs>
          <path
            d="M24.01-20.6L17.18-20.6 17.18 0 12.03 0 12.03-20.6 5.15-20.6 5.15 0 0 0 0-22.31Q0-25.75 3.43-25.75L3.43-25.75 25.75-25.75Q29.18-25.75 29.18-22.31L29.18-22.31 29.18 0 24.03 0 24.01-20.6ZM49.78-18.88L49.78-18.88Q53.21-18.88 53.21-15.45L53.21-15.45 53.21-10.3Q53.21-6.87 49.78-6.87L49.78-6.87 39.48-6.87 39.48-12.01 48.06-12.01 48.06-13.73 37.76-13.73 37.76-5.15 49.76-5.15 48.08 0 36.04 0Q32.61 0 32.61-3.43L32.61-3.43 32.61-15.45Q32.61-18.88 36.04-18.88L36.04-18.88 49.78-18.88ZM61.79 0L56.64 0 56.64-25.75 61.79-25.75 61.79 0ZM82.39-18.88L82.39-18.88Q85.82-18.88 85.82-15.45L85.82-15.45 85.82-10.3Q85.82-6.87 82.39-6.87L82.39-6.87 72.09-6.87 72.09-12.01 80.67-12.01 80.67-13.73 70.37-13.73 70.37-5.15 82.37-5.15 80.69 0 68.66 0Q65.22 0 65.22-3.43L65.22-3.43 65.22-15.45Q65.22-18.88 68.66-18.88L68.66-18.88 82.39-18.88ZM109.85-15.45L109.85-3.43Q109.85 0 106.42 0L106.42 0 92.69 0Q89.25 0 89.25-3.43L89.25-3.43 89.25-15.45Q89.25-18.88 92.69-18.88L92.69-18.88 106.42-18.88Q109.85-18.88 109.85-15.45L109.85-15.45ZM104.7-13.73L94.4-13.73 94.4-5.15 104.7-5.15 104.7-13.73ZM118.43 0L113.28 0 113.28-15.45Q113.28-18.88 116.72-18.88L116.72-18.88 130.46-18.88Q133.9-18.88 133.9-15.45L133.9-15.45 133.9 0 128.75 0 128.73-13.73 118.43-13.73 118.43 0ZM166.49-25.75L164.78-20.6 154.48-20.6 154.48-5.15 166.49-5.15 166.49 0 152.76 0Q149.33 0 149.33-3.43L149.33-3.43 149.33-22.31Q149.33-25.75 152.76-25.75L152.76-25.75 166.49-25.75ZM175.07 0L169.93 0 169.93-25.75 175.07-25.75 175.07-18.88 187.09-18.88Q190.52-18.88 190.52-15.45L190.52-15.45 190.52 0 185.37 0 185.37-13.73 175.07-13.73 175.07 0ZM193.96-3.43L193.96-15.45Q193.96-18.88 197.39-18.88L197.39-18.88 211.12-18.88Q214.55-18.88 214.55-15.45L214.55-15.45 214.55 0 209.4 0 209.39-13.73 199.1-13.73 199.1-5.15 207.69-5.15 205.97 0 197.41 0Q193.96 0 193.96-3.43L193.96-3.43ZM217.99-22.31L223.13-22.31 223.13-18.88 226.57-18.88 224.85-13.75 223.13-13.75 223.13-5.15 226.57-5.15 226.57 0 221.42 0Q217.99 0 217.99-3.43L217.99-3.43 217.99-22.31Z"
            transform="translate(0, 38.75)"
            fill="url(#myGradient)"
          ></path>
        </svg>
      </div>
      <div className="login-panel--form w-full flex flex-col items-center justify-center">
        <Form
          ref={formRef}
          className="w-[50%] mb-8 flex flex-col items-start justify-center"
          autoComplete="off"
          layout="vertical"
          initialValues={loginInfo}
        >
          <FormItem label="Username" field="username" rules={[{ required: true }]}>
            <Input placeholder="please enter your username" />
          </FormItem>
          <FormItem label="Password" field="password" rules={[{ required: true }]}>
            <Input type="password" placeholder="please enter your password" />
          </FormItem>
        </Form>
        <div className="w-[50%]">
          <Button className="w-full" type="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </div>
    </div>
  )
}

export default LoginPanel
