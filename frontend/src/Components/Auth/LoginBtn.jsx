import React, { useState } from 'react'

const LoginBtn = () => {
  const [hover, setHover] = useState(false)

  const style = {
    padding: '6px 12px',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: '#000',
    borderRadius: '4px',
    backgroundColor: hover ? '#000' : '#fff',
    color: hover ? '#fff' : '#000',
    fontFamily: 'inherit',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 150ms ease-in-out',
  }

  return (
    <button
      style={style}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label="Open login modal"
    >
      Login
    </button>
  )
}

export default LoginBtn


