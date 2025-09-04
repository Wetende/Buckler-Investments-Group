import React from 'react'
import { m } from 'framer-motion'
import { fadeIn } from '../../../Functions/GlobalAnimations'
import Buttons from '../../../Components/Button/Buttons'

export default function InvestmentSpotlight() {
  return (
    <section className="py-[130px] overflow-hidden bg-white lg:py-[90px] md:py-[75px] sm:py-[50px]">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="heading-5 font-serif font-semibold text-darkgray uppercase -tracking-[1px]">Investment spotlight</h2>
          <p className="m-0">Key metrics across our products</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[{ label: 'Avg. annual return', value: '18.2%' }, { label: 'Assets under management', value: 'KES 1.2B' }, { label: 'Active products', value: '6' }].map((x, i) => (
            <m.div key={x.label} className="p-6 border rounded-md bg-white" {...{ ...fadeIn, transition: { delay: 0.2 + i * 0.1 } }}>
              <div className="text-3xl font-semibold">{x.value}</div>
              <div className="text-[#777]">{x.label}</div>
            </m.div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Buttons ariaLabel="invest now" to="/invest" className="btn-fancy btn-fill font-medium font-serif rounded-none uppercase" themeColor="#232323" color="#fff" size="sm" title="Explore investments" />
        </div>
      </div>
    </section>
  )
}


