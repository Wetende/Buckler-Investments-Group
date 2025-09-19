import React from 'react'
import { useAuth } from '../../api/useAuth'
import LoginModal from '../Auth/LoginModal'
import RegisterModal from '../Auth/RegisterModal'
import ProfileDropdown from '../Auth/ProfileDropdown'

const AuthButtons = ({ className = '', style = {} }) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className={`header-auth-buttons inline-block align-middle pl-[17px] ${className}`} style={style}>
        <span className="text-sm text-gray-500">Loading...</span>
      </div>
    )
  }

  if (isAuthenticated) {
    return <ProfileDropdown className={className} style={style} />
  }

  return (
    <div className={`header-auth-buttons inline-block align-middle pl-[17px] ${className}`} style={style}>
      <div className="flex items-center space-x-3">
        <LoginModal />
        <RegisterModal />
      </div>
    </div>
  )
}

export default AuthButtons
