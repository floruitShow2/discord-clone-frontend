import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { Provider, useDispatch } from 'react-redux'
import { ConfigProvider } from '@arco-design/web-react'
import { store } from '@/store'
import { setUserInfo } from '@/store/slices/user.slice'
import { StorageIdEnum } from '@/constants/storage'
import { FetchUserInfo } from '@/api/auth'
import { useStorage } from '@/utils/storage'
import BaseLayout from '@/layouts/BaseLayout'
import Login from '@/pages/login'
import GeneralModal from '@/components/modals'
import useRoute, { getFlattenRoutes } from './routes'
import { MemberRole } from './gql/graphql'
import '@arco-design/web-react/dist/css/arco.css'
import './index.css'

const ProtectRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation()
  const navigate = useNavigate()

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
      navigate('/login')
    }
  }

  useEffect(() => {
    if (userToken) {
      fetchUserInfo()
    } else if (location.pathname.replace(/\//g, '').indexOf('login') === -1) {
      navigate(`/login?redirect=${location.pathname}`)
    }
  }, [])

  return userToken ? <>{children}</> : <Login />
}

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key!!')
}

const RouterComponent = () => {
  const { actionRoutes } = useRoute(MemberRole.Admin)

  return (
    <Provider store={store}>
      <ProtectRoute>
        <GeneralModal />
        <Routes>
          {getFlattenRoutes(actionRoutes).map((route) => {
            const { path, key, component: Component } = route
            return <Route key={key} path={path} Component={Component}></Route>
          })}
          <Route path="*" Component={BaseLayout}></Route>
        </Routes>
      </ProtectRoute>
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
