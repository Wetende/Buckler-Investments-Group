import React from 'react'
import { Container } from 'react-bootstrap'

const PageTitle = ({ title = '', subtitle = '', bg = '' }) => {
  return (
    <section
      className="py-[120px] lg:py-[90px] md:py-[75px] sm:py-[60px] relative bg-cover bg-center"
      style={bg ? { backgroundImage: `url(${bg})` } : undefined}
    >
      {bg && <div className="absolute top-0 left-0 w-full h-full opacity-60 bg-[#000]" />}
      <Container className="relative">
        <div className="text-center text-white">
          {title && (
            <h1 className="font-serif font-semibold text-[34px] leading-tight mb-2">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-lg opacity-90">
              {subtitle}
            </p>
          )}
        </div>
      </Container>
    </section>
  )
}

export default PageTitle


