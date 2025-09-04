import React, { Suspense } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { Header, HeaderNav } from '../../Components/Header/Header'

const Finance = React.lazy(() => import('../Home/Finance'))
const PricingPackagesPage = React.lazy(() => import('../AdditionalPages/PricingPackagesPage'))
const Footer = React.lazy(
  () => import('../../Components/Footers/Footer').then(module => ({ default: module.Footer }))
)

const Invest = () => {
  return (
    <>
      <Header topSpace={{ md: true }} className="absolute w-full top-0 z-[15]">
        <HeaderNav theme="light" fluid="fluid" expand="lg" className="h-[120px] items-center md:h-[80px] xs:h-auto px-[50px] md:px-0 md:py-[15px]" />
      </Header>

      <Suspense fallback={<div />}> 
        <Finance />
        <section className="py-[60px]" />
        <Container>
          <Row>
            <Col>
              <PricingPackagesPage />
            </Col>
          </Row>
        </Container>
        <Footer parallax={{ desktop: true, lg: false }} className="bg-[center_top] py-40 md:py-28" />
      </Suspense>
    </>
  )
}

export default Invest


