import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCurrentUser, logout } from '../../api/authService'
import { getRefreshToken } from '../../api/axios'
import LoginModal from '../Auth/LoginModal'
import RegisterModal from '../Auth/RegisterModal'

const AuthButtons = ({ className = '', style = {} }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const refreshToken = getRefreshToken()
        if (refreshToken) {
          const userData = await getCurrentUser()
          setUser(userData)
          setIsAuthenticated(true)
        }
      } catch (error) {
        setIsAuthenticated(false)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      setIsAuthenticated(false)
      setUser(null)
      window.location.href = '/'
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  if (loading) {
    return (
      <div className={`header-auth-buttons inline-block align-middle pl-[17px] ${className}`} style={style}>
        <span className="text-sm text-gray-500">Loading...</span>
      </div>
    )
  }

  if (isAuthenticated) {
    return (
      <div className={`header-auth-buttons inline-block align-middle pl-[17px] ${className}`} style={style}>
        <div className="flex items-center space-x-3">
          <Link 
            to="/account" 
            className="text-sm font-serif hover:text-basecolor transition-colors"
            aria-label="My Account"
          >
            Account
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm font-serif hover:text-basecolor transition-colors"
            aria-label="Logout"
          >
            Logout
          </button>
        </div>
      </div>
    )
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
