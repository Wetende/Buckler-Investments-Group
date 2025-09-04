## Composed Homepage Plan

Goal: Build a performant, Litho-styled, data-driven homepage by composing existing sections. Deliver incrementally in phases with safe fallbacks, proper routing, accessibility, and API wiring.

### Entrypoint and File Map (authoritative)
- Route target: `/`
- Entrypoint component: `frontend/src/Pages/Home/Home.jsx`
- Section wrappers to create (small composition-only components):
  - `frontend/src/Components/Home/Hero/HeroWithSearch.jsx`
  - `frontend/src/Components/Home/Sections/FeaturedTours.jsx`
  - `frontend/src/Components/Home/Sections/FeaturedRentals.jsx`
  - `frontend/src/Components/Home/Sections/RecentProperties.jsx`
  - `frontend/src/Components/Home/Sections/CarsHighlight.jsx`
  - `frontend/src/Components/Home/Sections/InvestmentSpotlight.jsx`
  - `frontend/src/Components/Home/Sections/TestimonialsBlock.jsx`
  - `frontend/src/Components/Home/Sections/BlogPreview.jsx`
  - `frontend/src/Components/Home/Sections/Subscribe.jsx`

Imports each wrapper will reuse internally (verified paths):
- Header/Footer: `Components/Header/Header`, `Components/Footers/Footer`
- Tours/Rentals cards: `Components/InfoBanner/InfoBannerStyle05`
- Properties grid: `Components/Portfolio/PortfolioClassic`
- Cars grid: `Components/Products/ShopWide`
- Charts/KPIs: `Pages/Home/Finance.jsx` + `Components/partials/charts/*`

### Home.jsx (entrypoint skeleton)
Create `frontend/src/Pages/Home/Home.jsx` with:

```jsx
// frontend/src/Pages/Home/Home.jsx
import React, { lazy, Suspense } from 'react'
import { Header, HeaderNav } from '../../Components/Header/Header'
const Footer = lazy(() => import('../../Components/Footers/Footer').then(m => ({ default: m.Footer })))

// Section wrappers (to be created in Components/Home/*)
const HeroWithSearch = lazy(() => import('../../Components/Home/Hero/HeroWithSearch'))
const FeaturedTours = lazy(() => import('../../Components/Home/Sections/FeaturedTours'))
const FeaturedRentals = lazy(() => import('../../Components/Home/Sections/FeaturedRentals'))
const RecentProperties = lazy(() => import('../../Components/Home/Sections/RecentProperties'))
const CarsHighlight = lazy(() => import('../../Components/Home/Sections/CarsHighlight'))
const InvestmentSpotlight = lazy(() => import('../../Components/Home/Sections/InvestmentSpotlight'))
const TestimonialsBlock = lazy(() => import('../../Components/Home/Sections/TestimonialsBlock'))
const BlogPreview = lazy(() => import('../../Components/Home/Sections/BlogPreview'))
const Subscribe = lazy(() => import('../../Components/Home/Sections/Subscribe'))

export default function Home() {
  return (
    <>
      <Header topSpace={{ md: true }} className="absolute w-full top-0 z-[15]">
        <HeaderNav theme="light" fluid="fluid" expand="lg" className="h-[120px] items-center md:h-[80px] xs:h-auto px-[50px] md:px-0 md:py-[15px]" />
      </Header>

      <main>
        <Suspense fallback={<div className="skeleton-loader" />}> <HeroWithSearch /> </Suspense>
        <Suspense fallback={<div className="skeleton-loader" />}> <FeaturedTours /> </Suspense>
        <Suspense fallback={<div className="skeleton-loader" />}> <FeaturedRentals /> </Suspense>
        <Suspense fallback={<div className="skeleton-loader" />}> <RecentProperties /> </Suspense>
        <Suspense fallback={<div className="skeleton-loader" />}> <CarsHighlight /> </Suspense>
        <Suspense fallback={<div className="skeleton-loader" />}> <InvestmentSpotlight /> </Suspense>
        <Suspense fallback={<div className="skeleton-loader" />}> <TestimonialsBlock /> </Suspense>
        <Suspense fallback={<div className="skeleton-loader" />}> <BlogPreview /> </Suspense>
        <Suspense fallback={<div className="skeleton-loader" />}> <Subscribe /> </Suspense>
      </main>

      <Suspense fallback={<div />}> <Footer parallax={{ desktop: true, lg: false }} /> </Suspense>
    </>
  )
}
```

### Wrapper component examples (stubs)
Implement wrappers under `Components/Home/*` to keep the page clean and to encapsulate Litho reuse.

```jsx
// frontend/src/Components/Home/Sections/FeaturedTours.jsx
import React from 'react'
import InfoBannerStyle05 from '../../InfoBanner/InfoBannerStyle05'
import { useTours } from '../../../api/useTours'

export default function FeaturedTours({ limit = 8 }) {
  const { data, isLoading, isError, error } = useTours({ limit }, 20)
  if (isLoading) return <div className="skeleton-loader" />
  if (isError) return <div className="text-center text-red-500">{error?.message || 'Failed to load tours'}</div>
  const items = (data?.pages || []).flatMap(p => (p || []).map(x => ({
    img: x.image || '/assets/img/webp/litho-landing-page-img-02.webp',
    title: x.title,
    packageprice: `${x.price} ${x.currency || 'KES'}`,
    days: x.duration || '',
    reviews: `${x.reviews_count || 0} reviews`,
    link: `/tours/${x.id}`,
    rating: x.rating || 0,
  })))
  return <InfoBannerStyle05 data={items} />
}
```

```jsx
// frontend/src/Components/Home/Sections/RecentProperties.jsx
import React from 'react'
import PortfolioClassic from '../../Portfolio/PortfolioClassic'
import { useQuery } from '@tanstack/react-query'
import { getRecentlyListed } from '../../../api/propertyService'

export default function RecentProperties({ pageSize = 9 }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['properties', 'recent', pageSize],
    queryFn: () => getRecentlyListed({ page_size: pageSize }),
    staleTime: 5 * 60 * 1000,
  })
  if (isLoading) return <div className="skeleton-loader" />
  if (isError) return <div className="text-center text-red-500">{error?.message || 'Failed to load properties'}</div>
  const dataItems = (data?.items || []).map(p => ({
    title: p.title,
    subtitle: p.location,
    img: p.image || '/assets/img/webp/litho-landing-page-img-02.webp',
    category: ['properties'],
    link: `/properties/${p.id}`,
  }))
  return <PortfolioClassic grid="grid grid-3col lg-grid-2col xs-grid-1col" data={dataItems} />
}
```

```jsx
// frontend/src/Components/Home/Sections/CarsHighlight.jsx
import React from 'react'
import ShopWide from '../../Products/ShopWide'
import { useVehiclesSearch } from '../../../api/useCars'

export default function CarsHighlight({ limit = 8 }) {
  // For now we can show an empty criteria to render a placeholder; later pass featured criteria
  const { data, isLoading, isError, error } = useVehiclesSearch({ limit })
  if (isLoading) return <div className="skeleton-loader" />
  if (isError) return <div className="text-center text-red-500">{error?.message || 'Failed to load cars'}</div>
  const items = (data || []).map(x => ({
    title: x.title,
    price: `${x.price} ${x.currency || 'KES'}`,
    img: x.image || '/assets/img/webp/litho-landing-page-img-02.webp',
    hoverImg: x.image || '/assets/img/webp/litho-landing-page-img-02.webp',
    category: ['cars'],
  }))
  return <ShopWide grid="grid grid-3col lg-grid-2col xs-grid-1col" data={items} />
}
```

Note: Use the same error-handling pattern as our list pages—preserve section layout and render inline messages.

### Routing change (when implementing Phase 0)
In `frontend/src/App.js`, set `/` to load the composed homepage:

```jsx
import React, { Suspense, lazy } from 'react'
// ...
const ComposedHome = lazy(() => import('./Pages/Home/ComposedHome'))

// Inside <Routes>
<Route path="/" element={<Suspense fallback={<div className="skeleton-loader" />}><ComposedHome /></Suspense>} />
```

### Phase 0 — Foundations (Setup)
- Create `Pages/Home/ComposedHome.jsx` entry component and route `/` → ComposedHome
- Reuse global `Header` and `Footer` components
- Ensure CSS imports and Tailwind base are present
- Add React Query providers (already configured) and define API hooks stubs if missing
- Add error boundary wrapper for homepage

### Phase 1 — Hero + Unified Search
- Import hero from `Pages/Home/TravelAgency.jsx` (extract as `Components/Hero/HeroSlider` wrapper if needed)
- Embed unified search bar in hero using `Components/Form/*`
  - Inputs: destination (free text), dates (range), guests (number), category tabs (rentals/tours/properties/cars)
  - Validation with minimal schema; no backend dependency yet
- Wire submit to navigate to domain list route with query params (no API yet)
- Accessibility: labeled inputs, keyboard navigation, focus management on open modals

### Phase 2 — Featured Tours
- Reuse tours cards section from `Pages/Home/TravelAgency.jsx`
- Add containerized hook `useFeaturedTours(limit = 8)` using `toursService.getFeaturedTours`
- Loading: skeleton placeholders; Error: inline error message while keeping section visible
- CTA: View all → `/tours`

### Phase 3 — Featured Rentals
- Reuse accommodations block from `Pages/Home/HotelResort.jsx`
- Hook: `useFeaturedRentals({ limit: 8 })` calling `bnbService.listListings`
- Same loading/error patterns as Tours
- CTA: View all → `/rentals`

### Phase 4 — Recently Listed Properties
- Use portfolio grid from `Pages/Portfolios/PortfolioClassicThreeColumn.jsx` via light wrapper component
- Hook: `useRecentProperties({ page_size: 9 })` → `propertyService.getRecentlyListed`
- Card props: title, location, price, image, link `/properties/:id`
- Loading skeletons; graceful empty state

### Phase 5 — Cars Highlight
- Repurpose `Pages/Shop/ShopWide.jsx` card style via `Components/Products/ShopWide` with a minimal wrapper
- Hook: `useFeaturedVehicles({ limit: 8 })` → `carsService.listVehicles`
- CTA: View all → `/cars`

### Phase 6 — Investment Spotlight
- Import KPI blocks/charts from `Pages/Home/Finance.jsx` and `Components/partials/charts/*`
- Show 3–4 KPIs + mini area chart (static data first, then API)
- CTA section linking to `/invest`

### Phase 7 — Testimonials + Blog Preview
- Testimonials: `Components/Testimonials/*` or `Components/TestimonialsCarousel/*`
- Blog preview: pull 3–6 posts via `BlogGrid` style layout
- Hooks: `useFeaturedPosts(limit=6)` (service stub for now)

### Phase 8 — Newsletter / Subscribe
- Reuse `Pages/Elements/Subscribe.jsx` + `Components/Form/*`
- Hook up to existing mail endpoint (if available) or local no-op with success toast

### Phase 9 — Performance, A11y, and Polish
- Code-split large sections (React.lazy + Suspense per section)
- Memoize presentational components (React.memo); stabilize callbacks with useCallback
- Defer non-critical images with `loading="lazy"`
- ARIA: ensure landmarks (banner, main, contentinfo), labeled controls, focus states
- SEO: proper headings order, unique titles/meta (via react-helmet if used)

### Phase 10 — Data Wiring (Progressive Enhancement)
- Replace mock hooks with real services progressively:
  - Tours: `toursService.getFeaturedTours`
  - Rentals: `bnbService.listListings`
  - Properties: `propertyService.getRecentlyListed`
  - Cars: `carsService.listVehicles`
- React Query settings per section:
  - `staleTime: 5m`, `gcTime: 10m`
  - `retry`: disable on 4xx
  - Keep skeletons on refetch for smoother UX

### Phase 11 — Observability & QA
- Dev-only console logging of API errors; user-friendly messages on UI
- Smoke tests: ensure each section renders with loading, error, and data states
- Verify CLS/LCP basics with Lighthouse

---

## Deliverables per Phase
- Section wrapper component under `Components/Home/*` where reuse is broad; inline within `Pages/Home/ComposedHome.jsx` where specific
- Hook(s) under `frontend/src/api` for each data source
- Route and navigation updates where needed

## Implementation Notes
- Follow RORO props; keep components presentational; lift data fetching to container/hooks
- Keep early returns for fatal errors only; preserve section layout on errors
- Prefer composition over editing Litho internals; wrap and pass props
- IDs remain integers; URLs match `/properties`, `/rentals`, `/tours`, `/cars`, `/invest`

## Rollout Order
1) Phases 0–2 (base + hero + tours)
2) Phases 3–4 (rentals + properties)
3) Phases 5–6 (cars + investment)
4) Phases 7–8 (testimonials + subscribe)
5) Phases 9–11 (perf, data wiring, QA)


