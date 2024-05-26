import LoginBanner from './components/LoginBanner'
import LoginPanel from './components/LoginPanel'

function Login() {
  return (
    <div className="w-[100vw] h-[100vh] px-10 py-20 flex items-center justify-center bg-[#c6d1e6]">
      <div className="w-full h-full bg-primary flex items-center justify-center rounded-lg overflow-hidden">
        <LoginBanner className="w-1/2 h-full" />
        <LoginPanel />
      </div>
    </div>
  )
}

export default Login
