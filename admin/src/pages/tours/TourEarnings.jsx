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
  Badge,
  BlockBetween,
} from "@/components/Component";
import { Card, CardBody } from "reactstrap";

const TourEarnings = () => {
  const [sm, updateSm] = useState(false);

  // Mock earnings data for tours
  const earnings = [
    {
      id: "TE001",
      booking: "TOR001",
      tour: "Maasai Mara Safari Adventure",
      customer: "James Mwangi",
      tourDate: "2024-02-15",
      participants: 4,
      amount: 100000,
      commission: 10000,
      netEarnings: 90000,
      status: "completed",
      payoutDate: "2024-02-18"
    },
    {
      id: "TE002",
      booking: "TOR003",
      tour: "Coastal Cultural Experience",
      customer: "Peter Ochieng",
      tourDate: "2024-02-10",
      participants: 6,
      amount: 108000,
      commission: 10800,
      netEarnings: 97200,
      status: "completed",
      payoutDate: "2024-02-12"
    },
    {
      id: "TE003",
      booking: "TOR002",
      tour: "Mount Kenya Hiking Expedition",
      customer: "Grace Wanjiku",
      tourDate: "2024-02-20",
      participants: 2,
      amount: 90000,
      commission: 9000,
      netEarnings: 81000,
      status: "pending",
      payoutDate: null
    }
  ];

  const metrics = {
    totalEarnings: earnings.reduce((sum, e) => sum + e.netEarnings, 0),
    pendingPayout: earnings.filter(e => e.status === 'pending').reduce((sum, e) => sum + e.netEarnings, 0),
    completedEarnings: earnings.filter(e => e.status === 'completed').reduce((sum, e) => sum + e.netEarnings, 0),
    averagePerTour: Math.round(earnings.reduce((sum, e) => sum + e.netEarnings, 0) / earnings.length),
    totalCommission: earnings.reduce((sum, e) => sum + e.commission, 0)
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Pending";
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'processing': return 'info';
      default: return 'light';
    }
  };

  return (
    <React.Fragment>
      <Head title="Tour Earnings" />
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page>Tour Earnings</BlockTitle>
              <BlockDes className="text-soft">
                <p>Track your tour income and payout history.</p>
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
                        <span>Export Report</span>
                      </Button>
                    </li>
                    <li>
                      <Button color="primary" outline>
                        <Icon name="wallet"></Icon>
                        <span>Request Payout</span>
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
                      <h6 className="subtitle">Total Earnings</h6>
                    </div>
                    <div className="card-tools">
                      <Icon name="coins" className="card-hint-icon text-primary"></Icon>
                    </div>
                  </div>
                  <div className="card-amount">
                    <span className="amount">{formatCurrency(metrics.totalEarnings)}</span>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xxl="3" sm="6">
              <Card className="card-bordered">
                <CardBody className="card-inner">
                  <div className="card-title-group align-start mb-0">
                    <div className="card-title">
                      <h6 className="subtitle">Pending Payout</h6>
                    </div>
                    <div className="card-tools">
                      <Icon name="clock" className="card-hint-icon text-warning"></Icon>
                    </div>
                  </div>
                  <div className="card-amount">
                    <span className="amount">{formatCurrency(metrics.pendingPayout)}</span>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xxl="3" sm="6">
              <Card className="card-bordered">
                <CardBody className="card-inner">
                  <div className="card-title-group align-start mb-0">
                    <div className="card-title">
                      <h6 className="subtitle">Avg. Per Tour</h6>
                    </div>
                    <div className="card-tools">
                      <Icon name="trending-up" className="card-hint-icon text-success"></Icon>
                    </div>
                  </div>
                  <div className="card-amount">
                    <span className="amount">{formatCurrency(metrics.averagePerTour)}</span>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xxl="3" sm="6">
              <Card className="card-bordered">
                <CardBody className="card-inner">
                  <div className="card-title-group align-start mb-0">
                    <div className="card-title">
                      <h6 className="subtitle">Platform Fees</h6>
                    </div>
                    <div className="card-tools">
                      <Icon name="percent" className="card-hint-icon text-info"></Icon>
                    </div>
                  </div>
                  <div className="card-amount">
                    <span className="amount">{formatCurrency(metrics.totalCommission)}</span>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Block>

        {/* Earnings Table */}
        <Block>
          <DataTable className="card-stretch">
            <div className="card-inner position-relative card-tools-toggle">
              <div className="card-title-group">
                <div className="card-title">
                  <h6 className="title">Recent Earnings</h6>
                </div>
              </div>
            </div>
            <DataTableBody>
              <DataTableHead className="nk-tb-item nk-tb-head">
                <DataTableRow>
                  <span className="sub-text">Booking ID</span>
                </DataTableRow>
                <DataTableRow size="md">
                  <span className="sub-text">Tour</span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text">Tour Details</span>
                </DataTableRow>
                <DataTableRow size="md">
                  <span className="sub-text">Earnings</span>
                </DataTableRow>
                <DataTableRow size="md">
                  <span className="sub-text">Status</span>
                </DataTableRow>
                <DataTableRow size="md">
                  <span className="sub-text">Payout Date</span>
                </DataTableRow>
              </DataTableHead>
              {earnings.map((earning) => (
                <DataTableItem key={earning.id}>
                  <DataTableRow>
                    <div>
                      <span className="tb-lead">{earning.booking}</span>
                      <div className="tb-sub text-muted small">
                        {earning.customer}
                      </div>
                    </div>
                  </DataTableRow>
                  <DataTableRow size="md">
                    <span className="tb-lead">{earning.tour}</span>
                  </DataTableRow>
                  <DataTableRow size="lg">
                    <div>
                      <div className="tb-sub">
                        <Icon name="calendar" className="mr-1"></Icon>
                        {formatDate(earning.tourDate)}
                      </div>
                      <div className="tb-sub">
                        <Icon name="users" className="mr-1"></Icon>
                        {earning.participants} participants
                      </div>
                    </div>
                  </DataTableRow>
                  <DataTableRow size="md">
                    <div>
                      <span className="tb-amount">{formatCurrency(earning.netEarnings)}</span>
                      <div className="tb-sub text-muted">
                        Gross: {formatCurrency(earning.amount)}
                      </div>
                      <div className="tb-sub text-muted">
                        Fee: {formatCurrency(earning.commission)}
                      </div>
                    </div>
                  </DataTableRow>
                  <DataTableRow size="md">
                    <Badge color={getStatusColor(earning.status)}>
                      {earning.status}
                    </Badge>
                  </DataTableRow>
                  <DataTableRow size="md">
                    <span className="tb-lead">{formatDate(earning.payoutDate)}</span>
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

export default TourEarnings;








