import React, { useState } from "react";

// Libraries
import { Col, Container, Row } from "react-bootstrap";
import { m } from "framer-motion";

// Components
import Header, { HeaderNav, Menu } from "../../Components/Header/Header";
import Brand from "../../Components/Header/Brand";
import ToursMenuData from "../../Components/Header/ToursMenuData";
import FooterStyle01 from "../../Components/Footers/FooterStyle01";
import InfoBannerStyle05 from "../../Components/InfoBanner/InfoBannerStyle05";
import ToursSideFilters from "../../Components/Tours/ToursSideFilters";
import Buttons from "../../Components/Button/Buttons";
import { fadeIn } from "../../Functions/GlobalAnimations";

// API hooks
import { useTours } from "../../api/useTours";

const ToursList = (props) => {
  const [filters, setFilters] = useState({});
  
  // Load tours with infinite query
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useTours(filters, 12);

  // Flatten pages data and map to InfoBannerStyle05 format
  const allTours = data?.pages?.flat() || [];
  const toursItems = allTours.map((tour) => ({
    img: tour.image || "https://via.placeholder.com/525x431",
    packageprice: tour.price ? `From ${tour.price} ${tour.currency || "KES"}` : "From KES 25,000",
    days: tour.duration || (tour.duration_hours ? `${tour.duration_hours} hrs` : "2 Days"),
    title: tour.title || tour.name || "Kenya Adventure",
    reviews: tour.reviews_count ? `${tour.reviews_count} Reviews` : "0 Reviews",
    link: `/tours/${tour.id}`,
    rating: tour.rating || 4.5,
  }));

  return (
    <div style={props.style}>
      
      {/* Header Start */}
      <Header topSpace={{ md: true }} type="reverse-scroll">
        <HeaderNav
          theme="dark"
          fluid="fluid"
          expand="lg"
          containerClass="sm:!px-0"
          className="py-[0px] border-b border-[#ffffff1a] px-[35px] md:pr-[15px] md:pl-0 md:py-[20px]"
        >
          <Col xs="auto" lg={2} sm={6} className="me-auto ps-lg-0">
            <a aria-label="header logo" className="flex items-center" href="/">
              <Brand
                theme="dark"
                size="large"
                className="text-white"
              />
            </a>
          </Col>
          <div className="navbar-collapse col-xs-auto col-lg-8 menu-order px-lg-0 justify-center">
            <Menu data={ToursMenuData} {...props} />
          </div>
        </HeaderNav>
      </Header>
      {/* Header End */}

      <div className="bg-white">
        {/* Page Title */}
        <section className="py-[60px] bg-lightgray">
          <Container>
            <Row className="justify-center">
              <Col lg={8} className="text-center">
                <h1 className="heading-3 font-serif font-semibold text-darkgray mb-[10px] -tracking-[1px]">All Tours</h1>
                <p className="text-lg leading-[28px] lg:text-xmd">Discover amazing tours and adventures across Kenya</p>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Sidebar + Results */}
        <section className="py-[60px]">
          <Container>
            <Row>
              {/* Sidebar */}
              <Col lg={3} md={4} className="sm:mb-[30px]">
                <ToursSideFilters value={filters} onChange={setFilters} />
              </Col>
              {/* Results */}
              <Col lg={9} md={8}>
                {isLoading ? (
                  <div className="text-center py-20">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-neonorange"></div>
                    <p className="mt-4 text-lg">Loading tours...</p>
                  </div>
                ) : isError ? (
                  <div className="text-center py-20">
                    <p className="text-lg text-red-600">Error loading tours. Please try again.</p>
                  </div>
                ) : (
                  <>
                    <m.div className="row" {...fadeIn}>
                      <InfoBannerStyle05
                        grid="row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-3 gap-y-10"
                        data={toursItems}
                      />
                    </m.div>
                    {hasNextPage && (
                      <Row className="mt-10">
                        <Col className="text-center">
                          <Buttons
                            ariaLabel="Load more tours"
                            onClick={() => fetchNextPage()}
                            disabled={isFetchingNextPage}
                            className="btn-fancy btn-fill font-medium font-serif rounded-none uppercase"
                            themeColor="#232323"
                            color="#fff"
                            size="lg"
                            title={isFetchingNextPage ? "Loading..." : "Load More Tours"}
                          />
                        </Col>
                      </Row>
                    )}
                  </>
                )}
              </Col>
            </Row>
          </Container>
        </section>
      </div>

      {/* Footer Start */}
      <FooterStyle01
        className="text-slateblue"
        theme="dark"
      />
      {/* Footer End */}
    </div>
  );
};

export default ToursList;
