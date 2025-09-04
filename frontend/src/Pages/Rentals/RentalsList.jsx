import React, { Suspense } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { m } from 'framer-motion'
import { Header, HeaderNav } from '../../Components/Header/Header'
import GoogleMap from '../../Components/GoogleMap/GoogleMap'
import InfoBannerStyle05 from '../../Components/InfoBanner/InfoBannerStyle05'
import Buttons from '../../Components/Button/Buttons'
import { useListings } from '../../api/useBnb'

const Footer = React.lazy(
  () => import('../../Components/Footers/Footer').then(module => ({ default: module.Footer }))
)

const RentalsList = () => {
  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useListings({}, 20)

  const items = (!isLoading && !isError && data?.pages)
    ? data.pages.flatMap(page => (page || []).map((x) => ({
        img: x.image || '/assets/img/webp/litho-landing-page-img-02.webp',
        title: x.title,
        packageprice: `${x.price} ${x.currency || 'KES'}`,
        days: x.location || '',
        reviews: `${x.reviews_count || 0} reviews`,
        link: `/rentals/${x.id}`,
        rating: x.rating || 0,
      })))
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
              <m.h1 className="heading-4 font-serif font-semibold" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Rentals</m.h1>
            </Col>
          </Row>
          <Row>
            <Col>
              {isLoading && (
                <div className="text-center py-20">
                  <div className="text-lg">Loading rentals...</div>
                </div>
              )}
              {isError && (
                <div className="text-center py-20">
                  <div className="text-red-500 text-lg mb-4">
                    {error?.message || 'Failed to load rentals'}
                  </div>
                  <div className="text-gray-600">
                    Please check if the backend server is running on port 8000
                  </div>
                </div>
              )}
              {!isLoading && !isError && (
                <InfoBannerStyle05 data={items} />
              )}
            </Col>
          </Row>
          <Row className="mt-10">
            <Col>
              <GoogleMap className="w-full h-[380px]" />
            </Col>
          </Row>
          {hasNextPage && (
            <Row className="mt-10">
              <Col className="text-center">
                <Buttons onClick={() => fetchNextPage()} disabled={isFetchingNextPage} className="btn-fancy btn-fill font-medium font-serif rounded-none uppercase" themeColor="#232323" color="#fff" title={isFetchingNextPage ? 'Loading...' : 'Load more'} />
              </Col>
            </Row>
          )}
        </Container>
      </section>

      <Suspense fallback={<div />}> 
        <Footer parallax={{ desktop: true, lg: false }} className="bg-[center_top] py-40 md:py-28" />
      </Suspense>
    </>
  )
}

export default RentalsList

