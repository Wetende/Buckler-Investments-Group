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
  DropdownToggle,
  DropdownMenu,
  UncontrolledDropdown,
  DropdownItem,
  BlockBetween,
} from "@/components/Component";
import { Card, CardBody, Modal, ModalBody } from "reactstrap";
import { useBnbReviews, useRespondReview } from "@/hooks/useBnb";
import { toast } from "react-toastify";

const Reviews = () => {
  const [sm, updateSm] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [responseText, setResponseText] = useState("");

  // API hooks for real data
  const { data: reviewsData, isLoading, error, refetch } = useBnbReviews({
    status: statusFilter === 'all' ? undefined : statusFilter,
    rating: ratingFilter === 'all' ? undefined : ratingFilter
  });
  const respondReviewMutation = useRespondReview();

  const reviews = reviewsData?.items || [];

  // Mock reviews data (fallback)
  const mockReviews = [
    {
      id: "REV001",
      booking: "BNB001",
      property: "Luxury Villa in Karen",
      guest: "James Mwangi",
      guestAvatar: "user1.jpg",
      rating: 5,
      title: "Amazing stay!",
      comment: "The villa was absolutely beautiful and exceeded our expectations. The host was very responsive and helpful. Would definitely stay again!",
      date: "2024-01-19",
      helpful: 12,
      status: "published",
      response: "Thank you so much for the wonderful review! We're delighted you enjoyed your stay.",
      responseDate: "2024-01-20"
    },
    {
      id: "REV002",
      booking: "BNB003",
      property: "Beach House - Diani",
      guest: "Peter Ochieng",
      guestAvatar: "user2.jpg",
      rating: 4,
      title: "Great location",
      comment: "Perfect location near the beach. The house was clean and well-equipped. Only minor issue was the WiFi speed could be better.",
      date: "2024-01-31",
      helpful: 8,
      status: "published",
      response: "Thanks for the feedback! We've upgraded our WiFi package based on your suggestion.",
      responseDate: "2024-02-01"
    },
    {
      id: "REV003",
      booking: "BNB002",
      property: "Modern Apartment - Westlands",
      guest: "Grace Wanjiku",
      guestAvatar: "user3.jpg",
      rating: 5,
      title: "Perfect for business travel",
      comment: "Excellent apartment in a great location. Very convenient for business meetings in the area. The apartment was spotless and had everything I needed.",
      date: "2024-01-23",
      helpful: 15,
      status: "published",
      response: null,
      responseDate: null
    },
    {
      id: "REV004",
      booking: "BNB004",
      property: "Cozy Studio - Kilimani",
      guest: "Mary Njeri",
      guestAvatar: "user4.jpg",
      rating: 3,
      title: "Decent but could be better",
      comment: "The studio was okay for a short stay. However, the noise from the street was quite loud and the bathroom could use some updating.",
      date: "2024-01-30",
      helpful: 3,
      status: "pending",
      response: null,
      responseDate: null
    }
  ];

  // Use real reviews data if available, otherwise fallback to mock data
  const reviewsToUse = reviews.length > 0 ? reviews : mockReviews;
  
  const metrics = reviewsData?.summary || {
    totalReviews: reviewsToUse.length,
    averageRating: reviewsToUse.length > 0 ? (reviewsToUse.reduce((sum, r) => sum + r.rating, 0) / reviewsToUse.length).toFixed(1) : '0.0',
    fiveStarReviews: reviewsToUse.filter(r => r.rating === 5).length,
    pendingResponses: reviewsToUse.filter(r => !r.response && r.status === 'published').length,
    helpfulVotes: reviewsToUse.reduce((sum, r) => sum + (r.helpful || 0), 0)
  };

  const ratingDistribution = reviewsData?.rating_distribution || [
    { stars: 5, count: reviewsToUse.filter(r => r.rating === 5).length },
    { stars: 4, count: reviewsToUse.filter(r => r.rating === 4).length },
    { stars: 3, count: reviewsToUse.filter(r => r.rating === 3).length },
    { stars: 2, count: reviewsToUse.filter(r => r.rating === 2).length },
    { stars: 1, count: reviewsToUse.filter(r => r.rating === 1).length },
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'success';
      case 'pending': return 'warning';
      case 'flagged': return 'danger';
      default: return 'light';
    }
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

  // Review response handlers
  const handleRespondToReview = (review) => {
    setSelectedReview(review);
    setResponseText(review.response || '');
    setShowResponseModal(true);
  };

  const handleSubmitResponse = async () => {
    if (!responseText.trim()) {
      toast.error('Please enter a response');
      return;
    }

    try {
      await respondReviewMutation.mutateAsync({
        id: selectedReview.id,
        response: responseText
      });
      setShowResponseModal(false);
      setSelectedReview(null);
      setResponseText('');
      refetch(); // Refresh reviews
    } catch (error) {
      console.error('Response submission failed:', error);
    }
  };

  const handleCloseResponseModal = () => {
    setShowResponseModal(false);
    setSelectedReview(null);
    setResponseText('');
  };

  return (
    <React.Fragment>
      <Head title="Reviews" />
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page>Reviews</BlockTitle>
              <BlockDes className="text-soft">
                <p>Manage guest reviews and feedback for your properties.</p>
              </BlockDes>
            </BlockHeadContent>
            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle">
                <Button
                  className={`btn-icon btn-trigger toggle-expand mr-n1 ${sm ? "active" : ""}`}
                  onClick={() => updateSm(!sm)}
                >
                  <Icon name="menu-alt-r"></Icon>
                </Button>
                <div className="toggle-expand-content" style={{ display: sm ? "block" : "none" }}>
                  <ul className="nk-block-tools g-3">
                    <li>
                      <Button color="light" outline className="btn-white">
                        <Icon name="download-cloud"></Icon>
                        <span>Export Reviews</span>
                      </Button>
                    </li>
                    <li>
                      <Button color="primary" outline>
                        <Icon name="chat"></Icon>
                        <span>Respond to Reviews</span>
                      </Button>
                    </li>
                  </ul>
                </div>
              </div>
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

        {/* Rating Distribution */}
        <Block>
          <Card className="card-bordered">
            <CardBody className="card-inner">
              <div className="card-title-group">
                <div className="card-title">
                  <h6 className="title">Rating Distribution</h6>
                </div>
              </div>
              <div className="rating-overview">
                {ratingDistribution.map((item) => (
                  <div key={item.stars} className="rating-item d-flex align-items-center mb-2">
                    <div className="rating-label mr-3" style={{ minWidth: '60px' }}>
                      {renderStars(item.stars)}
                    </div>
                    <div className="rating-bar flex-grow-1 mr-3">
                      <div className="progress progress-sm">
                        <div
                          className="progress-bar bg-warning"
                          style={{ width: `${(item.count / metrics.totalReviews) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="rating-count">
                      <span className="text-muted">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </Block>

        {/* Reviews Table */}
        <Block>
          <DataTable className="card-stretch">
            <div className="card-inner position-relative card-tools-toggle">
              <div className="card-title-group">
                <div className="card-title">
                  <h6 className="title">Recent Reviews</h6>
                </div>
                <div className="card-tools">
                  <div className="form-inline flex-nowrap gx-3">
                    <div className="form-wrap w-150px">
                      <select 
                        className="form-select" 
                        value={ratingFilter}
                        onChange={(e) => setRatingFilter(e.target.value)}
                      >
                        <option value="all">All Reviews</option>
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="2">2 Stars</option>
                        <option value="1">1 Star</option>
                      </select>
                    </div>
                    <div className="form-wrap w-150px">
                      <select 
                        className="form-select" 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value="all">All Status</option>
                        <option value="published">Published</option>
                        <option value="pending">Pending</option>
                        <option value="flagged">Flagged</option>
                      </select>
                    </div>
                    <div className="btn-wrap">
                      <span className="d-none d-md-block">
                        <Button
                          color="light"
                          outline
                          className="btn-dim"
                          onClick={() => refetch()}
                        >
                          <Icon name="reload"></Icon>
                        </Button>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <DataTableBody>
              <DataTableHead className="nk-tb-item nk-tb-head">
                <DataTableRow>
                  <span className="sub-text">Guest</span>
                </DataTableRow>
                <DataTableRow size="md">
                  <span className="sub-text">Property</span>
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
                <DataTableRow size="md">
                  <span className="sub-text">Status</span>
                </DataTableRow>
                <DataTableRow className="nk-tb-col-tools text-right">
                  <span className="sub-text">Action</span>
                </DataTableRow>
              </DataTableHead>
              {reviewsToUse.map((review) => (
                <DataTableItem key={review.id}>
                  <DataTableRow>
                    <div className="user-card">
                      <UserAvatar 
                        theme="primary" 
                        text={review.guest.charAt(0)}
                        image={review.guestAvatar}
                      />
                      <div className="user-info">
                        <span className="tb-lead">{review.guest}</span>
                        <span className="sub-text">Booking: {review.booking}</span>
                      </div>
                    </div>
                  </DataTableRow>
                  <DataTableRow size="md">
                    <span className="tb-lead">{review.property}</span>
                  </DataTableRow>
                  <DataTableRow size="lg">
                    <div>
                      <h6 className="tb-lead">{review.title}</h6>
                      <p className="tb-sub text-truncate" style={{ maxWidth: '300px' }}>
                        {review.comment}
                      </p>
                      {review.helpful > 0 && (
                        <div className="tb-sub text-muted">
                          <Icon name="thumbs-up" className="mr-1"></Icon>
                          {review.helpful} found helpful
                        </div>
                      )}
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
                  <DataTableRow size="md">
                    <Badge color={getStatusColor(review.status)}>
                      {review.status}
                    </Badge>
                  </DataTableRow>
                  <DataTableRow className="nk-tb-col-tools">
                    <ul className="nk-tb-actions gx-1">
                      <li>
                        <UncontrolledDropdown>
                          <DropdownToggle tag="a" className="dropdown-toggle btn btn-icon btn-trigger">
                            <Icon name="more-h"></Icon>
                          </DropdownToggle>
                          <DropdownMenu right>
                            <ul className="link-list-opt no-bdr">
                              <li>
                                <DropdownItem
                                  tag="a"
                                  href="#view"
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                  }}
                                >
                                  <Icon name="eye"></Icon>
                                  <span>View Full Review</span>
                                </DropdownItem>
                              </li>
                              {!review.response && (
                                <li>
                                  <DropdownItem
                                    tag="a"
                                    href="#respond"
                                    onClick={(ev) => {
                                      ev.preventDefault();
                                      handleRespondToReview(review);
                                    }}
                                  >
                                    <Icon name="chat"></Icon>
                                    <span>Respond</span>
                                  </DropdownItem>
                                </li>
                              )}
                              <li>
                                <DropdownItem
                                  tag="a"
                                  href="#share"
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                  }}
                                >
                                  <Icon name="share"></Icon>
                                  <span>Share Review</span>
                                </DropdownItem>
                              </li>
                              <li className="divider"></li>
                              <li>
                                <DropdownItem
                                  tag="a"
                                  href="#flag"
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                  }}
                                >
                                  <Icon name="flag"></Icon>
                                  <span>Report Review</span>
                                </DropdownItem>
                              </li>
                            </ul>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </li>
                    </ul>
                  </DataTableRow>
                </DataTableItem>
              ))}
            </DataTableBody>
          </DataTable>
        </Block>

        {/* Review Response Modal */}
        <Modal 
          isOpen={showResponseModal} 
          toggle={handleCloseResponseModal} 
          className="modal-dialog-centered" 
          size="lg"
        >
          <ModalBody>
            <a 
              href="#close" 
              onClick={(e) => {
                e.preventDefault();
                handleCloseResponseModal();
              }} 
              className="close"
            >
              <Icon name="cross-sm" />
            </a>
            <div className="p-2">
              <h5 className="title">
                {selectedReview?.response ? 'Edit Response' : 'Respond to Review'}
              </h5>
              {selectedReview && (
                <div className="mt-4">
                  {/* Original Review */}
                  <div className="card card-bordered mb-4">
                    <div className="card-inner">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="user-card">
                          <UserAvatar 
                            theme="primary" 
                            text={(selectedReview.guest_name || selectedReview.guest || 'Guest').charAt(0)}
                          />
                          <div className="user-info">
                            <span className="lead-text">{selectedReview.guest_name || selectedReview.guest || 'Guest'}</span>
                            <span className="sub-text">{formatDate(selectedReview.date || selectedReview.created_at)}</span>
                          </div>
                        </div>
                        <div className="rating">
                          {renderStars(selectedReview.rating)}
                        </div>
                      </div>
                      <h6 className="title">{selectedReview.title}</h6>
                      <p className="text">{selectedReview.comment}</p>
                    </div>
                  </div>

                  {/* Response Form */}
                  <div className="form-group">
                    <label className="form-label">Your Response</label>
                    <div className="form-control-wrap">
                      <textarea 
                        className="form-control" 
                        rows="6"
                        placeholder="Write your response to this review..."
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                      />
                    </div>
                    <div className="form-note">
                      Your response will be publicly visible to all guests.
                    </div>
                  </div>

                  <div className="form-group">
                    <Button 
                      type="button" 
                      color="primary"
                      size="lg"
                      onClick={handleSubmitResponse}
                      disabled={respondReviewMutation.isLoading}
                      className="w-100"
                    >
                      {respondReviewMutation.isLoading ? 'Submitting...' : (selectedReview.response ? 'Update Response' : 'Submit Response')}
                    </Button>
                  </div>

                  <div className="alert alert-light">
                    <Icon name="info" className="mr-2" />
                    Remember to be professional and courteous in your response. This helps build trust with potential guests.
                  </div>
                </div>
              )}
            </div>
          </ModalBody>
        </Modal>

      </Content>
    </React.Fragment>
  );
};

export default Reviews;

