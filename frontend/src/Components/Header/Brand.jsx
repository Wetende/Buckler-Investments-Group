import React from 'react'
import { Navbar } from 'react-bootstrap'

const Brand = ({
  className = '',
  defaultClass = 'text-darkgray',
  altClass = 'text-darkgray',
  mobileClass = 'text-darkgray',
  text = 'Buckler Investment Group',
}) => {
  return (
    <Navbar.Brand className={`inline-block p-0 m-0 ${className}`}>
      <span className={`default-logo font-serif font-semibold text-[18px] md:text-[16px] tracking-[-.2px] whitespace-nowrap ${defaultClass}`}>{text}</span>
      <span className={`alt-logo font-serif font-semibold text-[18px] md:text-[16px] tracking-[-.2px] whitespace-nowrap ${altClass}`}>{text}</span>
      <span className={`mobile-logo font-serif font-semibold text-[18px] md:text-[16px] tracking-[-.2px] whitespace-nowrap ${mobileClass}`}>{text}</span>
    </Navbar.Brand>
  )
}

export default Brand


