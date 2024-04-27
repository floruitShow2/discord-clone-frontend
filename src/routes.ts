import { useEffect, useMemo, useState, lazy } from 'react'
import { MemberRole } from '@/gql/graphql'

interface Meta {
  role?: MemberRole
  ignored?: boolean
}

export type IRoute = {
  path: string
  key: string
  component?: any
  meta?: Meta
  children?: IRoute[]
}

export const routes: IRoute[] = [
  {
    path: '/dashboard',
    key: 'dashboard',
    children: [
      {
        path: '/dashboard/home',
        key: 'dashboard/home',
        component: lazy(() => import('@/pages/home/index.tsx'))
      },
      {
        path: '/dashboard/interview',
        key: 'dashboard/interview',
        component: lazy(() => import('@/pages/interview/index.tsx'))
      }
    ]
  }
]

/**
 * @description 判断当前用户是否有指定路由的访问权限
 * @param route 路由
 * @param userPermission 用户角色
 */
const judge = (route: IRoute, userPermission?: MemberRole): boolean => {
  if (!userPermission) return false
  if (userPermission === MemberRole.Admin) return true

  if (route.meta && route.meta.role) {
    return route.meta.role === userPermission
  } else {
    return true
  }
}

const useRoute = (userPermission?: MemberRole): [IRoute[], string] => {
  const filterRoutes = (routes: IRoute[], arr: IRoute[] = []): IRoute[] => {
    if (!routes.length) return []

    for (const route of routes) {
      let visible: boolean = judge(route, userPermission)

      if (!visible) continue

      if (route.children && route.children.length) {
        const newRoute: IRoute = { ...route, children: [] }
        filterRoutes(route.children, newRoute.children)

        if (newRoute.children?.length) {
          arr.push(newRoute)
        }
      } else {
        arr.push({ ...route })
      }
    }

    return arr
  }

  const [permissionRoutes, setPermissionRoutes] = useState(routes)
  useEffect(() => {
    const newRoutes = filterRoutes(routes)
    setPermissionRoutes(newRoutes)
  }, [userPermission])

  const defaultRoute = useMemo(() => {
    const firstRoute = permissionRoutes[0]

    if (firstRoute) {
      return firstRoute.children?.[0].key || firstRoute.key
    }

    return ''
  }, [permissionRoutes])

  return [permissionRoutes, defaultRoute]
}

export default useRoute
