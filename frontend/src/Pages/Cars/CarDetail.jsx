import React, { Suspense } from 'react'
import { useParams } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'
import { m } from 'framer-motion'
import { Header, HeaderNav } from '../../Components/Header/Header'
import ImageGallery from '../../Components/ImageGallery/ImageGallery'

const Footer = React.lazy(
  () => import('../../Components/Footers/Footer').then(module => ({ default: module.Footer }))
)

// Placeholder detail page until car detail endpoint is available
const CarDetail = () => {
  const { id } = useParams()
  const gallery = []

  return (
    <>
      <Header topSpace={{ md: true }} className="absolute w-full top-0 z-[15]">
        <HeaderNav theme="light" fluid="fluid" expand="lg" className="h-[120px] items-center md:h-[80px] xs:h-auto px-[50px] md:px-0 md:py-[15px]" />
      </Header>

      <section className="py-[130px] lg:py-[90px] md:py-[75px] sm:py-[50px]">
        <Container>
          <Row className="mb-10">
            <Col>
              <m.h1 className="heading-4 font-serif font-semibold" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Vehicle #{id}</m.h1>
              <div className="text-[#777]">Vehicle detail coming soon.</div>
            </Col>
          </Row>
          {gallery.length > 0 && (
            <Row className="mb-10">
              <ImageGallery theme="image-gallery-01" data={gallery} grid="grid grid-3col md-grid-2col xs-grid-1col" />
            </Row>
          )}
          <Row>
            <Col lg={8}>
              <p className="text-[#777] leading-7">Specs and booking flow will be added.</p>
            </Col>
            <Col lg={4}>
              <div className="p-6 bg-white shadow-md">
                <div className="font-serif font-semibold text-lg mb-2">Price</div>
                <div className="text-xl">—</div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <Suspense fallback={<div />}> 
        <Footer parallax={{ desktop: true, lg: false }} className="bg-[center_top] py-40 md:py-28" />
      </Suspense>
    </>
  )
}

export default CarDetail


