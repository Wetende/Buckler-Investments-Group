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
  const [period, setPeriod] = useState("30d");

  const metrics = {
    totalListings: 1247,
    totalViews: 184523,
    totalInquiries: 3245,
    avgTimeOnPage: "2m 14s",
    conversionRate: 2.4,
    topLocations: [
      { name: "Karen", views: 24562, inquiries: 342 },
      { name: "Westlands", views: 22311, inquiries: 315 },
      { name: "Kileleshwa", views: 18544, inquiries: 291 },
    ],
  };

  return (
    <React.Fragment>
      <Head title="Property Analytics" />
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page>Property Analytics</BlockTitle>
            </BlockHeadContent>
            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle">
                <select 
                  className="form-select form-select-sm"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  style={{ width: "auto" }}
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                </select>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        <Block>
          <BlockContent>
            <Row className="g-gs mb-4">
              <Col sm="6" lg="3">
                <div className="card card-bordered h-100">
                  <div className="card-inner">
                    <div className="card-title-group align-start mb-0">
                      <div className="card-title">
                        <h6 className="title">Total Listings</h6>
                      </div>
                      <div className="card-tools">
                        <em className="card-hint-icon icon ni ni-home text-primary"></em>
                      </div>
                    </div>
                    <div className="card-amount">
                      <span className="amount text-primary">{metrics.totalListings}</span>
                    </div>
                  </div>
                </div>
              </Col>

              <Col sm="6" lg="3">
                <div className="card card-bordered h-100">
                  <div className="card-inner">
                    <div className="card-title-group align-start mb-0">
                      <div className="card-title">
                        <h6 className="title">Total Views</h6>
                      </div>
                      <div className="card-tools">
                        <em className="card-hint-icon icon ni ni-eye text-info"></em>
                      </div>
                    </div>
                    <div className="card-amount">
                      <span className="amount text-info">{metrics.totalViews.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </Col>

              <Col sm="6" lg="3">
                <div className="card card-bordered h-100">
                  <div className="card-inner">
                    <div className="card-title-group align-start mb-0">
                      <div className="card-title">
                        <h6 className="title">Total Inquiries</h6>
                      </div>
                      <div className="card-tools">
                        <em className="card-hint-icon icon ni ni-chat text-success"></em>
                      </div>
                    </div>
                    <div className="card-amount">
                      <span className="amount text-success">{metrics.totalInquiries.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </Col>

              <Col sm="6" lg="3">
                <div className="card card-bordered h-100">
                  <div className="card-inner">
                    <div className="card-title-group align-start mb-0">
                      <div className="card-title">
                        <h6 className="title">Conversion Rate</h6>
                      </div>
                      <div className="card-tools">
                        <em className="card-hint-icon icon ni ni-activity text-warning"></em>
                      </div>
                    </div>
                    <div className="card-amount">
                      <span className="amount text-warning">{metrics.conversionRate}%</span>
                      <span className="sub-text">views → inquiries</span>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

            <Row className="g-gs">
              <Col lg="8">
                <div className="card card-bordered h-100">
                  <div className="card-inner">
                    <div className="card-title-group">
                      <div className="card-title">
                        <h6 className="title">Views & Inquiries Trend</h6>
                      </div>
                    </div>
                    <div className="placeholder-chart bg-light rounded" style={{ height: "280px" }}>
                      <div className="d-flex align-items-center justify-content-center h-100">
                        <span className="text-muted">Chart Placeholder</span>
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
                        <h6 className="title">Top Locations</h6>
                      </div>
                    </div>
                    <ul className="nk-tb-list">
                      {metrics.topLocations.map((loc, idx) => (
                        <li key={idx} className="nk-tb-item d-flex justify-content-between">
                          <span className="tb-lead">{loc.name}</span>
                          <span className="text-soft">{loc.views.toLocaleString()} views / {loc.inquiries} inquiries</span>
                        </li>
                      ))}
                    </ul>
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


