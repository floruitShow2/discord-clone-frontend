import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { useNavigate, BrowserRouter } from 'react-router-dom'
import { Provider, useDispatch } from 'react-redux'
import { ConfigProvider } from '@arco-design/web-react'
import { ClerkProvider } from '@clerk/clerk-react'
import { store } from '@/store'
import { setUserInfo } from '@/store/slices/user.slice'
import { StorageIdEnum } from '@/constants/storage'
import { FetchUserInfo } from '@/api/auth'
import { useStorage } from '@/utils/storage'
import BaseLayout from '@/layouts/BaseLayout'
import Login from '@/pages/login'
import GeneralModal from '@/components/modals'
import '@arco-design/web-react/dist/css/arco.css'
import './index.css'

const ProtectRoute = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch()

  const { genKey, get } = useStorage()

  const tokenKey = genKey(StorageIdEnum.USER_TOKEN)
  const userToken = get(tokenKey)

  const fetchUserInfo = async () => {
    try {
      const { data } = await FetchUserInfo()
      dispatch(setUserInfo(data))
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (userToken) {
      fetchUserInfo()
    } else if (window.location.pathname.replace(/\//g, '') !== 'login') {
      window.location.pathname = '/login'
    }
  }, [])

  return userToken ? <>{children}</> : <Login />
}

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key!!')
}

const RouterComponent = () => {
  const navigate = useNavigate()

  return (
    <Provider store={store}>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} navigate={(to) => navigate(to)}>
        <ProtectRoute>
          <GeneralModal />
          <BaseLayout />
        </ProtectRoute>
      </ClerkProvider>
    </Provider>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ConfigProvider>
    {/* <ApolloProvider client={client}> */}
    <BrowserRouter>
      <RouterComponent />
    </BrowserRouter>
    {/* </ApolloProvider> */}
  </ConfigProvider>
)

export default RouterComponent
