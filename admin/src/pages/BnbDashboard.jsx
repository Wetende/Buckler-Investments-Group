import React, { useEffect, useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { useBnbListings, useBnbBookings, useBnbEarnings } from "@/hooks/useBnb";
import { axiosPrivate } from "@/api/axios";
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,
  ReferenceLine, Legend
} from "recharts";

const BnbDashboard = () => {
  const [sm, updateSm] = useState(false);
  const [role, setRole] = useState('USER');
  const navigate = useNavigate();

  // Analytics data and helper functions
  const generateRevenueData = () => [
    { month: 'Jan', revenue: 85000, bookings: 45, occupancy: 68 },
    { month: 'Feb', revenue: 92000, bookings: 52, occupancy: 72 },
    { month: 'Mar', revenue: 78000, bookings: 38, occupancy: 65 },
    { month: 'Apr', revenue: 105000, bookings: 58, occupancy: 78 },
    { month: 'May', revenue: 118000, bookings: 62, occupancy: 82 },
    { month: 'Jun', revenue: 132000, bookings: 68, occupancy: 85 },
    { month: 'Jul', revenue: 145000, bookings: 72, occupancy: 90 },
    { month: 'Aug', revenue: 138000, bookings: 69, occupancy: 87 },
    { month: 'Sep', revenue: 125000, bookings: 65, occupancy: 83 },
    { month: 'Oct', revenue: 108000, bookings: 58, occupancy: 75 },
    { month: 'Nov', revenue: 95000, bookings: 48, occupancy: 70 },
    { month: 'Dec', revenue: 89000, bookings: 42, occupancy: 68 }
  ];

  const generatePropertyPerformance = () => [
    { property: 'Luxury Villa', revenue: 285000, bookings: 45, rating: 4.9 },
    { property: 'Modern Apartment', revenue: 198000, bookings: 62, rating: 4.7 },
    { property: 'Beach House', revenue: 165000, bookings: 38, rating: 4.8 },
    { property: 'Cozy Studio', revenue: 142000, bookings: 78, rating: 4.6 },
    { property: 'City Loft', revenue: 128000, bookings: 55, rating: 4.5 }
  ];

  const generateBookingSourceData = () => [
    { name: 'Direct Booking', value: 35, color: '#816bff' },
    { name: 'Airbnb', value: 28, color: '#ff6b9d' },
    { name: 'Booking.com', value: 22, color: '#36b9cc' },
    { name: 'Other Platforms', value: 15, color: '#f49342' }
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(value);
  };

  // API hooks for real data
  const { data: listings, isLoading: listingsLoading } = useBnbListings({ limit: 10 });
  const { data: bookings, isLoading: bookingsLoading } = useBnbBookings({ limit: 5, status: 'recent' });
  const { data: earnings, isLoading: earningsLoading } = useBnbEarnings({ period: 'current_month' });

  // Loading states
  const isLoading = listingsLoading || bookingsLoading || earningsLoading;

  useEffect(() => {
    // Fetch current user to determine role (lightweight)
    axiosPrivate.get('/auth/me').then((res) => {
      setRole(res.data.role || 'USER')
    }).catch(() => {
      // ignore
    })
  }, [])

  // Calculate metrics from real data
  const bnbMetrics = {
    totalListings: listings?.total || 0,
    activeBookings: bookings?.active_count || 0,
    totalRevenue: earnings?.total_revenue || 0,
    occupancyRate: earnings?.occupancy_rate || 0,
    averageRating: listings?.average_rating || 0,
    newHosts: listings?.new_hosts_count || 0
  };

  const recentBookings = bookings?.items || [];

  // Show loading state
  if (isLoading) {
    return (
      <>
        <Head title="BnB Dashboard" />
        <Content>
          <BlockHead size="sm">
            <BlockBetween>
              <BlockHeadContent>
                <BlockTitle page tag="h3">BnB Dashboard</BlockTitle>
                <BlockDes className="text-soft">
                  <p>Loading dashboard data...</p>
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
      </>
    );
  }

  return (
    <>
      <Head title="BnB Dashboard" />
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page tag="h3">
                BnB Dashboard
              </BlockTitle>
              <BlockDes className="text-soft">
                <p>Manage short-term rentals, hosts, and bookings</p>
              </BlockDes>
              {role !== 'HOST' && (
                <div className="mt-2">
                  <Button color="warning" onClick={() => navigate('/dashboard/auth-success?become_host=1')}>
                    <Icon name="star" /> Become a Host
                  </Button>
                </div>
              )}
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
                      <Button color="primary" className="btn-white" onClick={() => navigate("/dashboard/bnb/create-listing")}>
                        <Icon name="plus" />
                        <span>Add Listing</span>
                      </Button>
                    </li>
                    <li>
                      <Button color="light" className="btn-outline-light btn-white">
                        <Icon name="download-cloud" />
                        <span>Export</span>
                      </Button>
                    </li>
                  </ul>
                </div>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        {/* BnB Metrics Cards */}
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
                      <em className="card-hint-icon icon ni ni-home-fill text-primary"></em>
                    </div>
                  </div>
                  <div className="card-amount">
                    <span className="amount">{bnbMetrics.totalListings}</span>
                    <span className="change up text-success">
                      <Icon name="arrow-long-up" />
                      12.8%
                    </span>
                  </div>
                  <div className="card-amount-sm">Active properties on platform</div>
                </div>
              </PreviewCard>
            </Col>

            <Col xxl="3" sm="6">
              <PreviewCard>
                <div className="card-inner">
                  <div className="card-title-group align-start mb-0">
                    <div className="card-title">
                      <h6 className="subtitle">Active Bookings</h6>
                    </div>
                    <div className="card-tools">
                      <em className="card-hint-icon icon ni ni-calendar-booking text-info"></em>
                    </div>
                  </div>
                  <div className="card-amount">
                    <span className="amount">{bnbMetrics.activeBookings}</span>
                    <span className="change up text-success">
                      <Icon name="arrow-long-up" />
                      8.5%
                    </span>
                  </div>
                  <div className="card-amount-sm">Current confirmed bookings</div>
                </div>
              </PreviewCard>
            </Col>

            <Col xxl="3" sm="6">
              <PreviewCard>
                <div className="card-inner">
                  <div className="card-title-group align-start mb-0">
                    <div className="card-title">
                      <h6 className="subtitle">Total Revenue</h6>
                    </div>
                    <div className="card-tools">
                      <em className="card-hint-icon icon ni ni-coins text-success"></em>
                    </div>
                  </div>
                  <div className="card-amount">
                    <span className="amount">KES {bnbMetrics.totalRevenue.toLocaleString()}</span>
                    <span className="change up text-success">
                      <Icon name="arrow-long-up" />
                      15.2%
                    </span>
                  </div>
                  <div className="card-amount-sm">This month's earnings</div>
                </div>
              </PreviewCard>
            </Col>

            <Col xxl="3" sm="6">
              <PreviewCard>
                <div className="card-inner">
                  <div className="card-title-group align-start mb-0">
                    <div className="card-title">
                      <h6 className="subtitle">Occupancy Rate</h6>
                    </div>
                    <div className="card-tools">
                      <em className="card-hint-icon icon ni ni-growth text-warning"></em>
                    </div>
                  </div>
                  <div className="card-amount">
                    <span className="amount">{bnbMetrics.occupancyRate}%</span>
                    <span className="change up text-success">
                      <Icon name="arrow-long-up" />
                      3.2%
                    </span>
                  </div>
                  <div className="card-amount-sm">Average across all properties</div>
                </div>
              </PreviewCard>
            </Col>
          </Row>
        </Block>

        {/* Analytics Charts */}
        <Block>
          <Row className="g-gs">
            {/* Revenue Trend Chart */}
            <Col xxl="8" lg="8" md="12">
              <PreviewCard>
                <div className="card-inner">
                  <div className="card-title-group align-start mb-3">
                    <div className="card-title">
                      <h6 className="title">Revenue & Occupancy Trends</h6>
                      <p className="sub-title d-none d-sm-block">Monthly revenue and occupancy rates</p>
                    </div>
                    <div className="card-tools">
                      <em className="card-hint-icon icon ni ni-help-fill" data-toggle="tooltip" title="Revenue and occupancy trends over time"></em>
                    </div>
                  </div>
                  <div className="nk-ov-wg3">
                    <div className="analytic-ov">
                      <ResponsiveContainer width="100%" height={window.innerWidth < 768 ? 250 : 300}>
                        <AreaChart data={generateRevenueData()}>
                          <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#816bff" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#816bff" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorOccupancy" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#ff6b9d" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#ff6b9d" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                          <XAxis dataKey="month" stroke="#9ca3af" />
                          <YAxis yAxisId="left" stroke="#9ca3af" />
                          <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                            formatter={(value, name) => [
                              name === 'revenue' ? formatCurrency(value) : `${value}%`,
                              name === 'revenue' ? 'Revenue' : 'Occupancy Rate'
                            ]}
                          />
                          <Area 
                            yAxisId="left"
                            type="monotone" 
                            dataKey="revenue" 
                            stroke="#816bff" 
                            fillOpacity={1} 
                            fill="url(#colorRevenue)" 
                            strokeWidth={2}
                          />
                          <Line 
                            yAxisId="right"
                            type="monotone" 
                            dataKey="occupancy" 
                            stroke="#ff6b9d" 
                            strokeWidth={2}
                            dot={{ fill: '#ff6b9d', strokeWidth: 2, r: 4 }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </PreviewCard>
            </Col>

            {/* Booking Sources Pie Chart */}
            <Col xxl="4" lg="4" md="12">
              <PreviewCard>
                <div className="card-inner">
                  <div className="card-title-group align-start mb-3">
                    <div className="card-title">
                      <h6 className="title">Booking Sources</h6>
                      <p className="sub-title d-none d-sm-block">Revenue distribution by platform</p>
                    </div>
                  </div>
                  <div className="nk-ov-wg3">
                    <ResponsiveContainer width="100%" height={window.innerWidth < 768 ? 250 : 300}>
                      <PieChart>
                        <Pie
                          data={generateBookingSourceData()}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {generateBookingSourceData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
                        <Legend 
                          wrapperStyle={{ paddingTop: '20px' }}
                          formatter={(value, entry) => (
                            <span style={{ color: entry.color, fontSize: '12px' }}>
                              {value} ({entry.payload.value}%)
                            </span>
                          )}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </PreviewCard>
            </Col>
          </Row>
        </Block>

        {/* Property Performance Chart */}
        <Block>
          <Row className="g-gs">
            <Col xl="12">
              <PreviewCard>
                <div className="card-inner">
                  <div className="card-title-group align-start mb-3">
                    <div className="card-title">
                      <h6 className="title">Property Performance</h6>
                      <p className="sub-title">Revenue and bookings by property</p>
                    </div>
                    <div className="card-tools">
                      <em className="card-hint-icon icon ni ni-help-fill" data-toggle="tooltip" title="Performance metrics for each property"></em>
                    </div>
                  </div>
                  <div className="nk-ov-wg3">
                    <ResponsiveContainer width="100%" height={window.innerWidth < 768 ? 300 : 350}>
                      <BarChart data={generatePropertyPerformance()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                        <XAxis dataKey="property" stroke="#9ca3af" />
                        <YAxis yAxisId="left" stroke="#9ca3af" />
                        <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                          formatter={(value, name) => [
                            name === 'revenue' ? formatCurrency(value) : 
                            name === 'rating' ? `${value}/5` : value,
                            name === 'revenue' ? 'Revenue' : 
                            name === 'rating' ? 'Rating' : 'Bookings'
                          ]}
                        />
                        <Legend />
                        <Bar yAxisId="left" dataKey="revenue" fill="#816bff" name="Revenue" radius={[4, 4, 0, 0]} />
                        <Bar yAxisId="right" dataKey="bookings" fill="#36b9cc" name="Bookings" radius={[4, 4, 0, 0]} />
                        <Line yAxisId="right" dataKey="rating" stroke="#ff6b9d" strokeWidth={3} name="Rating" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </PreviewCard>
            </Col>
          </Row>
        </Block>

        {/* Recent Bookings Table */}
        <Block>
          <BlockHead>
            <BlockHeadContent>
              <BlockTitle tag="h6">Recent Bookings</BlockTitle>
              <p className="text-soft">Latest booking activity across all BnB properties</p>
            </BlockHeadContent>
          </BlockHead>
          <Card className="card-bordered">
            <div className="card-inner-group">
              <div className="card-inner p-0">
                <div className="nk-tb-list nk-tb-ulist">
                  <div className="nk-tb-item nk-tb-head">
                    <div className="nk-tb-col"><span className="sub-text">Guest</span></div>
                    <div className="nk-tb-col tb-col-mb"><span className="sub-text">Property</span></div>
                    <div className="nk-tb-col tb-col-md"><span className="sub-text">Check-in</span></div>
                    <div className="nk-tb-col tb-col-lg"><span className="sub-text">Amount</span></div>
                    <div className="nk-tb-col tb-col-md"><span className="sub-text">Status</span></div>
                    <div className="nk-tb-col nk-tb-col-tools text-right">
                      <span className="sub-text">Action</span>
                    </div>
                  </div>
                  {recentBookings.length > 0 ? (
                    recentBookings.map((booking) => (
                      <div key={booking.id} className="nk-tb-item">
                        <div className="nk-tb-col">
                          <div className="user-card">
                            <div className="user-avatar bg-primary">
                              <span>{(booking.guest_name || booking.guest || 'Guest').substring(0, 2).toUpperCase()}</span>
                            </div>
                            <div className="user-info">
                              <span className="tb-lead">{booking.guest_name || booking.guest || 'Guest'}</span>
                            </div>
                          </div>
                        </div>
                        <div className="nk-tb-col tb-col-mb">
                          <span className="tb-amount">{booking.property_title || booking.property || 'Property'}</span>
                        </div>
                        <div className="nk-tb-col tb-col-md">
                          <span>{booking.check_in || booking.checkIn || 'N/A'}</span>
                        </div>
                        <div className="nk-tb-col tb-col-lg">
                          <span className="tb-amount">KES {(booking.total_amount || booking.amount || 0).toLocaleString()}</span>
                        </div>
                        <div className="nk-tb-col tb-col-md">
                          <span className={`badge badge-outline-${booking.status === 'confirmed' ? 'success' : booking.status === 'pending' ? 'warning' : 'info'}`}>
                            {booking.status || 'pending'}
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
                    ))
                  ) : (
                    <div className="nk-tb-item">
                      <div className="nk-tb-col text-center" style={{ gridColumn: '1 / -1' }}>
                        <div className="p-4">
                          <Icon name="inbox" className="text-muted" style={{ fontSize: '2rem' }} />
                          <p className="text-muted mt-2">No recent bookings found</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </Block>

        {/* Quick Actions */}
        <Block>
          <BlockHead>
            <BlockHeadContent>
              <BlockTitle tag="h6">Quick Actions</BlockTitle>
            </BlockHeadContent>
          </BlockHead>
          <Row className="g-3">
            <Col sm="6" lg="4">
              <Card className="card-bordered">
                <div className="card-inner">
                  <div className="card-title-group align-start mb-3">
                    <div className="card-title">
                      <h6 className="title">Manage Listings</h6>
                    </div>
                    <div className="card-tools">
                      <em className="card-hint-icon icon ni ni-home-fill text-primary"></em>
                    </div>
                  </div>
                  <div className="card-text">
                    <p>Add, edit, or remove BnB property listings</p>
                  </div>
                  <Button color="primary" size="sm" onClick={() => navigate("/dashboard/bnb/my-listings")}>
                    Go to Listings
                  </Button>
                </div>
              </Card>
            </Col>
            <Col sm="6" lg="4">
              <Card className="card-bordered">
                <div className="card-inner">
                  <div className="card-title-group align-start mb-3">
                    <div className="card-title">
                      <h6 className="title">Booking Management</h6>
                    </div>
                    <div className="card-tools">
                      <em className="card-hint-icon icon ni ni-calendar-booking text-info"></em>
                    </div>
                  </div>
                  <div className="card-text">
                    <p>View and manage all booking requests</p>
                  </div>
                  <Button color="info" size="sm" onClick={() => navigate("/dashboard/bnb/bookings")}>
                    View Bookings
                  </Button>
                </div>
              </Card>
            </Col>
            <Col sm="6" lg="4">
              <Card className="card-bordered">
                <div className="card-inner">
                  <div className="card-title-group align-start mb-3">
                    <div className="card-title">
                      <h6 className="title">Earnings & Payouts</h6>
                    </div>
                    <div className="card-tools">
                      <em className="card-hint-icon icon ni ni-coins text-success"></em>
                    </div>
                  </div>
                  <div className="card-text">
                    <p>Track earnings and manage payouts</p>
                  </div>
                  <Button color="success" size="sm" onClick={() => navigate("/dashboard/bnb/earnings")}>
                    View Earnings
                  </Button>
                </div>
              </Card>
            </Col>
            
            {/* Calendar & Availability Card */}
            <Col lg="4" md="6">
              <Card className="card-full h-100">
                <div className="card-inner">
                  <div className="card-title-group align-start mb-0">
                    <div className="card-title">
                      <h6 className="title">Calendar & Availability</h6>
                    </div>
                    <div className="card-tools">
                      <em className="card-hint-icon icon ni ni-calendar text-info"></em>
                    </div>
                  </div>
                  <div className="card-text">
                    <p>Manage property availability and view calendar</p>
                  </div>
                  <Button color="info" size="sm" onClick={() => navigate("/dashboard/bnb/calendar")}>
                    Manage Calendar
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

export default BnbDashboard;
