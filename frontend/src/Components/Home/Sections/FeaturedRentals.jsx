import React from 'react'
import InfoBannerStyle05 from '../../InfoBanner/InfoBannerStyle05'
import { useFeaturedListings } from '../../../api/useBnb'

const MOCK_RENTALS = [
  { id: 101, img: '/assets/img/webp/litho-landing-page-img-02.webp', title: 'Beachfront Apartment', packageprice: 'KES 12,000 / night', days: 'Mombasa', reviews: '32 reviews', rating: 4.6, link: '/bnb/101' },
  { id: 102, img: '/assets/img/webp/litho-landing-page-img-02.webp', title: 'Nairobi CBD Loft', packageprice: 'KES 9,500 / night', days: 'Nairobi', reviews: '21 reviews', rating: 4.3, link: '/bnb/102' },
  { id: 103, img: '/assets/img/webp/litho-landing-page-img-02.webp', title: 'Amboseli Lodge', packageprice: 'KES 15,000 / night', days: 'Amboseli', reviews: '18 reviews', rating: 4.7, link: '/bnb/103' },
  { id: 104, img: '/assets/img/webp/litho-landing-page-img-02.webp', title: 'Naivasha Cottage', packageprice: 'KES 8,500 / night', days: 'Naivasha', reviews: '27 reviews', rating: 4.2, link: '/bnb/104' },
]

export default function FeaturedRentals({ limit = 8 }) {
  const { data, isLoading } = useFeaturedListings(limit)
  const apiItems = Array.isArray(data)
    ? data.map((x) => ({
        img: x.image || '/assets/img/webp/litho-landing-page-img-02.webp',
        title: x.title,
        packageprice: `${x.price} ${x.currency || 'KES'}`,
        days: x.location || '',
        reviews: `${x.reviews_count || 0} reviews`,
        link: `/bnb/${x.id}`,
        rating: x.rating || 0,
      }))
    : []
  const items = apiItems.length > 0 ? apiItems : MOCK_RENTALS
  if (isLoading && apiItems.length === 0) return <div className="skeleton-loader" />
  return (
    <section className="py-[80px] bg-white md:py-[60px]">
      <div className="container">
        <h2 className="heading-4 font-serif font-semibold mb-8">Featured rentals</h2>
        <InfoBannerStyle05 data={items} />
      </div>
    </section>
  )
}



