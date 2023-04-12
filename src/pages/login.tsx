import { useState } from 'react'
import Input from '../components/Input'
import { useNavigate } from 'react-router-dom'
import { login } from '../api/login'

interface Props {
  onSuccess: () => void
}

const Login = ({ onSuccess }: Props): JSX.Element => {
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const onSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const formData = new FormData(event.target as HTMLFormElement)
    const { username, password } = Object.fromEntries(formData)
    const isAuth = login(username as string, password as string)
    if (isAuth) {
      navigate('/')
      onSuccess()
      localStorage.setItem('isAuthentication', 'true')
    } else {
      setError('Username or password is incorrect')
    }
  }

  return (
    <div className="h-screen flex justify-center items-center flex-col">
      <form className="flex flex-col" onSubmit={onSubmit}>
        <label htmlFor="username" className="mb-6">
          <span className="mr-6">Username</span>
          <Input id="username" name="username" />
        </label>
        <label htmlFor="password">
          <span className="mr-6">Password</span>
          <Input id="password" type="password" name="password" />
        </label>
        <button className="mt-6 p-2 bg-red-700">Login</button>
      </form>
      {error && <div className="text-red-700">{error}</div>}
    </div>
  )
}

export default Login
