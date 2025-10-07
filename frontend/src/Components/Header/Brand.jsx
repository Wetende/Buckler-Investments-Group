import React from 'react'
import { Navbar } from 'react-bootstrap'

// Import logo images
import logoImage from '../../Assets/img/logo.png'
import logoImageAlt from '../../Assets/img/logo1.png'

const Brand = ({
  className = '',
  variant = 'primary', // 'primary', 'transparent'
  size = 'default', // 'small', 'default', 'large'
  theme = 'light', // 'light', 'dark'
  showText = false, // fallback to text if images fail
  text = 'BUCKLER',
}) => {
  // Determine which logo to use based on theme and variant
  const getLogoSrc = () => {
    if (theme === 'dark' || variant === 'transparent') {
      return logoImageAlt; // logo1.png for dark/transparent themes
    }
    return logoImage; // logo.png for light themes
  };

  // Get appropriate size classes
  const getSizeClass = () => {
    switch(size) {
      case 'small': return 'h-8 w-auto';
      case 'large': return 'h-12 w-auto';
      default: return 'h-10 w-auto';
    }
  };

  return (
    <Navbar.Brand className={`inline-block p-0 m-0 ${className}`}>
      {/* Image-based logo (preferred) */}
      <img
        src={getLogoSrc()}
        alt="Buckler Investment Group"
        className={`${getSizeClass()} ${showText ? 'hidden md:block' : ''}`}
        onError={(e) => {
          // Fallback to text if image fails to load
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'block';
        }}
      />

      {/* Text fallback */}
      <span
        className={`font-serif font-semibold text-[18px] md:text-[16px] tracking-[-.2px] whitespace-nowrap text-darkgray ${!showText ? 'hidden' : ''}`}
        style={{ display: showText ? 'block' : 'none' }}
      >
        {text}
      </span>
    </Navbar.Brand>
  )
}

export default Brand


