import React, { useState } from "react";
import Head from "@/layout/head/Head";
import Content from "@/layout/content/Content";
import {
  Block,
  BlockHead,
  BlockContent,
  BlockTitle,
  Button,
  Icon,
  BlockBetween,
  BlockHeadContent,
  Row,
  Col,
} from "@/components/Component";

const Analytics = () => {
  const [timeFilter, setTimeFilter] = useState("this_month");

  // Mock analytics data
  const performanceMetrics = {
    totalAUM: 15750000, // Assets Under Management
    totalInvestors: 1245,
    averageInvestment: 12650,
    portfolioReturn: 8.75,
    newInvestorsThisMonth: 87,
    totalOrders: 2156,
    completionRate: 94.2,
    customerSatisfaction: 4.6,
  };

  const fundPerformance = [
    { name: "Growth Fund Alpha", aum: 6500000, investors: 432, return: 12.3, risk: "High" },
    { name: "Conservative Bond Fund", aum: 4200000, investors: 387, return: 6.8, risk: "Low" },
    { name: "Equity Growth Fund", aum: 3100000, investors: 298, return: 9.5, risk: "Medium" },
    { name: "Money Market Fund", aum: 1950000, investors: 128, return: 4.2, risk: "Low" },
  ];

  const recentMetrics = {
    monthlyGrowth: [
      { month: "Jan", investment: 1200000, redemption: 300000, net: 900000 },
      { month: "Feb", investment: 1450000, redemption: 280000, net: 1170000 },
      { month: "Mar", investment: 1350000, redemption: 420000, net: 930000 },
      { month: "Apr", investment: 1680000, redemption: 350000, net: 1330000 },
    ],
  };

  const topPerformers = [
    { name: "Growth Fund Alpha", return: "+12.3%", change: "up" },
    { name: "Equity Growth Fund", return: "+9.5%", change: "up" },
    { name: "Conservative Bond Fund", return: "+6.8%", change: "up" },
    { name: "Money Market Fund", return: "+4.2%", change: "down" },
  ];

  return (
    <React.Fragment>
      <Head title="Investment Analytics" />
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page>Investment Analytics</BlockTitle>
              <p className="text-soft">Comprehensive insights into your investment platform performance</p>
            </BlockHeadContent>
            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle">
                <Button color="light" outline className="btn-white btn-dim btn-sm me-2">
                  <Icon name="download" />
                  <span>Export Report</span>
                </Button>
                <select 
                  className="form-select form-select-sm"
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  style={{ width: "auto", display: "inline-block" }}
                >
                  <option value="this_week">This Week</option>
                  <option value="this_month">This Month</option>
                  <option value="last_3_months">Last 3 Months</option>
                  <option value="this_year">This Year</option>
                </select>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        <Block>
          <BlockContent>
            {/* Key Performance Metrics */}
            <Row className="g-gs mb-4">
              <Col sm="6" lg="3">
                <div className="card card-bordered h-100">
                  <div className="card-inner">
                    <div className="card-title-group align-start mb-0">
                      <div className="card-title">
                        <h6 className="title">Total AUM</h6>
                      </div>
                      <div className="card-tools">
                        <em className="card-hint-icon icon ni ni-growth text-success"></em>
                      </div>
                    </div>
                    <div className="card-amount">
                      <span className="amount text-success">KES {performanceMetrics.totalAUM.toLocaleString()}</span>
                      <span className="change up text-success">
                        <em className="icon ni ni-arrow-up"></em>8.5%
                      </span>
                    </div>
                  </div>
                </div>
              </Col>
              
              <Col sm="6" lg="3">
                <div className="card card-bordered h-100">
                  <div className="card-inner">
                    <div className="card-title-group align-start mb-0">
                      <div className="card-title">
                        <h6 className="title">Total Investors</h6>
                      </div>
                      <div className="card-tools">
                        <em className="card-hint-icon icon ni ni-users text-primary"></em>
                      </div>
                    </div>
                    <div className="card-amount">
                      <span className="amount text-primary">{performanceMetrics.totalInvestors.toLocaleString()}</span>
                      <span className="sub-text">+{performanceMetrics.newInvestorsThisMonth} this month</span>
                    </div>
                  </div>
                </div>
              </Col>

              <Col sm="6" lg="3">
                <div className="card card-bordered h-100">
                  <div className="card-inner">
                    <div className="card-title-group align-start mb-0">
                      <div className="card-title">
                        <h6 className="title">Portfolio Return</h6>
                      </div>
                      <div className="card-tools">
                        <em className="card-hint-icon icon ni ni-trend-up text-info"></em>
                      </div>
                    </div>
                    <div className="card-amount">
                      <span className="amount text-info">{performanceMetrics.portfolioReturn}%</span>
                      <span className="change up text-success">
                        <em className="icon ni ni-arrow-up"></em>1.2%
                      </span>
                    </div>
                  </div>
                </div>
              </Col>

              <Col sm="6" lg="3">
                <div className="card card-bordered h-100">
                  <div className="card-inner">
                    <div className="card-title-group align-start mb-0">
                      <div className="card-title">
                        <h6 className="title">Avg Investment</h6>
                      </div>
                      <div className="card-tools">
                        <em className="card-hint-icon icon ni ni-wallet text-warning"></em>
                      </div>
                    </div>
                    <div className="card-amount">
                      <span className="amount text-warning">KES {performanceMetrics.averageInvestment.toLocaleString()}</span>
                      <span className="sub-text">Per investor</span>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

            {/* Charts Row */}
            <Row className="g-gs mb-4">
              <Col lg="8">
                <div className="card card-bordered h-100">
                  <div className="card-inner">
                    <div className="card-title-group">
                      <div className="card-title">
                        <h6 className="title">Investment Flow Trend</h6>
                      </div>
                      <div className="card-tools">
                        <em className="card-hint-icon icon ni ni-help-fill" 
                            data-toggle="tooltip" 
                            title="Monthly investment vs redemption flows"></em>
                      </div>
                    </div>
                    <div className="card-amount">
                      <div className="placeholder-chart bg-light rounded" style={{ height: "300px" }}>
                        <div className="d-flex align-items-center justify-content-center h-100">
                          <div className="text-center">
                            <Icon name="bar-chart" className="text-muted" style={{ fontSize: "3rem" }} />
                            <div className="text-muted mt-2">Investment Flow Chart</div>
                            <div className="small text-muted">Shows monthly inflows vs outflows</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              
              <Col lg="4">
                <div className="card card-bordered h-100">
                  <div className="card-inner">
                    <div className="card-title-group">
                      <div className="card-title">
                        <h6 className="title">Fund Allocation</h6>
                      </div>
                    </div>
                    <div className="card-amount">
                      <div className="placeholder-chart bg-light rounded" style={{ height: "300px" }}>
                        <div className="d-flex align-items-center justify-content-center h-100">
                          <div className="text-center">
                            <Icon name="pie-chart" className="text-muted" style={{ fontSize: "3rem" }} />
                            <div className="text-muted mt-2">Asset Allocation</div>
                            <div className="small text-muted">Distribution by fund type</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

            {/* Fund Performance Table */}
            <Row className="g-gs mb-4">
              <Col lg="8">
                <div className="card card-bordered h-100">
                  <div className="card-inner">
                    <div className="card-title-group">
                      <div className="card-title">
                        <h6 className="title">Fund Performance Overview</h6>
                      </div>
                    </div>
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Fund Name</th>
                            <th>AUM</th>
                            <th>Investors</th>
                            <th>Return (%)</th>
                            <th>Risk Level</th>
                          </tr>
                        </thead>
                        <tbody>
                          {fundPerformance.map((fund, index) => (
                            <tr key={index}>
                              <td>
                                <span className="tb-lead">{fund.name}</span>
                              </td>
                              <td>
                                <span className="tb-amount">KES {fund.aum.toLocaleString()}</span>
                              </td>
                              <td>
                                <span>{fund.investors}</span>
                              </td>
                              <td>
                                <span className="text-success">+{fund.return}%</span>
                              </td>
                              <td>
                                <span className={`badge badge-outline-${
                                  fund.risk === "High" ? "danger" : 
                                  fund.risk === "Medium" ? "warning" : "success"
                                }`}>
                                  {fund.risk}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </Col>

              <Col lg="4">
                <div className="card card-bordered h-100">
                  <div className="card-inner">
                    <div className="card-title-group">
                      <div className="card-title">
                        <h6 className="title">Top Performers</h6>
                      </div>
                    </div>
                    <div className="card-amount">
                      <ul className="list-group list-group-flush">
                        {topPerformers.map((performer, index) => (
                          <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                              <span className="tb-lead">{performer.name}</span>
                            </div>
                            <div className="text-end">
                              <span className={`text-${performer.change === "up" ? "success" : "danger"}`}>
                                {performer.return}
                              </span>
                              <div>
                                <Icon 
                                  name={`arrow-${performer.change === "up" ? "up" : "down"}`} 
                                  className={`text-${performer.change === "up" ? "success" : "danger"}`}
                                />
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

            {/* Additional Metrics */}
            <Row className="g-gs">
              <Col sm="6" lg="3">
                <div className="card card-bordered h-100">
                  <div className="card-inner">
                    <div className="card-title-group align-start mb-0">
                      <div className="card-title">
                        <h6 className="title">Order Completion</h6>
                      </div>
                    </div>
                    <div className="card-amount">
                      <span className="amount text-success">{performanceMetrics.completionRate}%</span>
                      <span className="sub-text">Success rate</span>
                    </div>
                  </div>
                </div>
              </Col>

              <Col sm="6" lg="3">
                <div className="card card-bordered h-100">
                  <div className="card-inner">
                    <div className="card-title-group align-start mb-0">
                      <div className="card-title">
                        <h6 className="title">Total Orders</h6>
                      </div>
                    </div>
                    <div className="card-amount">
                      <span className="amount text-primary">{performanceMetrics.totalOrders.toLocaleString()}</span>
                      <span className="sub-text">All time</span>
                    </div>
                  </div>
                </div>
              </Col>

              <Col sm="6" lg="3">
                <div className="card card-bordered h-100">
                  <div className="card-inner">
                    <div className="card-title-group align-start mb-0">
                      <div className="card-title">
                        <h6 className="title">Customer Rating</h6>
                      </div>
                    </div>
                    <div className="card-amount">
                      <span className="amount text-warning">{performanceMetrics.customerSatisfaction}/5</span>
                      <span className="sub-text">Satisfaction score</span>
                    </div>
                  </div>
                </div>
              </Col>

              <Col sm="6" lg="3">
                <div className="card card-bordered h-100">
                  <div className="card-inner">
                    <div className="card-title-group align-start mb-0">
                      <div className="card-title">
                        <h6 className="title">Monthly Growth</h6>
                      </div>
                    </div>
                    <div className="card-amount">
                      <span className="amount text-info">+8.5%</span>
                      <span className="sub-text">AUM growth</span>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </BlockContent>
        </Block>
      </Content>
    </React.Fragment>
  );
};

export default Analytics;











