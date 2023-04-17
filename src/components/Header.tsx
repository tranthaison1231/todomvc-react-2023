import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'

const Header = (): JSX.Element => {
  const { isAuthentication, onLogout } = useContext(AuthContext)
  return <div>{isAuthentication && <button onClick={onLogout}> Logout </button>}</div>
}

export default Header
