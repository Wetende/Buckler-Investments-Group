import React from 'react'
import ShopWide from '../../Products/ShopWide'
import { useVehiclesSearch } from '../../../api/useCars'

const MOCK_CARS = [
  { id: 301, title: 'Toyota Land Cruiser', price: 'KES 12,000 / day', img: '/assets/img/webp/litho-landing-page-img-02.webp', hoverImg: '/assets/img/webp/litho-landing-page-img-02.webp', category: ['cars'] },
  { id: 302, title: 'Subaru Forester', price: 'KES 8,000 / day', img: '/assets/img/webp/litho-landing-page-img-02.webp', hoverImg: '/assets/img/webp/litho-landing-page-img-02.webp', category: ['cars'] },
  { id: 303, title: 'Mercedes C-Class', price: 'KES 15,000 / day', img: '/assets/img/webp/litho-landing-page-img-02.webp', hoverImg: '/assets/img/webp/litho-landing-page-img-02.webp', category: ['cars'] },
]

export default function CarsHighlight({ limit = 8 }) {
  const { data, isLoading } = useVehiclesSearch({ limit })
  const apiItems = Array.isArray(data)
    ? data.map((x) => ({
        title: x.title,
        price: `${x.price} ${x.currency || 'KES'}`,
        img: x.image || '/assets/img/webp/litho-landing-page-img-02.webp',
        hoverImg: x.image || '/assets/img/webp/litho-landing-page-img-02.webp',
        category: ['cars'],
      }))
    : []
  const items = apiItems.length > 0 ? apiItems : MOCK_CARS
  if (isLoading && apiItems.length === 0) return <div className="skeleton-loader" />
  return (
    <section className="py-[80px] bg-white md:py-[60px]">
      <div className="container">
        <h2 className="heading-4 font-serif font-semibold mb-8">Cars for rent</h2>
        <ShopWide grid="grid grid-3col lg-grid-2col xs-grid-1col" data={items} />
      </div>
    </section>
  )
}


