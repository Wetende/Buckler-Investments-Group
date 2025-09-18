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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { useBnbEarnings } from "@/hooks/useBnb";
import { toast } from "react-toastify";

const Earnings = () => {
  const [sm, updateSm] = useState(false);
  const [timeframe, setTimeframe] = useState("monthly");
  const [statusFilter, setStatusFilter] = useState("all");

  // API hooks for real data
  const { data: earningsData, isLoading, error, refetch } = useBnbEarnings({
    timeframe,
    status: statusFilter === 'all' ? undefined : statusFilter
  });

  const earnings = earningsData?.items || [];
  const chartData = earningsData?.chart_data || [];
  const propertyBreakdown = earningsData?.property_breakdown || [];

  // Mock earnings data (fallback if no real data)
  const mockEarnings = [
    {
      id: "E001",
      booking: "BNB001",
      property: "Luxury Villa in Karen",
      guest: "James Mwangi",
      checkIn: "2024-01-15",
      checkOut: "2024-01-18",
      nights: 3,
      amount: 45000,
      commission: 4500,
      netEarnings: 40500,
      status: "completed",
      payoutDate: "2024-01-19"
    },
    {
      id: "E002",
      booking: "BNB003",
      property: "Beach House - Diani",
      guest: "Peter Ochieng",
      checkIn: "2024-01-25",
      checkOut: "2024-01-30",
      nights: 5,
      amount: 60000,
      commission: 6000,
      netEarnings: 54000,
      status: "completed",
      payoutDate: "2024-01-31"
    },
    {
      id: "E003",
      booking: "BNB005",
      property: "Modern Apartment - Westlands",
      guest: "Grace Wanjiku",
      checkIn: "2024-01-20",
      checkOut: "2024-01-22",
      nights: 2,
      amount: 17000,
      commission: 1700,
      netEarnings: 15300,
      status: "pending",
      payoutDate: null
    }
  ];

  // Mock chart data
  const monthlyData = [
    { month: "Aug", earnings: 185000, bookings: 12 },
    { month: "Sep", earnings: 220000, bookings: 15 },
    { month: "Oct", earnings: 195000, bookings: 13 },
    { month: "Nov", earnings: 240000, bookings: 16 },
    { month: "Dec", earnings: 310000, bookings: 22 },
    { month: "Jan", earnings: 280000, bookings: 18 }
  ];

  const propertyEarnings = [
    { property: "Luxury Villa", earnings: 485000 },
    { property: "Beach House", earnings: 368000 },
    { property: "Modern Apartment", earnings: 255000 },
    { property: "Cozy Studio", earnings: 128000 }
  ];

  // Use real earnings data if available, otherwise fallback to mock data
  const earningsToUse = earnings.length > 0 ? earnings : mockEarnings;
  
  const metrics = earningsData?.summary || {
    totalEarnings: earningsToUse.reduce((sum, e) => sum + (e.net_earnings || e.netEarnings || 0), 0),
    pendingPayout: earningsToUse.filter(e => e.status === 'pending').reduce((sum, e) => sum + (e.net_earnings || e.netEarnings || 0), 0),
    completedEarnings: earningsToUse.filter(e => e.status === 'completed').reduce((sum, e) => sum + (e.net_earnings || e.netEarnings || 0), 0),
    averagePerBooking: earningsToUse.length > 0 ? Math.round(earningsToUse.reduce((sum, e) => sum + (e.net_earnings || e.netEarnings || 0), 0) / earningsToUse.length) : 0,
    totalCommission: earningsToUse.reduce((sum, e) => sum + (e.commission || 0), 0)
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

  // Loading state
  if (isLoading) {
    return (
      <React.Fragment>
        <Head title="Earnings" />
        <Content>
          <BlockHead size="sm">
            <BlockBetween>
              <BlockHeadContent>
                <BlockTitle page>Earnings</BlockTitle>
                <BlockDes className="text-soft">
                  <p>Loading earnings data...</p>
                </BlockDes>
              </BlockHeadContent>
            </BlockBetween>
          </BlockHead>
          <Block>
            <div className="d-flex justify-content-center p-4">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          </Block>
        </Content>
      </React.Fragment>
    );
  }

  // Error state
  if (error) {
    return (
      <React.Fragment>
        <Head title="Earnings" />
        <Content>
          <BlockHead size="sm">
            <BlockBetween>
              <BlockHeadContent>
                <BlockTitle page>Earnings</BlockTitle>
                <BlockDes className="text-soft">
                  <p>Error loading earnings data.</p>
                </BlockDes>
              </BlockHeadContent>
            </BlockBetween>
          </BlockHead>
          <Block>
            <div className="alert alert-danger">
              <h6>Error Loading Earnings</h6>
              <p>{error.message}</p>
              <Button color="primary" outline onClick={() => refetch()}>
                Try Again
              </Button>
            </div>
          </Block>
        </Content>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Head title="Earnings" />
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page>Earnings</BlockTitle>
              <BlockDes className="text-soft">
                <p>Track your income and payout history from property bookings.</p>
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
                      <h6 className="subtitle">Avg. Per Booking</h6>
                    </div>
                    <div className="card-tools">
                      <Icon name="trending-up" className="card-hint-icon text-success"></Icon>
                    </div>
                  </div>
                  <div className="card-amount">
                    <span className="amount">{formatCurrency(metrics.averagePerBooking)}</span>
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

        {/* Charts */}
        <Block>
          <Row className="g-gs">
            <Col xxl="8">
              <Card className="card-bordered card-full">
                <CardBody className="card-inner">
                  <div className="card-title-group">
                    <div className="card-title">
                      <h6 className="title">Earnings Trend</h6>
                    </div>
                    <div className="card-tools">
                      <select 
                        className="form-select form-select-sm"
                        value={timeframe}
                        onChange={(e) => setTimeframe(e.target.value)}
                      >
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </div>
                  </div>
                  <div className="nk-iv-wg2">
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chartData.length > 0 ? chartData : monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Line 
                          type="monotone" 
                          dataKey="earnings" 
                          stroke="#526484" 
                          strokeWidth={2}
                          dot={{ fill: '#526484' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xxl="4">
              <Card className="card-bordered card-full">
                <CardBody className="card-inner">
                  <div className="card-title-group">
                    <div className="card-title">
                      <h6 className="title">Earnings by Property</h6>
                    </div>
                  </div>
                  <div className="nk-iv-wg2">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={propertyBreakdown.length > 0 ? propertyBreakdown : propertyEarnings} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="property" type="category" width={80} />
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Bar dataKey="earnings" fill="#526484" />
                      </BarChart>
                    </ResponsiveContainer>
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
                <div className="card-tools">
                  <div className="form-inline flex-nowrap gx-3">
                    <div className="form-wrap w-150px">
                      <select 
                        className="form-select" 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value="all">All Status</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
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
                  <span className="sub-text">Booking ID</span>
                </DataTableRow>
                <DataTableRow size="md">
                  <span className="sub-text">Property</span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text">Stay Details</span>
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
              {earningsToUse.map((earning) => (
                <DataTableItem key={earning.id}>
                  <DataTableRow>
                    <div>
                      <span className="tb-lead">{earning.booking_id || earning.booking}</span>
                      <div className="tb-sub text-muted small">
                        {earning.guest_name || earning.guest}
                      </div>
                    </div>
                  </DataTableRow>
                  <DataTableRow size="md">
                    <span className="tb-lead">{earning.property_title || earning.property}</span>
                  </DataTableRow>
                  <DataTableRow size="lg">
                    <div>
                      <div className="tb-sub">
                        <Icon name="calendar" className="mr-1"></Icon>
                        {formatDate(earning.check_in || earning.checkIn)} - {formatDate(earning.check_out || earning.checkOut)}
                      </div>
                      <div className="tb-sub">
                        <Icon name="clock" className="mr-1"></Icon>
                        {earning.nights || earning.duration || 0} nights
                      </div>
                    </div>
                  </DataTableRow>
                  <DataTableRow size="md">
                    <div>
                      <span className="tb-amount">{formatCurrency(earning.net_earnings || earning.netEarnings || 0)}</span>
                      <div className="tb-sub text-muted">
                        Gross: {formatCurrency(earning.total_amount || earning.amount || 0)}
                      </div>
                      <div className="tb-sub text-muted">
                        Fee: {formatCurrency(earning.commission || 0)}
                      </div>
                    </div>
                  </DataTableRow>
                  <DataTableRow size="md">
                    <Badge color={getStatusColor(earning.status)}>
                      {earning.status}
                    </Badge>
                  </DataTableRow>
                  <DataTableRow size="md">
                    <span className="tb-lead">{formatDate(earning.payout_date || earning.payoutDate)}</span>
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

export default Earnings;

