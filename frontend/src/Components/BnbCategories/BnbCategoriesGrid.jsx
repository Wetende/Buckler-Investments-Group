import React, { useState, useEffect, useRef, memo } from "react";

// Libraries
import { Link } from "react-router-dom";
import { PropTypes } from "prop-types";
import { m } from "framer-motion";

// Components
import Filter from "../Portfolio/Filter";

// BnB Categories Data
const bnbCategoriesData = [
  {
    id: 1,
    category: ["entire-places"],
    type: "entire",
    img: "https://via.placeholder.com/350x245",
    title: "Entire places",
    content: "Have a place to yourself. Complete privacy and space for your group.",
    features: "Full kitchen • Private entrance • Entire home",
    icon: "fas fa-home",
    link: "/bnb?type=entire",
    badge: "Most Popular"
  },
  {
    id: 2,
    category: ["private-rooms"],
    type: "private",
    img: "https://via.placeholder.com/350x245",
    title: "Private rooms",
    content: "Your own room in a home or hotel. Some shared common spaces.",
    features: "Private bedroom • Shared kitchen • Host interaction",
    icon: "fas fa-bed",
    link: "/bnb?type=private",
    badge: "Great Value"
  },
  {
    id: 3,
    category: ["shared-rooms"],
    type: "shared",
    img: "https://via.placeholder.com/350x245",
    title: "Shared rooms",
    content: "A shared room or common area. Budget-friendly option for travelers.",
    features: "Shared room • Common areas • Meet other travelers",
    icon: "fas fa-users",
    link: "/bnb?type=shared",
    badge: "Budget Friendly"
  },
  {
    id: 4,
    category: ["unique-stays"],
    type: "unique",
    img: "https://via.placeholder.com/350x245",
    title: "Unique stays",
    content: "Spaces that are more than just a place to sleep. Extraordinary experiences.",
    features: "Unique design • Special locations • Memorable stays",
    icon: "fas fa-star",
    link: "/bnb?category=unique",
    badge: "Special"
  },
  {
    id: 5,
    category: ["business-travel"],
    type: "business", 
    img: "https://via.placeholder.com/350x245",
    title: "Business travel",
    content: "Professional accommodations for work trips. Wi-Fi and workspace included.",
    features: "Wi-Fi • Workspace • Business amenities",
    icon: "fas fa-briefcase",
    link: "/bnb?category=business",
    badge: "Professional"
  },
  {
    id: 6,
    category: ["monthly-stays"],
    type: "monthly",
    img: "https://via.placeholder.com/350x245", 
    title: "Monthly stays",
    content: "Extended stays with special monthly rates. Perfect for digital nomads.",
    features: "Extended stays • Monthly rates • Flexible terms",
    icon: "fas fa-calendar-alt",
    link: "/bnb?duration=monthly",
    badge: "Extended Stay"
  }
];

const BnbCategoriesGrid = (props) => {
  const gridWrapper = useRef();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import("../../Functions/Utilities").then(module => {
      const grid = module.initializeIsotop(gridWrapper.current)
      grid.on('arrangeComplete', () => setLoading(false));
    })
  }, [])

  const style = {
    "--overlay-color": typeof (props.overlay) === "object" ? `linear-gradient(to right top, ${props.overlay.map((item, i) => item)})` : props.overlay
  }

  const handleFilterChange = () => {
    gridWrapper.current.querySelectorAll("li").forEach(item => item.childNodes[0]?.classList.add("appear"))
  }

  return (
    <div className="grid-wrapper">
      {/* Filter Start */}
      {props.filter !== false && <Filter title={props.title} filterData={props.filterData} onFilterChange={handleFilterChange} />}
      {/* Filter End */}

      {/* Grid Start */}
      <ul ref={gridWrapper} className={`grid-container${props.grid ? ` ${props.grid}` : ""}${loading ? " loading" : ""}${props.filter === false ? "" : " mt-28 md:mt-[4.5rem] sm:mt-8"}`}>
        <li className="grid-sizer"></li>
        {(props.data || bnbCategoriesData).map((item, i) => {
          return (
            <li className={`grid-item${item.double_col ? " grid-item-double" : ""} ${item.category.map(item => item.split(" ").join("")).toString().split(",").join(" ").toLowerCase()}`} key={i} >
              <m.div className="blog-grid rounded-[5px] overflow-hidden"
                initial={{ opacity: 0 }}
                whileInView={!loading && { opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: "easeOut" }}
              >
                <div className="blog-post relative overflow-hidden" style={style}>
                  {(item.link || item.img) && (
                    <Link aria-label={`Browse ${item.title}`} to={item.link}>
                      <img height={245} width={350} src={item.img} alt={item.title} />
                    </Link>
                  )}
                  {item.badge && (
                    <span className="blog-grid-catagory bg-[#171717bf] font-serif text-white text-xxs uppercase px-[13px] py-[6px] rounded-[2px] absolute top-[23px] right-[23px]">
                      {item.badge}
                    </span>
                  )}
                  {item.icon && (
                    <div className="absolute top-[23px] left-[23px] w-[40px] h-[40px] bg-white rounded-full flex items-center justify-center">
                      <i className={`${item.icon} text-red-600 text-lg`}></i>
                    </div>
                  )}
                </div>
                <div className="px-12 py-10 bg-white sm:px-8 xs:px-12">
                  {(item.link || item.title) && (
                    <Link aria-label={`Browse ${item.title}`} to={item.link} className="font-serif mb-[15px] text-xmd block font-medium text-darkgray hover:text-red-600">
                      {item.title}
                    </Link>
                  )}
                  {item.content && (<p className="mb-[20px] md:mb-[15px] sm:mb-[10px]"> {item.content} </p>)}
                  {item.features && (
                    <div className="mb-[25px] md:mb-[20px] sm:mb-[15px]">
                      <p className="text-sm text-darkgray font-medium"> {item.features} </p>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Link aria-label={`Explore ${item.title}`} 
                          to={item.link} 
                          className="text-sm font-serif hover:text-red-600 font-medium flex items-center">
                      Explore {item.title.toLowerCase()}
                      <i className="fas fa-arrow-right ml-2 text-xs"></i>
                    </Link>
                  </div>
                </div>
              </m.div>
            </li>
          );
        })}
      </ul>
      {/* Grid End */}
    </div>
  );
};

BnbCategoriesGrid.defaultProps = {
  filter: false,
  data: bnbCategoriesData,
  grid: "grid grid-3col xl-grid-3col lg-grid-3col md-grid-2col sm-grid-2col xs-grid-1col gutter-extra-large"
};

BnbCategoriesGrid.propTypes = {
  filter: PropTypes.bool,
  title: PropTypes.string,
  grid: PropTypes.string,
  data: PropTypes.arrayOf(
    PropTypes.exact({
      id: PropTypes.number,
      category: PropTypes.array,
      type: PropTypes.string,
      img: PropTypes.string,
      title: PropTypes.string,
      content: PropTypes.string,
      features: PropTypes.string,
      icon: PropTypes.string,
      link: PropTypes.string,
      badge: PropTypes.string,
      double_col: PropTypes.bool
    })
  ),
};

export default memo(BnbCategoriesGrid);
