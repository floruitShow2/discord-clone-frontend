import { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from '@arco-design/web-react'
import type { RootState } from '@/store'
import useRoute, { getFlattenRoutes } from '@/routes'
import { changeTheme } from '@/utils/settings'
import { MemberRole } from '@/gql/graphql'
import NaviHeader from '@/components/naviHeader'
import NaviSidebar from '@/components/naviSiderbar'

function BaseLayout() {
  const Sider = Layout.Sider
  const Header = Layout.Header
  const Content = Layout.Content

  const { theme } = useSelector((state: RootState) => state.settings)

  useEffect(() => {
    changeTheme(theme)
  }, [theme])

  const { routes, defaultRoute } = useRoute(MemberRole.Admin)
  const flattenRoutes = useMemo(() => getFlattenRoutes(routes), [routes])

  return (
    <div className="w-[100vw] h-[100vh] flex flex-col items-start justify-start">
      <Header className="w-full h-16">
        <NaviHeader />
      </Header>
      <Layout className='w-full'>
        <Sider defaultCollapsed={true}>
          <NaviSidebar />
        </Sider>
        <Content style={{ width: 'calc(100% - 48px)' }}>
          {/* <Outlet></Outlet> */}
          <Routes>
            <Route path="/" element={<Navigate to={defaultRoute} />}></Route>
            {flattenRoutes.map((route) => {
              const { path, key, component: Component } = route
              return <Route key={key} path={`/${path}`} Component={Component}></Route>
            })}
          </Routes>
        </Content>
      </Layout>
    </div>
  )
}

export default BaseLayout
