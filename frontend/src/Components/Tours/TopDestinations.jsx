import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const Card = ({ title, subtitle, img, link }) => (
  <div className="relative overflow-hidden rounded-md shadow-sm bg-white">
    <Link to={link}>
      <img src={img} alt={title} className="w-full h-[180px] object-cover" />
      <div className="p-4">
        <div className="font-serif font-semibold text-darkgray">{title}</div>
        {subtitle && <div className="text-sm text-gray-600">{subtitle}</div>}
      </div>
    </Link>
  </div>
)

const TopDestinations = ({ items = [] }) => {
  return (
    <section className="py-[80px] border-b border-mediumgray bg-white">
      <Container>
        <Row className="mb-8">
          <Col>
            <h3 className="heading-5 font-serif font-semibold text-darkgray uppercase mb-[5px] -tracking-[1px]">Top destinations</h3>
            <p className="m-0 block">Popular places to find amazing activities</p>
          </Col>
        </Row>
        <Row className="row-cols-1 row-cols-sm-2 row-cols-lg-4 gap-y-6">
          {items.map((d, i) => (
            <Col key={i}>
              <Card title={d.title} subtitle={`${d.activities || 0} activities`} img={d.img} link={d.link} />
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  )
}

export default TopDestinations
