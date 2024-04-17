import React from 'react'
import ReactDOM from 'react-dom/client'
import { Routes, Route, useNavigate, BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from '@/store'
import { ConfigProvider } from '@arco-design/web-react'
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react'
import BaseLayout from '@/layouts/BaseLayout'
import HomePage from '@/pages/home/index.tsx'
import '@arco-design/web-react/dist/css/arco.css'
import './index.css'

const ProtectRoute = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SignedIn>{children}</SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  )
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
        <Routes>
          <Route path="" element={<BaseLayout />}>
            <Route
              index
              element={
                <ProtectRoute>
                  <HomePage />
                </ProtectRoute>
              }
            ></Route>
          </Route>
        </Routes>
      </ClerkProvider>
    </Provider>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ConfigProvider>
    <BrowserRouter>
      <RouterComponent />
    </BrowserRouter>
  </ConfigProvider>
)

export default RouterComponent