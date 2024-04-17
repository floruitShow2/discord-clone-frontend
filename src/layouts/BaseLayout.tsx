import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Layout } from '@arco-design/web-react'
import NaviHeader from '@/components/naviHeader'
import NaviSidebar from '@/components/naviSiderbar'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import { changeTheme } from '@/utils/settings'

function BaseLayout() {

  const Sider = Layout.Sider;
  const Header = Layout.Header;
  const Content = Layout.Content;

  const { theme } = useSelector((state: RootState) => state.settings)

  useEffect(() => {
    changeTheme(theme)
  }, [theme])

  return (
    <Layout className="h-full">
        <Header className="h-16">
          <NaviHeader />
        </Header>
        <Layout>
          <Sider defaultCollapsed={true}>
            <NaviSidebar />
          </Sider>
          <Content>
            <Outlet></Outlet>
          </Content>
        </Layout>
      </Layout>
  )
}

export default BaseLayout
