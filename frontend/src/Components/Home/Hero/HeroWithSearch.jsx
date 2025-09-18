import React, { Suspense, lazy } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Keyboard, Navigation } from 'swiper/modules'

const UnifiedSearch = lazy(() => import('../../Search/UnifiedSearch'))

const slides = [
  { img: 'https://via.placeholder.com/1920x1080', title: 'Discover Kenya' },
  { img: 'https://via.placeholder.com/1920x1080', title: 'Explore Tanzania' },
  { img: 'https://via.placeholder.com/1920x1080', title: 'Experience Zanzibar' },
]

export default function HeroWithSearch() {
  return (
    <div className="bg-white">
      <section className="overflow-hidden full-screen md:h-[650px] sm:h-[500px]">
        <Swiper
          className="white-move swiper-pagination-light swiper-pagination-medium h-full relative swiper-navigation-04 swiper-navigation-dark"
          slidesPerView={1}
          loop
          keyboard
          navigation
          modules={[Pagination, Autoplay, Keyboard, Navigation]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 4500, disableOnInteraction: false }}
        >
          {slides.map((item, i) => (
            <SwiperSlide key={i} style={{ backgroundImage: `url(${item.img})` }} className="bg-no-repeat bg-cover bg-center">
              <Container className="h-full text-center justify-center xs:p-0">
                <Row className="h-full w-[70%] my-0 mx-auto">
                  <Col className="h-full justify-center flex-col relative flex xs:p-0">
                    <h1 className="mb-[45px] text-shadow-large font-extrabold text-white text-[84px] tracking-[-3px] leading-[88px] font-serif uppercase mx-auto lg:text-[72px] md:text-[54px] md:leading-[58px] sm:text-[40px] sm:mb-[30px] xs:w-full xs:leading-none">
                      {item.title}
                    </h1>
                  </Col>
                </Row>
              </Container>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      <section className="-mt-[90px] relative z-[5]">
        <Container>
          <Row className="justify-center">
            <Col lg={10} className="bg-white rounded-md shadow-[0_6px_24px_rgba(0,0,0,0.08)] p-6">
              <Suspense fallback={<div />}> <UnifiedSearch /> </Suspense>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  )
}



