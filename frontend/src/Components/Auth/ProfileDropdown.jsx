import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../api/useAuth'

const ProfileDropdown = ({ className = '', style = {} }) => {
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className={`profile-dropdown dropdown mr-[10px] inline-block align-middle pl-[17px] text-[17px] relative${className ? ` ${className}` : ""}`} style={style}>
      <button
        type="button"
        className="bg-transparent border-none p-0 cursor-pointer relative"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <i className="feather-user text-[17px]"></i>
        {user?.username && (
          <span className="profile-indicator font-serif bg-basecolor text-white absolute top-[20px] right-[-10px] w-[16px] h-[16px] text-center text-[9px] leading-[16px] rounded-full">
            •
          </span>
        )}
      </button>
      <ul id="profileDropdown" className="dropdown-menu block profile-menu !left-auto !right-0 !transform !translate-x-0 min-w-[240px]">
        <li className="profile-item border-b border-[#ededed]">
          <Link
            aria-label="dashboard-link"
            className="profile-link flex items-center p-[15px] text-[13px] text-[#333] hover:text-basecolor"
            to="/dashboard/"
          >
            <i className="feather-grid text-[14px] mr-[8px]"></i>
            Dashboard
          </Link>
        </li>
        <li className="profile-item border-b border-[#ededed] p-[15px]">
          <div className="flex items-center">
            <div className="profile-avatar w-[40px] h-[40px] bg-[#f8f8f8] rounded-full flex items-center justify-center mr-[10px]">
              <i className="feather-user text-[16px] text-[#666]"></i>
            </div>
            <div className="profile-info">
              <span className="profile-name font-serif font-medium text-[14px] text-[#333] block">
                {user?.username || 'User'}
              </span>
              <span className="profile-email text-[12px] text-[#777]">
                {user?.email || ''}
              </span>
            </div>
          </div>
        </li>
        <li className="profile-item border-b border-[#ededed]">
          <Link
            aria-label="profile-link"
            className="profile-link flex items-center p-[15px] text-[13px] text-[#333] hover:text-basecolor"
            to="/account"
          >
            <i className="feather-settings text-[14px] mr-[8px]"></i>
            Account Settings
          </Link>
        </li>
        <li className="profile-item border-b border-[#ededed]">
          <Link
            aria-label="bookings-link"
            className="profile-link flex items-center p-[15px] text-[13px] text-[#333] hover:text-basecolor"
            to="/account/bookings"
          >
            <i className="feather-calendar text-[14px] mr-[8px]"></i>
            My Bookings
          </Link>
        </li>
        <li className="profile-item border-b border-[#ededed]">
          <Link
            aria-label="favorites-link"
            className="profile-link flex items-center p-[15px] text-[13px] text-[333] hover:text-basecolor"
            to="/account/favorites"
          >
            <i className="feather-heart text-[14px] mr-[8px]"></i>
            Favorites
          </Link>
        </li>
        <li className="profile-item">
          <button
            onClick={handleLogout}
            className="profile-link flex items-center p-[15px] text-[13px] text-[#333] hover:text-red-500 w-full text-left bg-transparent border-none cursor-pointer"
          >
            <i className="feather-log-out text-[14px] mr-[8px]"></i>
            Logout
          </button>
        </li>
      </ul>
    </div>
  )
}

export default ProfileDropdown
