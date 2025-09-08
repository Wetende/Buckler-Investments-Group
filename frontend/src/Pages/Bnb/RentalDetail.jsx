import React, { Suspense } from 'react'
import { useParams } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'
import { m } from 'framer-motion'
import { Header, HeaderNav } from '../../Components/Header/Header'
import ImageGallery from '../../Components/ImageGallery/ImageGallery'
import Buttons from '../../Components/Button/Buttons'
import CustomModal from '../../Components/CustomModal'
import { useAvailability, useCreateBooking, useListing } from '../../api/useBnb'

const Footer = React.lazy(
  () => import('../../Components/Footers/Footer').then(module => ({ default: module.Footer }))
)

const RentalDetail = () => {
  const { id } = useParams()
  const { data, isLoading, isError, error } = useListing(id)
  const { data: avail } = useAvailability(id)
  const createBooking = useCreateBooking()

  if (isLoading) return <div className="skeleton-loader">Loading...</div>
  if (isError) return <div className="text-red-500">{error?.message || 'Failed to load listing'}</div>

  const gallery = (data?.images || []).map((src, i) => ({ title: data?.title || `Image ${i + 1}`, src }))

  const handleBook = () => {
    createBooking.mutate({ id: 0, listing_id: Number(id) })
  }

  return (
    <>
      <Header topSpace={{ md: true }} className="absolute w-full top-0 z-[15]">
        <HeaderNav theme="light" fluid="fluid" expand="lg" className="h-[120px] items-center md:h-[80px] xs:h-auto px-[50px] md:px-0 md:py-[15px]" />
      </Header>

      <section className="py-[130px] lg:py-[90px] md:py-[75px] sm:py-[50px]">
        <Container>
          <Row className="mb-10">
            <Col>
              <m.h1 className="heading-4 font-serif font-semibold" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{data?.title}</m.h1>
              <div className="text-[#777]">{data?.location}</div>
            </Col>
          </Row>
          {gallery.length > 0 && (
            <Row className="mb-10">
              <ImageGallery theme="image-gallery-01" data={gallery} grid="grid grid-3col md-grid-2col xs-grid-1col" />
            </Row>
          )}
          <Row>
            <Col lg={8}>
              <p className="text-[#777] leading-7">{data?.description}</p>
            </Col>
            <Col lg={4}>
              <div className="p-6 bg-white shadow-md">
                <div className="font-serif font-semibold text-lg mb-2">Price</div>
                <div className="text-xl">{data?.price} {data?.currency || 'KES'}</div>
                <div className="mt-4 text-sm text-[#777]">Availability: {avail?.status || 'N/A'}</div>
                <CustomModal.Wrapper
                  modalBtn={<Buttons disabled={createBooking.isLoading} className="btn-fancy btn-fill font-medium font-serif rounded-none uppercase mt-6" themeColor="#232323" color="#fff" title={createBooking.isLoading ? 'Booking...' : 'Book Now'} />}
                >
                  <div className="p-6">
                    <h4 className="heading-6 font-serif mb-4">Confirm booking</h4>
                    <p className="text-[#777] mb-6">Proceed to create a booking for this rental?</p>
                    <Buttons onClick={handleBook} disabled={createBooking.isLoading} className="btn-fancy btn-fill font-medium font-serif rounded-none uppercase" themeColor="#232323" color="#fff" title={createBooking.isLoading ? 'Booking...' : 'Confirm'} />
                  </div>
                </CustomModal.Wrapper>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <Suspense fallback={<div />}> 
        <Footer parallax={{ desktop: true, lg: false }} className="bg-[center_top] py-40 md:py-28" />
      </Suspense>
    </>
  )
}

export default RentalDetail

