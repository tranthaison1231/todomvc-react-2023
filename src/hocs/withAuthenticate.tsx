import { type ComponentType, useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { Navigate } from 'react-router-dom'

const withAuthenticate = (Component: ComponentType) => {
  return () => {
    const { isAuthentication } = useContext(AuthContext)
    if (!isAuthentication) {
      return <Navigate to="/login" replace={true} />
    }
    return <Component />
  }
}

export default withAuthenticate
