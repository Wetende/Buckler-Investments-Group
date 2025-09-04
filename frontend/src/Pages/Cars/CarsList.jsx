import React, { Suspense } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { m } from 'framer-motion'
import { Header, HeaderNav } from '../../Components/Header/Header'
import ShopWide from '../../Components/Products/ShopWide'
import { useVehiclesSearch } from '../../api/useCars'

const Footer = React.lazy(
  () => import('../../Components/Footers/Footer').then(module => ({ default: module.Footer }))
)

const CarsList = () => {
  const { data, isLoading, isError, error } = useVehiclesSearch({})

  const items = (!isLoading && !isError && data)
    ? data.map((x) => ({
        title: x.title,
        price: `${x.price} ${x.currency || 'KES'}`,
        img: x.image || '/assets/img/webp/litho-landing-page-img-02.webp',
        hoverImg: x.image || '/assets/img/webp/litho-landing-page-img-02.webp',
        category: ['cars'],
      }))
    : []

  return (
    <>
      <Header topSpace={{ md: true }} className="absolute w-full top-0 z-[15]">
        <HeaderNav theme="light" fluid="fluid" expand="lg" className="h-[120px] items-center md:h-[80px] xs:h-auto px-[50px] md:px-0 md:py-[15px]" />
      </Header>

      <section className="py-[130px] lg:py-[90px] md:py-[75px] sm:py-[50px]">
        <Container>
          <Row className="mb-10">
            <Col>
              <m.h1 className="heading-4 font-serif font-semibold" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Cars</m.h1>
            </Col>
          </Row>
          <Row>
            <Col>
              {isLoading && (
                <div className="text-center py-20">
                  <div className="text-lg">Loading cars...</div>
                </div>
              )}
              {isError && (
                <div className="text-center py-20">
                  <div className="text-red-500 text-lg mb-4">
                    {error?.message || 'Failed to load cars'}
                  </div>
                  <div className="text-gray-600">
                    Please check if the backend server is running on port 8000
                  </div>
                </div>
              )}
              {!isLoading && !isError && (
                <ShopWide grid="grid grid-3col lg-grid-2col xs-grid-1col" data={items} />
              )}
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

export default CarsList

