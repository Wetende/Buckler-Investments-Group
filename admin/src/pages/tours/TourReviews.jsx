import React, { useState } from "react";
import Head from "@/layout/head/Head";
import Content from "@/layout/content/Content";
import {
  Block,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  Button,
  Row,
  Col,
  DataTable,
  DataTableBody,
  DataTableHead,
  DataTableRow,
  DataTableItem,
  UserAvatar,
  Badge,
  BlockBetween,
} from "@/components/Component";
import { Card, CardBody } from "reactstrap";

const TourReviews = () => {
  const [sm, updateSm] = useState(false);

  // Mock reviews data for tours
  const reviews = [
    {
      id: "TR001",
      booking: "TOR001",
      tour: "Maasai Mara Safari Adventure",
      customer: "James Mwangi",
      rating: 5,
      title: "Incredible safari experience!",
      comment: "Amazing wildlife sightings and professional guides. Highly recommended for anyone visiting Kenya.",
      date: "2024-02-18",
      helpful: 15,
      status: "published",
      response: "Thank you for the wonderful review! We're glad you enjoyed the safari."
    },
    {
      id: "TR002",
      booking: "TOR003",
      tour: "Coastal Cultural Experience",
      customer: "Peter Ochieng",
      rating: 4,
      title: "Great cultural immersion",
      comment: "Loved learning about the local culture and traditions. The guide was very knowledgeable.",
      date: "2024-02-12",
      helpful: 8,
      status: "published",
      response: null
    }
  ];

  const metrics = {
    totalReviews: reviews.length,
    averageRating: (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1),
    fiveStarReviews: reviews.filter(r => r.rating === 5).length,
    pendingResponses: reviews.filter(r => !r.response && r.status === 'published').length
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Icon
        key={i}
        name="star-fill"
        className={i < rating ? "text-warning" : "text-light"}
      ></Icon>
    ));
  };

  return (
    <React.Fragment>
      <Head title="Tour Reviews" />
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page>Tour Reviews</BlockTitle>
              <BlockDes className="text-soft">
                <p>Manage customer reviews and feedback for your tours.</p>
              </BlockDes>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        {/* Metrics Overview */}
        <Block>
          <Row className="g-gs">
            <Col xxl="3" sm="6">
              <Card className="card-bordered">
                <CardBody className="card-inner">
                  <div className="card-title-group align-start mb-0">
                    <div className="card-title">
                      <h6 className="subtitle">Total Reviews</h6>
                    </div>
                    <div className="card-tools">
                      <Icon name="chat" className="card-hint-icon text-primary"></Icon>
                    </div>
                  </div>
                  <div className="card-amount">
                    <span className="amount">{metrics.totalReviews}</span>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xxl="3" sm="6">
              <Card className="card-bordered">
                <CardBody className="card-inner">
                  <div className="card-title-group align-start mb-0">
                    <div className="card-title">
                      <h6 className="subtitle">Average Rating</h6>
                    </div>
                    <div className="card-tools">
                      <Icon name="star" className="card-hint-icon text-warning"></Icon>
                    </div>
                  </div>
                  <div className="card-amount">
                    <span className="amount">{metrics.averageRating}</span>
                    <span className="amount-sm">stars</span>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xxl="3" sm="6">
              <Card className="card-bordered">
                <CardBody className="card-inner">
                  <div className="card-title-group align-start mb-0">
                    <div className="card-title">
                      <h6 className="subtitle">5-Star Reviews</h6>
                    </div>
                    <div className="card-tools">
                      <Icon name="star-fill" className="card-hint-icon text-success"></Icon>
                    </div>
                  </div>
                  <div className="card-amount">
                    <span className="amount">{metrics.fiveStarReviews}</span>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xxl="3" sm="6">
              <Card className="card-bordered">
                <CardBody className="card-inner">
                  <div className="card-title-group align-start mb-0">
                    <div className="card-title">
                      <h6 className="subtitle">Pending Responses</h6>
                    </div>
                    <div className="card-tools">
                      <Icon name="clock" className="card-hint-icon text-warning"></Icon>
                    </div>
                  </div>
                  <div className="card-amount">
                    <span className="amount">{metrics.pendingResponses}</span>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Block>

        {/* Reviews Table */}
        <Block>
          <DataTable className="card-stretch">
            <DataTableBody>
              <DataTableHead className="nk-tb-item nk-tb-head">
                <DataTableRow>
                  <span className="sub-text">Customer</span>
                </DataTableRow>
                <DataTableRow size="md">
                  <span className="sub-text">Tour</span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text">Review</span>
                </DataTableRow>
                <DataTableRow size="md">
                  <span className="sub-text">Rating</span>
                </DataTableRow>
                <DataTableRow size="md">
                  <span className="sub-text">Date</span>
                </DataTableRow>
              </DataTableHead>
              {reviews.map((review) => (
                <DataTableItem key={review.id}>
                  <DataTableRow>
                    <div className="user-card">
                      <UserAvatar 
                        theme="primary" 
                        text={review.customer.charAt(0)}
                      />
                      <div className="user-info">
                        <span className="tb-lead">{review.customer}</span>
                        <span className="sub-text">Booking: {review.booking}</span>
                      </div>
                    </div>
                  </DataTableRow>
                  <DataTableRow size="md">
                    <span className="tb-lead">{review.tour}</span>
                  </DataTableRow>
                  <DataTableRow size="lg">
                    <div>
                      <h6 className="tb-lead">{review.title}</h6>
                      <p className="tb-sub text-truncate" style={{ maxWidth: '300px' }}>
                        {review.comment}
                      </p>
                      {review.response && (
                        <div className="mt-2 p-2 bg-light rounded">
                          <small className="text-muted">Your response:</small>
                          <p className="mb-0 small">{review.response}</p>
                        </div>
                      )}
                    </div>
                  </DataTableRow>
                  <DataTableRow size="md">
                    <div className="rating-sm">
                      {renderStars(review.rating)}
                    </div>
                  </DataTableRow>
                  <DataTableRow size="md">
                    <span className="tb-lead">{formatDate(review.date)}</span>
                  </DataTableRow>
                </DataTableItem>
              ))}
            </DataTableBody>
          </DataTable>
        </Block>
      </Content>
    </React.Fragment>
  );
};

export default TourReviews;


