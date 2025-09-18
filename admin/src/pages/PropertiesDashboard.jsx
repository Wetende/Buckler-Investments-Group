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
  PreviewCard,
  BlockBetween,
} from "@/components/Component";
import { Card } from "reactstrap";

const PropertiesDashboard = () => {
  const [sm, updateSm] = useState(false);

  // Mock data for Properties metrics
  const propertiesMetrics = {
    totalListings: 1247,
    activeAgents: 89,
    monthlyInquiries: 342,
    averagePrice: 8500000,
    soldThisMonth: 23,
    pendingApprovals: 15
  };

  const recentInquiries = [
    { id: 1, client: "James Mwangi", property: "4BR Villa - Karen", type: "Sale", budget: 15000000, status: "active" },
    { id: 2, client: "Grace Wanjiku", property: "2BR Apartment - Westlands", type: "Rent", budget: 85000, status: "pending" },
    { id: 3, client: "Peter Ochieng", property: "Commercial Plot - CBD", type: "Sale", budget: 50000000, status: "active" },
  ];

  const topLocations = [
    { name: "Karen", listings: 156, avgPrice: 18500000 },
    { name: "Westlands", listings: 134, avgPrice: 12000000 },
    { name: "Kileleshwa", listings: 98, avgPrice: 15500000 },
    { name: "Lavington", listings: 87, avgPrice: 22000000 },
  ];

  const marketTrends = [
    { period: "This Month", sales: 23, inquiries: 342, avgDays: 45 },
    { period: "Last Month", sales: 19, inquiries: 298, avgDays: 52 },
    { period: "3 Months Ago", sales: 21, inquiries: 276, avgDays: 48 },
  ];

  return (
    <>
      <Head title="Properties Dashboard" />
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page tag="h3">
                Properties Dashboard
              </BlockTitle>
              <BlockDes className="text-soft">
                <p>Manage property listings, agents, and market analytics</p>
              </BlockDes>
            </BlockHeadContent>
            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle">
                <Button
                  className={`btn-icon btn-trigger toggle-expand me-n1 ${sm ? "active" : ""}`}
                  onClick={() => updateSm(!sm)}
                >
                  <Icon name="menu-alt-r"></Icon>
                </Button>
                <div className={`toggle-expand-content ${sm ? "expanded" : ""}`}>
                  <ul className="nk-block-tools g-3">
                    <li>
                      <Button color="primary" className="btn-white">
                        <Icon name="plus" />
                        <span>Add Property</span>
                      </Button>
                    </li>
                    <li>
                      <Button color="light" className="btn-outline-light btn-white">
                        <Icon name="download-cloud" />
                        <span>Market Report</span>
                      </Button>
                    </li>
                  </ul>
                </div>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        {/* Properties Metrics Cards */}
        <Block>
          <Row className="g-gs">
            <Col xxl="3" sm="6">
              <PreviewCard>
                <div className="card-inner">
                  <div className="card-title-group align-start mb-0">
                    <div className="card-title">
                      <h6 className="subtitle">Total Listings</h6>
                    </div>
                    <div className="card-tools">
                      <em className="card-hint-icon icon ni ni-building text-primary"></em>
                    </div>
                  </div>
                  <div className="card-amount">
                    <span className="amount">{propertiesMetrics.totalListings}</span>
                    <span className="change up text-success">
                      <Icon name="arrow-long-up" />
                      14.2%
                    </span>
                  </div>
                  <div className="card-amount-sm">Active property listings</div>
                </div>
              </PreviewCard>
            </Col>

            <Col xxl="3" sm="6">
              <PreviewCard>
                <div className="card-inner">
                  <div className="card-title-group align-start mb-0">
                    <div className="card-title">
                      <h6 className="subtitle">Active Agents</h6>
                    </div>
                    <div className="card-tools">
                      <em className="card-hint-icon icon ni ni-users-fill text-info"></em>
                    </div>
                  </div>
                  <div className="card-amount">
                    <span className="amount">{propertiesMetrics.activeAgents}</span>
                    <span className="change up text-success">
                      <Icon name="arrow-long-up" />
                      8.5%
                    </span>
                  </div>
                  <div className="card-amount-sm">Registered property agents</div>
                </div>
              </PreviewCard>
            </Col>

            <Col xxl="3" sm="6">
              <PreviewCard>
                <div className="card-inner">
                  <div className="card-title-group align-start mb-0">
                    <div className="card-title">
                      <h6 className="subtitle">Monthly Inquiries</h6>
                    </div>
                    <div className="card-tools">
                      <em className="card-hint-icon icon ni ni-chat-circle text-success"></em>
                    </div>
                  </div>
                  <div className="card-amount">
                    <span className="amount">{propertiesMetrics.monthlyInquiries}</span>
                    <span className="change up text-success">
                      <Icon name="arrow-long-up" />
                      19.3%
                    </span>
                  </div>
                  <div className="card-amount-sm">This month's inquiries</div>
                </div>
              </PreviewCard>
            </Col>

            <Col xxl="3" sm="6">
              <PreviewCard>
                <div className="card-inner">
                  <div className="card-title-group align-start mb-0">
                    <div className="card-title">
                      <h6 className="subtitle">Average Price</h6>
                    </div>
                    <div className="card-tools">
                      <em className="card-hint-icon icon ni ni-coins text-warning"></em>
                    </div>
                  </div>
                  <div className="card-amount">
                    <span className="amount">KES {(propertiesMetrics.averagePrice / 1000000).toFixed(1)}M</span>
                    <span className="change up text-success">
                      <Icon name="arrow-long-up" />
                      5.7%
                    </span>
                  </div>
                  <div className="card-amount-sm">Average property price</div>
                </div>
              </PreviewCard>
            </Col>
          </Row>
        </Block>

        {/* Recent Inquiries */}
        <Block>
          <BlockHead>
            <BlockHeadContent>
              <BlockTitle tag="h6">Recent Property Inquiries</BlockTitle>
              <p className="text-soft">Latest client inquiries and property interests</p>
            </BlockHeadContent>
          </BlockHead>
          <Card className="card-bordered">
            <div className="card-inner-group">
              <div className="card-inner p-0">
                <div className="nk-tb-list nk-tb-ulist">
                  <div className="nk-tb-item nk-tb-head">
                    <div className="nk-tb-col"><span className="sub-text">Client</span></div>
                    <div className="nk-tb-col tb-col-mb"><span className="sub-text">Property</span></div>
                    <div className="nk-tb-col tb-col-md"><span className="sub-text">Type</span></div>
                    <div className="nk-tb-col tb-col-lg"><span className="sub-text">Budget</span></div>
                    <div className="nk-tb-col tb-col-md"><span className="sub-text">Status</span></div>
                    <div className="nk-tb-col nk-tb-col-tools text-right">
                      <span className="sub-text">Action</span>
                    </div>
                  </div>
                  {recentInquiries.map((inquiry) => (
                    <div key={inquiry.id} className="nk-tb-item">
                      <div className="nk-tb-col">
                        <div className="user-card">
                          <div className="user-avatar bg-warning">
                            <span>{inquiry.client.substring(0, 2).toUpperCase()}</span>
                          </div>
                          <div className="user-info">
                            <span className="tb-lead">{inquiry.client}</span>
                          </div>
                        </div>
                      </div>
                      <div className="nk-tb-col tb-col-mb">
                        <span className="tb-amount">{inquiry.property}</span>
                      </div>
                      <div className="nk-tb-col tb-col-md">
                        <span className={`badge badge-outline-${inquiry.type === 'Sale' ? 'primary' : 'info'}`}>
                          {inquiry.type}
                        </span>
                      </div>
                      <div className="nk-tb-col tb-col-lg">
                        <span className="tb-amount">KES {inquiry.budget.toLocaleString()}</span>
                      </div>
                      <div className="nk-tb-col tb-col-md">
                        <span className={`badge badge-outline-${inquiry.status === 'active' ? 'success' : 'warning'}`}>
                          {inquiry.status}
                        </span>
                      </div>
                      <div className="nk-tb-col nk-tb-col-tools">
                        <ul className="nk-tb-actions gx-1">
                          <li>
                            <Button size="sm" color="primary" outline>
                              <Icon name="eye" />
                            </Button>
                          </li>
                          <li>
                            <Button size="sm" color="light" outline>
                              <Icon name="edit" />
                            </Button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </Block>

        {/* Location Analytics and Market Trends */}
        <Row className="g-gs">
          <Col lg="6">
            <Block>
              <BlockHead>
                <BlockHeadContent>
                  <BlockTitle tag="h6">Top Locations</BlockTitle>
                  <p className="text-soft">Popular areas by listings and pricing</p>
                </BlockHeadContent>
              </BlockHead>
              <Card className="card-bordered">
                <div className="card-inner">
                  <div className="nk-tb-list nk-tb-ulist">
                    <div className="nk-tb-item nk-tb-head">
                      <div className="nk-tb-col"><span className="sub-text">Location</span></div>
                      <div className="nk-tb-col tb-col-md"><span className="sub-text">Listings</span></div>
                      <div className="nk-tb-col tb-col-lg"><span className="sub-text">Avg Price</span></div>
                    </div>
                    {topLocations.map((location, index) => (
                      <div key={index} className="nk-tb-item">
                        <div className="nk-tb-col">
                          <span className="tb-lead">{location.name}</span>
                        </div>
                        <div className="nk-tb-col tb-col-md">
                          <span className="tb-amount">{location.listings}</span>
                        </div>
                        <div className="nk-tb-col tb-col-lg">
                          <span className="tb-amount">KES {(location.avgPrice / 1000000).toFixed(1)}M</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </Block>
          </Col>

          <Col lg="6">
            <Block>
              <BlockHead>
                <BlockHeadContent>
                  <BlockTitle tag="h6">Market Trends</BlockTitle>
                  <p className="text-soft">Sales performance and market activity</p>
                </BlockHeadContent>
              </BlockHead>
              <Card className="card-bordered">
                <div className="card-inner">
                  <div className="nk-tb-list nk-tb-ulist">
                    <div className="nk-tb-item nk-tb-head">
                      <div className="nk-tb-col"><span className="sub-text">Period</span></div>
                      <div className="nk-tb-col tb-col-md"><span className="sub-text">Sales</span></div>
                      <div className="nk-tb-col tb-col-md"><span className="sub-text">Inquiries</span></div>
                      <div className="nk-tb-col tb-col-lg"><span className="sub-text">Avg Days</span></div>
                    </div>
                    {marketTrends.map((trend, index) => (
                      <div key={index} className="nk-tb-item">
                        <div className="nk-tb-col">
                          <span className="tb-lead">{trend.period}</span>
                        </div>
                        <div className="nk-tb-col tb-col-md">
                          <span className="tb-amount">{trend.sales}</span>
                        </div>
                        <div className="nk-tb-col tb-col-md">
                          <span className="tb-amount">{trend.inquiries}</span>
                        </div>
                        <div className="nk-tb-col tb-col-lg">
                          <span className="tb-amount">{trend.avgDays} days</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </Block>
          </Col>
        </Row>

        {/* Quick Actions */}
        <Block>
          <BlockHead>
            <BlockHeadContent>
              <BlockTitle tag="h6">Quick Actions</BlockTitle>
            </BlockHeadContent>
          </BlockHead>
          <Row className="g-3">
            <Col sm="6" lg="3">
              <Card className="card-bordered">
                <div className="card-inner text-center">
                  <div className="card-title-group align-start mb-3">
                    <div className="card-tools">
                      <em className="card-hint-icon icon ni ni-building text-primary" style={{ fontSize: '2rem' }}></em>
                    </div>
                  </div>
                  <div className="card-title">
                    <h6 className="title">Property Listings</h6>
                  </div>
                  <Button color="primary" size="sm">
                    Manage Properties
                  </Button>
                </div>
              </Card>
            </Col>
            <Col sm="6" lg="3">
              <Card className="card-bordered">
                <div className="card-inner text-center">
                  <div className="card-title-group align-start mb-3">
                    <div className="card-tools">
                      <em className="card-hint-icon icon ni ni-users-fill text-success" style={{ fontSize: '2rem' }}></em>
                    </div>
                  </div>
                  <div className="card-title">
                    <h6 className="title">Agent Management</h6>
                  </div>
                  <Button color="success" size="sm">
                    View Agents
                  </Button>
                </div>
              </Card>
            </Col>
            <Col sm="6" lg="3">
              <Card className="card-bordered">
                <div className="card-inner text-center">
                  <div className="card-title-group align-start mb-3">
                    <div className="card-tools">
                      <em className="card-hint-icon icon ni ni-growth text-info" style={{ fontSize: '2rem' }}></em>
                    </div>
                  </div>
                  <div className="card-title">
                    <h6 className="title">Market Analytics</h6>
                  </div>
                  <Button color="info" size="sm">
                    View Analytics
                  </Button>
                </div>
              </Card>
            </Col>
            <Col sm="6" lg="3">
              <Card className="card-bordered">
                <div className="card-inner text-center">
                  <div className="card-title-group align-start mb-3">
                    <div className="card-tools">
                      <em className="card-hint-icon icon ni ni-chat-circle text-warning" style={{ fontSize: '2rem' }}></em>
                    </div>
                  </div>
                  <div className="card-title">
                    <h6 className="title">Inquiries</h6>
                  </div>
                  <Button color="warning" size="sm">
                    Manage Inquiries
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
        </Block>
      </Content>
    </>
  );
};

export default PropertiesDashboard;
