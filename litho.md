Status update: I reviewed the available Litho pages under `frontend/src` and mapped the best-fitting combinations to our MVP needs (rentals, tours, properties, cars, investment, blog, and marketing), referencing concrete files/sections to reuse.

### Recommended page composition (best-fit from Litho)

- Homepage (composed)
  - Hero + travel focus + CTAs: `Pages/Home/TravelAgency.jsx` ✅
  - Unified search bar (custom): embed into hero area; reuse input styles from `Pages/Elements/*` and `Components/Form/*` ✅
  - Featured tours: section from `Pages/Home/TravelAgency.jsx` ✅
  - Featured rentals (accommodations grid): `Pages/Home/HotelResort.jsx` ✅
  - Recently listed properties: use portfolio/product-style grids from `Pages/Portfolios/*` (e.g., `PortfolioClassicThreeColumn`) or architecture look from `Pages/Home/Architecture.jsx` ✅
  - Car rentals highlight: repurpose `Pages/Shop/ShopWide.jsx` cards for vehicles ✅
  - Investment spotlight (stats/CTA): `Pages/Home/Finance.jsx` + `Components/partials/charts/*` and `Components/PricingTable/*` ✅
  - Testimonials: `Components/Testimonials/*` or `Components/TestimonialCarousel/*` ✅
  - Blog preview: `Pages/Blogs/BlogGrid.jsx` or `Pages/Home/Magazine.jsx` ✅
  - Newsletter/subscribe: `Pages/Elements/Subscribe.jsx` + `Components/Form/*` ✅
  - Header/Footer: `Pages/Header/TransparentHeaderPage.jsx` + `Pages/Footer/FooterStyle0XPage.jsx` ✅

- Rentals (BnB)
  - Listing (grid + filters + map): base from `Pages/Home/HotelResort.jsx` and `Components/InfoBanner/*`, enrich with filters from `Pages/Elements/*` and map from `Components/GoogleMap/GoogleMap.jsx` ✅
  - Detail: image gallery `Components/ImageGallery/*`, tabs/accordion `Pages/Elements/Tab.jsx` / `Accordion.jsx`, pricing block from `Components/PricingTable/*`, location `GoogleMap.jsx` ✅
  - Booking modal: `Pages/ModalPopup/*` with forms from `Components/Form/*` ✅

- Tours
  - Listing: `Pages/Home/TravelAgency.jsx` sections and cards; category chips from `Pages/Elements/Lists.jsx` or `InfoBanner/*` ✅
  - Detail: itinerary using `Pages/Elements/Accordion.jsx`, availability calendar (custom), gallery `Components/ImageGallery/*`, pricing `Components/PricingTable/*` ✅

- Properties
  - Listing: portfolio grids from `Pages/Portfolios/*` (e.g., `PortfolioClassicThreeColumn`, `PortfolioBoxedThreeColumn`) with property meta ✅
  - Detail: reuse `Pages/Portfolios/SingleProjectPage0X.jsx` layout patterns for media + specs + location ✅

- Cars
  - Listing: `Pages/Shop/ShopWide.jsx` for card grid + basic filters ✅
  - Detail: `Pages/Shop/SingleProduct.jsx` adapted to vehicle specs, gallery, pricing; checkout flow stubs tie into booking/inquiry modal ✅

- Investment (catalog + education)
  - Landing blocks: `Pages/Home/Finance.jsx` for stats/graphs ✅
  - Pricing/products: `Pages/AdditionalPages/PricingPackagesPage.jsx` ✅
  - Charts: `Components/partials/charts/*` ✅
  - Use these as promotional sections on home and a dedicated “Invest” page ✅

- Blog/Content
  - Index: `Pages/Blogs/BlogGrid.jsx` or `BlogMasonry.jsx` ✅
  - Post: `Pages/Blogs/LayoutPage/*` (e.g., `BlogPostLayout01.jsx`) ✅

- Shared UI
  - Page titles/hero variants: `Pages/PageTitle/*` (pick center/left or big-typography based on section) ✅
  - Forms: `Components/Form/*` ✅
  - Banners/CTAs: `Components/InfoBanner/*` ✅
  - Carousels: `Components/TestimonialCarousel/*`, `Components/ImageGallery/*` ✅
  - Icons/overlines: `Components/OverlineIconBox/*`, `CustomIconWithText/*` ✅

### Why these choices align with MVP
- TravelAgency + HotelResort directly match tours and rentals visuals.
- Portfolio and Architecture patterns present properties cleanly.
- Shop pages give us a ready “card + detail + checkout” pattern suitable for cars.
- Finance provides the investment narrative (KPIs, pricing, charts).
- Elements library covers forms, tabs, accordions, and CTAs needed across flows.

### Navigation skeleton (routes we’ll implement)
- `/` home (composed from the above sections) ✅
- `/rentals`, `/rentals/:id` ✅
- `/tours`, `/tours/:id` ✅
- `/properties`, `/properties/:id` ✅
- `/cars`, `/cars/:id` ✅
- `/invest` ✅
- `/blogs`, `/blogs/:slug` ✅
- `/login`, `/register`, `/account` ✅

### Notes for integration
- Wire all list/detail views to endpoints defined in `frontend.md` (BnB/Tours/Property/Cars/Search/Auth).
- Replace demo data with live API via React Query; keep the Litho components but inject data/props from API.
- Keep consistent page titles using `Pages/PageTitle/*` per section for SEO and hierarchy.

