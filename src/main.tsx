import { createRoot } from 'react-dom/client'
import './style.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/index'
import Login from './pages/login'
import About from './pages/about'
import { AuthProvider } from './contexts/AuthContext'
import SignUp from './pages/signup'

const App = (): JSX.Element => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />
    },
    {
      path: '/about',
      element: <About />
    },
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/sign-up',
      element: <SignUp />
    }
  ])

  return (
      <div className="bg-[#f5f5f5] py-0 px-[10%]">
        <RouterProvider router={router} />
      </div>
  )
}

createRoot(document.getElementById('app') as HTMLElement).render(
  <AuthProvider>
    <App />
  </AuthProvider>
)
