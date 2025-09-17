import React, { memo, useRef } from "react"
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from 'react-router-dom'
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { m } from 'framer-motion'

const InfoBannerWithBadges = (props) => {
    const swiperRef = useRef(null)
    
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        
        for (let i = 0; i < fullStars; i++) {
            stars.push(<i key={i} className="fas fa-star"></i>);
        }
        
        if (hasHalfStar) {
            stars.push(<i key="half" className="fas fa-star-half-alt"></i>);
        }
        
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<i key={`empty-${i}`} className="far fa-star"></i>);
        }
        
        return stars;
    };

    return (
        <div className={`relative${props.className ? ` ${props.className}` : ""}`}>
            <div onClick={() => swiperRef.current.swiper.slidePrev()} className="swiper-button-prev -left-[70px] lg:left-[-12px] landscape:md:left-[-7px] xs:left-0" ></div>
            <Swiper
                className="h-full p-[15px]"
                ref={swiperRef}
                {...props.carouselOption}
                modules={[Pagination, Autoplay, Navigation]} >
                {
                    props.data.map((item, i) => {
                        return (
                            <SwiperSlide key={i}>
                                <m.div className="swiper-slide shadow-[0_0_15px_rgba(0,0,0,0.08)] relative" {...{ ...props.animation, transition: { delay: i * props.animationDelay } }}>
                                    {/* Top Rated Badge */}
                                    {item.topRatedBadge && (
                                        <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold py-1 px-2 rounded z-10">
                                            {item.topRatedBadge}
                                        </div>
                                    )}
                                    
                                    {/* Availability Badge */}
                                    {item.availabilityText && item.availability !== "available" && (
                                        <div className={`absolute top-4 right-4 text-white text-xs font-medium py-1 px-2 rounded z-10 ${
                                            item.availability === "high_demand" ? "bg-orange-500" :
                                            item.availability === "few_spots" ? "bg-yellow-500" :
                                            item.availability === "fully_booked" ? "bg-red-500" : "bg-green-500"
                                        }`}>
                                            {item.availabilityText}
                                        </div>
                                    )}
                                    
                                    <Link aria-label="link" to={item.link}>
                                        <img width={263} height={216} src={item.img} className="w-full" alt="tour package" />
                                    </Link>
                                    <div className="relative bg-white p-12 md:px-16">
                                        <div className="bg-neonorange text-sm font-medium font-serif text-white uppercase absolute -top-[15px] right-0 py-[5px] px-[20px]">{item.packageprice}</div>
                                        <span className="text-md uppercase block mb-[5px]">{item.days}</span>
                                        <Link aria-label="link" to={item.link} className="font-serif font-medium block mb-[30px] leading-[24px] text-darkgray hover:text-neonorange">{item.title}</Link>
                                        
                                        {/* Dynamic Star Rating */}
                                        <span className="text-[#ff9c00] text-sm leading-[18px] block mb-2">
                                            {renderStars(item.rating || 4.5).map((star, index) => (
                                                <span key={index} className="mr-1">{star}</span>
                                            ))}
                                        </span>
                                        <span className="text-md">{item.reviews}</span>
                                        
                                        {/* Custom Button */}
                                        {item.customButton && (
                                            <div className="mt-4">
                                                {item.customButton}
                                            </div>
                                        )}
                                    </div>
                                </m.div>
                            </SwiperSlide>
                        )
                    })
                }
            </Swiper>
            <div onClick={() => swiperRef.current.swiper.slideNext()} className="swiper-button-next -right-[70px] lg:right-[-12px] landscape:md:right-[-7px] xs:right-0"> </div>
        </div>
    )
}

export default memo(InfoBannerWithBadges)
