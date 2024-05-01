import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from '@arco-design/web-react'
import { useAuth, useSession } from '@clerk/clerk-react'
import { useMutation } from '@apollo/client'
import type { RootState } from '@/store'
import { setUserInfo } from '@/store/slices/user.slice'
import useRoute, { IRoute } from '@/routes'
import { isArray } from '@/utils/is'
import { changeTheme } from '@/utils/settings'
import { CREATE_PROFILE } from '@/graphql/mutations/profile'
import { MemberRole, Mutation, MutationCreateProfileArgs } from '@/gql/graphql'
import NaviHeader from '@/components/naviHeader'
import NaviSidebar from '@/components/naviSiderbar'

function getFlattenRoutes(routes: IRoute[]) {
  const res: IRoute[] = []
  function travel(_routes: IRoute[]) {
    _routes.forEach((route) => {
      const visibleChildren = (route.children || []).filter((child) => !child.meta?.ignored)
      if (route.key && (!route.children || !visibleChildren.length)) {
        try {
          res.push(route)
        } catch (e) {
          console.log(route.key)
          console.error(e)
        }
      }

      if (isArray(route.children) && route.children?.length) {
        travel(route.children)
      }
    })
  }
  travel(routes)
  return res
}

function BaseLayout() {
  const Sider = Layout.Sider
  const Header = Layout.Header
  const Content = Layout.Content

  const { theme } = useSelector((state: RootState) => state.settings)
  const { userInfo } = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch()

  useEffect(() => {
    changeTheme(theme)
  }, [theme])

  const { isSignedIn } = useAuth()
  const { session } = useSession()
  const [createProfile] = useMutation<Mutation, MutationCreateProfileArgs>(CREATE_PROFILE, {})
  const createProfileFn = async () => {
    if (!session?.user) return
    try {
      await createProfile({
        variables: {
          profile: {
            name: session?.user.fullName || '',
            email: session.user.emailAddresses[0].emailAddress,
            imageUrl: session?.user.imageUrl
          }
        },
        onCompleted: (data) => {
          dispatch(setUserInfo(data.createProfile))
        }
      })
    } catch (err) {
      console.log(`Error occurred when creating profile in backend`, err)
    }
  }

  const [routes, defaultRoute] = useRoute(MemberRole.Admin)
  const flattenRoutes = useMemo(() => getFlattenRoutes(routes), [routes])

  useEffect(() => {
    if (!isSignedIn) dispatch(setUserInfo(null))
  }, [isSignedIn])
  useEffect(() => {
    if (userInfo?.id) return
    createProfileFn()
  }, [session?.user])

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
    </Layout>
  )
}

export default BaseLayout
