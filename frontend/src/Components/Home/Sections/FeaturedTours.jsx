import React from 'react'
import InfoBannerStyle05 from '../../InfoBanner/InfoBannerStyle05'
import { useFeaturedTours } from '../../../api/useTours'

const MOCK_TOURS = [
  { id: 1, img: '/assets/img/webp/litho-landing-page-img-02.webp', title: 'Nairobi City Highlights', packageprice: 'KES 25,000', days: '2 days', reviews: '12 reviews', rating: 4.5, link: '/tours/1' },
  { id: 2, img: '/assets/img/webp/litho-landing-page-img-02.webp', title: 'Masai Mara Safari', packageprice: 'KES 85,000', days: '3 days', reviews: '48 reviews', rating: 5, link: '/tours/2' },
  { id: 3, img: '/assets/img/webp/litho-landing-page-img-02.webp', title: 'Diani Beach Escape', packageprice: 'KES 60,000', days: '4 days', reviews: '22 reviews', rating: 4.7, link: '/tours/3' },
  { id: 4, img: '/assets/img/webp/litho-landing-page-img-02.webp', title: 'Amboseli Adventure', packageprice: 'KES 70,000', days: '3 days', reviews: '16 reviews', rating: 4.6, link: '/tours/4' },
  { id: 5, img: '/assets/img/webp/litho-landing-page-img-02.webp', title: 'Mount Kenya Trek', packageprice: 'KES 120,000', days: '5 days', reviews: '9 reviews', rating: 4.3, link: '/tours/5' },
  { id: 6, img: '/assets/img/webp/litho-landing-page-img-02.webp', title: 'Tsavo East Discovery', packageprice: 'KES 55,000', days: '2 days', reviews: '18 reviews', rating: 4.2, link: '/tours/6' },
  { id: 7, img: '/assets/img/webp/litho-landing-page-img-02.webp', title: 'Lake Naivasha Getaway', packageprice: 'KES 35,000', days: '2 days', reviews: '25 reviews', rating: 4.1, link: '/tours/7' },
  { id: 8, img: '/assets/img/webp/litho-landing-page-img-02.webp', title: 'Samburu Culture Tour', packageprice: 'KES 48,000', days: '2 days', reviews: '14 reviews', rating: 4.4, link: '/tours/8' },
]

export default function FeaturedTours({ limit = 8 }) {
  const { data, isLoading, isError } = useFeaturedTours(limit)

  // Map API data if available
  const apiItems = Array.isArray(data)
    ? data.map((x) => ({
        img: x.image || '/assets/img/webp/litho-landing-page-img-02.webp',
        title: x.title,
        packageprice: `${x.price} ${x.currency || 'KES'}`,
        days: x.duration || '',
        reviews: `${x.reviews_count || 0} reviews`,
        link: `/tours/${x.id}`,
        rating: x.rating || 0,
      }))
    : []

  // Fallback to mock when API fails or returns empty
  const items = apiItems.length > 0 ? apiItems : MOCK_TOURS

  // While loading first paint, still show skeleton; afterwards, mock covers errors
  if (isLoading && apiItems.length === 0) return <div className="skeleton-loader" />

  return (
    <section className="py-[80px] bg-white md:py-[60px]">
      <div className="container">
        <h2 className="heading-4 font-serif font-semibold mb-8">Featured tours</h2>
        <InfoBannerStyle05 data={items} />
      </div>
    </section>
  )
}


