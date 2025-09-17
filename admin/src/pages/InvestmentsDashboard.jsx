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

const InvestmentsDashboard = () => {
  const [sm, updateSm] = useState(false);

  // Mock data for Investments metrics
  const investmentMetrics = {
    totalAUM: 45000000,
    activeInvestors: 234,
    monthlyInflow: 3200000,
    averageNAV: 1.245,
    totalProducts: 12,
    performanceReturn: 18.5
  };

  const recentInvestments = [
    { id: 1, investor: "Catherine Njeri", product: "Balanced Growth Fund", amount: 150000, date: "2024-01-15", status: "completed" },
    { id: 2, investor: "Robert Kimani", product: "Real Estate REIT", amount: 500000, date: "2024-01-16", status: "pending" },
    { id: 3, investor: "Mary Wanjiku", product: "Money Market Fund", amount: 75000, date: "2024-01-17", status: "completed" },
  ];

  const productPerformance = [
    { name: "Balanced Growth Fund", nav: 1.245, return: 18.5, aum: 15000000 },
    { name: "Real Estate REIT", nav: 1.180, return: 15.2, aum: 12000000 },
    { name: "Money Market Fund", nav: 1.089, return: 8.9, aum: 8500000 },
    { name: "Equity Fund", nav: 1.320, return: 22.1, aum: 9500000 },
  ];

  const portfolioAnalytics = [
    { metric: "Total Portfolio Value", value: "KES 45.0M", change: "+12.8%", trend: "up" },
    { metric: "Monthly Inflows", value: "KES 3.2M", change: "+24.5%", trend: "up" },
    { metric: "Average NAV", value: "1.245", change: "+8.2%", trend: "up" },
    { metric: "Active Products", value: "12", change: "+2", trend: "up" },
  ];

  return (
    <>
      <Head title="Investments Dashboard" />
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page tag="h3">
                Investments Dashboard
              </BlockTitle>
              <BlockDes className="text-soft">
                <p>Manage investment products, portfolios, and investor relations</p>
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
                        <span>Add Product</span>
                      </Button>
                    </li>
                    <li>
                      <Button color="light" className="btn-outline-light btn-white">
                        <Icon name="download-cloud" />
                        <span>Portfolio Report</span>
                      </Button>
                    </li>
                  </ul>
                </div>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        {/* Investment Metrics Cards */}
        <Block>
          <Row className="g-gs">
            <Col xxl="3" sm="6">
              <PreviewCard>
                <div className="card-inner">
                  <div className="card-title-group align-start mb-0">
                    <div className="card-title">
                      <h6 className="subtitle">Assets Under Management</h6>
                    </div>
                    <div className="card-tools">
                      <em className="card-hint-icon icon ni ni-coins text-primary"></em>
                    </div>
                  </div>
                  <div className="card-amount">
                    <span className="amount">KES {(investmentMetrics.totalAUM / 1000000).toFixed(1)}M</span>
                    <span className="change up text-success">
                      <Icon name="arrow-long-up" />
                      12.8%
                    </span>
                  </div>
                  <div className="card-amount-sm">Total investment portfolio</div>
                </div>
              </PreviewCard>
            </Col>

            <Col xxl="3" sm="6">
              <PreviewCard>
                <div className="card-inner">
                  <div className="card-title-group align-start mb-0">
                    <div className="card-title">
                      <h6 className="subtitle">Active Investors</h6>
                    </div>
                    <div className="card-tools">
                      <em className="card-hint-icon icon ni ni-users-fill text-info"></em>
                    </div>
                  </div>
                  <div className="card-amount">
                    <span className="amount">{investmentMetrics.activeInvestors}</span>
                    <span className="change up text-success">
                      <Icon name="arrow-long-up" />
                      18.3%
                    </span>
                  </div>
                  <div className="card-amount-sm">Registered investors</div>
                </div>
              </PreviewCard>
            </Col>

            <Col xxl="3" sm="6">
              <PreviewCard>
                <div className="card-inner">
                  <div className="card-title-group align-start mb-0">
                    <div className="card-title">
                      <h6 className="subtitle">Monthly Inflows</h6>
                    </div>
                    <div className="card-tools">
                      <em className="card-hint-icon icon ni ni-growth text-success"></em>
                    </div>
                  </div>
                  <div className="card-amount">
                    <span className="amount">KES {(investmentMetrics.monthlyInflow / 1000000).toFixed(1)}M</span>
                    <span className="change up text-success">
                      <Icon name="arrow-long-up" />
                      24.5%
                    </span>
                  </div>
                  <div className="card-amount-sm">New investments this month</div>
                </div>
              </PreviewCard>
            </Col>

            <Col xxl="3" sm="6">
              <PreviewCard>
                <div className="card-inner">
                  <div className="card-title-group align-start mb-0">
                    <div className="card-title">
                      <h6 className="subtitle">Average Returns</h6>
                    </div>
                    <div className="card-tools">
                      <em className="card-hint-icon icon ni ni-trend-up text-warning"></em>
                    </div>
                  </div>
                  <div className="card-amount">
                    <span className="amount">{investmentMetrics.performanceReturn}%</span>
                    <span className="change up text-success">
                      <Icon name="arrow-long-up" />
                      2.1%
                    </span>
                  </div>
                  <div className="card-amount-sm">12-month average return</div>
                </div>
              </PreviewCard>
            </Col>
          </Row>
        </Block>

        {/* Recent Investments */}
        <Block>
          <BlockHead>
            <BlockHeadContent>
              <BlockTitle tag="h6">Recent Investment Transactions</BlockTitle>
              <p className="text-soft">Latest investment activity and subscriptions</p>
            </BlockHeadContent>
          </BlockHead>
          <Card className="card-bordered">
            <div className="card-inner-group">
              <div className="card-inner p-0">
                <div className="nk-tb-list nk-tb-ulist">
                  <div className="nk-tb-item nk-tb-head">
                    <div className="nk-tb-col"><span className="sub-text">Investor</span></div>
                    <div className="nk-tb-col tb-col-mb"><span className="sub-text">Product</span></div>
                    <div className="nk-tb-col tb-col-md"><span className="sub-text">Amount</span></div>
                    <div className="nk-tb-col tb-col-md"><span className="sub-text">Date</span></div>
                    <div className="nk-tb-col tb-col-md"><span className="sub-text">Status</span></div>
                    <div className="nk-tb-col nk-tb-col-tools text-right">
                      <span className="sub-text">Action</span>
                    </div>
                  </div>
                  {recentInvestments.map((investment) => (
                    <div key={investment.id} className="nk-tb-item">
                      <div className="nk-tb-col">
                        <div className="user-card">
                          <div className="user-avatar bg-warning">
                            <span>{investment.investor.substring(0, 2).toUpperCase()}</span>
                          </div>
                          <div className="user-info">
                            <span className="tb-lead">{investment.investor}</span>
                          </div>
                        </div>
                      </div>
                      <div className="nk-tb-col tb-col-mb">
                        <span className="tb-amount">{investment.product}</span>
                      </div>
                      <div className="nk-tb-col tb-col-md">
                        <span className="tb-amount">KES {investment.amount.toLocaleString()}</span>
                      </div>
                      <div className="nk-tb-col tb-col-md">
                        <span>{investment.date}</span>
                      </div>
                      <div className="nk-tb-col tb-col-md">
                        <span className={`badge badge-outline-${investment.status === 'completed' ? 'success' : 'warning'}`}>
                          {investment.status}
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

        {/* Product Performance and Portfolio Analytics */}
        <Row className="g-gs">
          <Col lg="8">
            <Block>
              <BlockHead>
                <BlockHeadContent>
                  <BlockTitle tag="h6">Investment Product Performance</BlockTitle>
                  <p className="text-soft">NAV performance and returns by product</p>
                </BlockHeadContent>
              </BlockHead>
              <Card className="card-bordered">
                <div className="card-inner">
                  <div className="nk-tb-list nk-tb-ulist">
                    <div className="nk-tb-item nk-tb-head">
                      <div className="nk-tb-col"><span className="sub-text">Product</span></div>
                      <div className="nk-tb-col tb-col-md"><span className="sub-text">NAV</span></div>
                      <div className="nk-tb-col tb-col-md"><span className="sub-text">Return</span></div>
                      <div className="nk-tb-col tb-col-lg"><span className="sub-text">AUM</span></div>
                    </div>
                    {productPerformance.map((product, index) => (
                      <div key={index} className="nk-tb-item">
                        <div className="nk-tb-col">
                          <span className="tb-lead">{product.name}</span>
                        </div>
                        <div className="nk-tb-col tb-col-md">
                          <span className="tb-amount">{product.nav}</span>
                        </div>
                        <div className="nk-tb-col tb-col-md">
                          <span className={`tb-amount text-${product.return > 10 ? 'success' : 'warning'}`}>
                            {product.return}%
                          </span>
                        </div>
                        <div className="nk-tb-col tb-col-lg">
                          <span className="tb-amount">KES {(product.aum / 1000000).toFixed(1)}M</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </Block>
          </Col>

          <Col lg="4">
            <Block>
              <BlockHead>
                <BlockHeadContent>
                  <BlockTitle tag="h6">Portfolio Analytics</BlockTitle>
                  <p className="text-soft">Key performance indicators</p>
                </BlockHeadContent>
              </BlockHead>
              <Card className="card-bordered">
                <div className="card-inner">
                  {portfolioAnalytics.map((metric, index) => (
                    <div key={index} className="nk-wgw sm">
                      <div className="nk-wgw-inner">
                        <div className="nk-wgw-name">
                          <div className="nk-wgw-icon">
                            <Icon name={metric.trend === 'up' ? 'trend-up' : 'trend-down'} 
                                  className={`text-${metric.trend === 'up' ? 'success' : 'danger'}`} />
                          </div>
                          <h6 className="nk-wgw-title title">{metric.metric}</h6>
                        </div>
                        <div className="nk-wgw-stats">
                          <div className="number">{metric.value}</div>
                          <div className={`change ${metric.trend} text-${metric.trend === 'up' ? 'success' : 'danger'}`}>
                            <Icon name={`arrow-long-${metric.trend}`} />
                            {metric.change}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </Block>
          </Col>
        </Row>

        {/* Risk Management and Quick Actions */}
        <Row className="g-gs">
          <Col lg="4">
            <Block>
              <BlockHead>
                <BlockHeadContent>
                  <BlockTitle tag="h6">Risk Management</BlockTitle>
                </BlockHeadContent>
              </BlockHead>
              <Card className="card-bordered">
                <div className="card-inner">
                  <div className="alert alert-info" role="alert">
                    <div className="alert-cta">
                      <h6>Portfolio Risk Score: Moderate</h6>
                      <span>Current risk exposure within acceptable limits</span>
                    </div>
                  </div>
                  <div className="nk-wgw sm">
                    <div className="nk-wgw-inner">
                      <div className="nk-wgw-name">
                        <h6 className="nk-wgw-title">Diversification Score</h6>
                      </div>
                      <div className="nk-wgw-stats">
                        <div className="number large">85%</div>
                      </div>
                    </div>
                  </div>
                  <Button color="info" size="sm" className="w-100">
                    View Risk Analysis
                  </Button>
                </div>
              </Card>
            </Block>
          </Col>

          <Col lg="8">
            <Block>
              <BlockHead>
                <BlockHeadContent>
                  <BlockTitle tag="h6">Quick Actions</BlockTitle>
                </BlockHeadContent>
              </BlockHead>
              <Row className="g-3">
                <Col sm="6" md="3">
                  <Card className="card-bordered">
                    <div className="card-inner text-center">
                      <div className="card-title-group mb-3">
                        <em className="card-hint-icon icon ni ni-coins text-primary" style={{ fontSize: '2rem' }}></em>
                      </div>
                      <h6 className="title">Products</h6>
                      <Button color="primary" size="sm">
                        Manage Products
                      </Button>
                    </div>
                  </Card>
                </Col>
                <Col sm="6" md="3">
                  <Card className="card-bordered">
                    <div className="card-inner text-center">
                      <div className="card-title-group mb-3">
                        <em className="card-hint-icon icon ni ni-users-fill text-info" style={{ fontSize: '2rem' }}></em>
                      </div>
                      <h6 className="title">Investors</h6>
                      <Button color="info" size="sm">
                        View Investors
                      </Button>
                    </div>
                  </Card>
                </Col>
                <Col sm="6" md="3">
                  <Card className="card-bordered">
                    <div className="card-inner text-center">
                      <div className="card-title-group mb-3">
                        <em className="card-hint-icon icon ni ni-growth text-success" style={{ fontSize: '2rem' }}></em>
                      </div>
                      <h6 className="title">Analytics</h6>
                      <Button color="success" size="sm">
                        Performance
                      </Button>
                    </div>
                  </Card>
                </Col>
                <Col sm="6" md="3">
                  <Card className="card-bordered">
                    <div className="card-inner text-center">
                      <div className="card-title-group mb-3">
                        <em className="card-hint-icon icon ni ni-shield-check text-warning" style={{ fontSize: '2rem' }}></em>
                      </div>
                      <h6 className="title">Compliance</h6>
                      <Button color="warning" size="sm">
                        KYC Reports
                      </Button>
                    </div>
                  </Card>
                </Col>
              </Row>
            </Block>
          </Col>
        </Row>
      </Content>
    </>
  );
};

export default InvestmentsDashboard;
