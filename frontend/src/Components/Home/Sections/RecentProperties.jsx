import React from 'react'
import PortfolioClassic from '../../Portfolio/PortfolioClassic'
import { useQuery } from '@tanstack/react-query'
import { getRecentlyListed } from '../../../api/propertyService'

const MOCK_PROPERTIES = [
  { id: 201, title: '2BR Apartment, Kilimani', subtitle: 'Nairobi', img: '/assets/img/webp/litho-landing-page-img-02.webp', category: ['properties'], link: '/properties/201' },
  { id: 202, title: 'Townhouse, Runda', subtitle: 'Nairobi', img: '/assets/img/webp/litho-landing-page-img-02.webp', category: ['properties'], link: '/properties/202' },
  { id: 203, title: 'Beach Villa, Diani', subtitle: 'Kwale', img: '/assets/img/webp/litho-landing-page-img-02.webp', category: ['properties'], link: '/properties/203' },
]

export default function RecentProperties({ pageSize = 9 }) {
  const { data, isLoading } = useQuery({
    queryKey: ['properties', 'recent', pageSize],
    queryFn: () => getRecentlyListed({ page_size: pageSize }),
    staleTime: 5 * 60 * 1000,
  })
  const apiItems = Array.isArray(data?.items)
    ? data.items.map((p) => ({
        title: p.title,
        subtitle: p.location,
        img: p.image || '/assets/img/webp/litho-landing-page-img-02.webp',
        category: ['properties'],
        link: `/properties/${p.id}`,
      }))
    : []
  const items = apiItems.length > 0 ? apiItems : MOCK_PROPERTIES
  if (isLoading && apiItems.length === 0) return <div className="skeleton-loader" />
  return (
    <section className="py-[80px] bg-white md:py-[60px]">
      <div className="container">
        <h2 className="heading-4 font-serif font-semibold mb-8">Recently listed properties</h2>
        <PortfolioClassic grid="grid grid-3col lg-grid-2col xs-grid-1col" data={items} />
      </div>
    </section>
  )
}




















