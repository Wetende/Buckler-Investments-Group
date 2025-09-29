import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import InfoBannerWithBadges from '../InfoBanner/InfoBannerWithBadges'
import MessageBox from '../MessageBox/MessageBox'
import { useToursList } from '../../api/useTours'

const CuratedCollection = ({ title, subtitle, filters = {}, limit = 8 }) => {
  const { data, isLoading, isError } = useToursList({ ...filters, limit })
  const items = Array.isArray(data)
    ? data.map(tour => ({
        img: tour.image || 'https://via.placeholder.com/525x431',
        packageprice: tour.price ? `From ${tour.price} ${tour.currency || 'KES'}` : 'From KES 25,000',
        days: tour.duration || (tour.duration_hours ? `${tour.duration_hours} hrs` : 'Full Day'),
        title: tour.title || tour.name || 'Kenya Adventure',
        reviews: tour.reviews_count ? `${tour.reviews_count} Reviews` : '0 Reviews',
        link: `/tours/${tour.id}`,
        rating: tour.rating || 4.5,
        isTopRated: (tour.rating || 4.5) >= 4.7,
      }))
    : []

  return (
    <section className="py-[80px] border-b border-mediumgray bg-white">
      <Container>
        <Row className="mb-8 items-center">
          <Col lg={8}>
            <h3 className="heading-5 font-serif font-semibold text-darkgray uppercase mb-[5px] -tracking-[1px]">{title}</h3>
            {subtitle && <p className="m-0 block">{subtitle}</p>}
          </Col>
        </Row>
        {isLoading ? (
          <div className="text-center py-8 text-sm text-gray-600">Loading…</div>
        ) : isError ? (
          <MessageBox theme="message-box01" variant="error" message={`Failed to load ${title.toLowerCase()}.`} />
        ) : (
          <InfoBannerWithBadges
            className="swiper-navigation-04 swiper-navigation-light black-move p-0"
            carouselOption={{
              slidesPerView: 1,
              spaceBetween: 30,
              loop: false,
              autoplay: false,
              breakpoints: { 1200: { slidesPerView: 4 }, 992: { slidesPerView: 3 }, 768: { slidesPerView: 2 } },
            }}
            data={items}
          />
        )}
      </Container>
    </section>
  )
}

export default CuratedCollection
