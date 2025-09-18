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
import { Card, CardBody } from "reactstrap";
import { useMyTours, useTourCategories, useDeleteTour } from "@/hooks/useTours";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const MyTours = () => {
  const [sm, updateSm] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    search: '',
    page: 1,
    limit: 20
  });

  const operatorId = 1; // TODO: Get from auth context

  // API Hooks
  const { data: toursData, isLoading, error, refetch } = useMyTours(operatorId);
  const { data: categories } = useTourCategories();
  const deleteTour = useDeleteTour();

  // Process tour data
  const tours = toursData || [];
  
  // Apply local filtering until backend supports it
  const filteredTours = tours.filter(tour => {
    if (filters.status && tour.status !== filters.status) return false;
    if (filters.category && tour.category !== filters.category) return false;
    if (filters.search && !tour.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  // Calculate metrics from real data
  const metrics = {
    totalTours: tours.length,
    activeTours: tours.filter(t => t.status === 'active').length,
    totalBookings: tours.reduce((sum, t) => sum + (t.bookings || 0), 0),
    totalEarnings: tours.reduce((sum, t) => sum + (t.earnings || 0), 0),
    averageRating: tours.length > 0 
      ? (tours.reduce((sum, t) => sum + (t.rating || 0), 0) / tours.length).toFixed(1)
      : '0.0'
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'paused': return 'warning';
      case 'inactive': return 'secondary';
      case 'draft': return 'info';
      default: return 'light';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'success';
      case 'Moderate': return 'warning';
      case 'Challenging': return 'danger';
      default: return 'info';
    }
  };

  // Filter handlers
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleDeleteTour = async (tourId) => {
    if (window.confirm('Are you sure you want to delete this tour? This action cannot be undone.')) {
      try {
        await deleteTour.mutateAsync(tourId);
        toast.success('Tour deleted successfully!');
        refetch(); // Refresh the list
      } catch (error) {
        toast.error(error.response?.data?.detail || 'Failed to delete tour');
      }
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <>
        <Head title="My Tours" />
        <Content>
          <BlockHead size="sm">
            <BlockHeadContent>
              <BlockTitle page>My Tours</BlockTitle>
              <BlockDes className="text-soft">
                <p>Loading your tours...</p>
              </BlockDes>
            </BlockHeadContent>
          </BlockHead>
          <Block>
            <div className="d-flex justify-content-center p-5">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          </Block>
        </Content>
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <Head title="My Tours" />
        <Content>
          <BlockHead size="sm">
            <BlockHeadContent>
              <BlockTitle page>My Tours</BlockTitle>
              <BlockDes className="text-soft">
                <p>Error loading tours</p>
              </BlockDes>
            </BlockHeadContent>
          </BlockHead>
          <Block>
            <div className="alert alert-danger">
              <h6>Unable to load tours</h6>
              <p>{error.message}</p>
              <Button color="primary" onClick={refetch}>
                Try Again
              </Button>
            </div>
          </Block>
        </Content>
      </>
    );
  }

  return (
    <React.Fragment>
      <Head title="My Tours" />
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page>My Tours</BlockTitle>
              <BlockDes className="text-soft">
                <p>Manage your tour packages and track performance.</p>
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
                        <span>Export</span>
                      </Button>
                    </li>
                    <li className="nk-block-tools-opt">
                      <Link to="/tours/create">
                        <Button color="primary">
                          <Icon name="plus"></Icon>
                          <span>Create Tour</span>
                        </Button>
                      </Link>
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
                      <h6 className="subtitle">Total Tours</h6>
                    </div>
                    <div className="card-tools">
                      <Icon name="map" className="card-hint-icon text-primary"></Icon>
                    </div>
                  </div>
                  <div className="card-amount">
                    <span className="amount">{metrics.totalTours}</span>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xxl="3" sm="6">
              <Card className="card-bordered">
                <CardBody className="card-inner">
                  <div className="card-title-group align-start mb-0">
                    <div className="card-title">
                      <h6 className="subtitle">Active Tours</h6>
                    </div>
                    <div className="card-tools">
                      <Icon name="check-circle" className="card-hint-icon text-success"></Icon>
                    </div>
                  </div>
                  <div className="card-amount">
                    <span className="amount">{metrics.activeTours}</span>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xxl="3" sm="6">
              <Card className="card-bordered">
                <CardBody className="card-inner">
                  <div className="card-title-group align-start mb-0">
                    <div className="card-title">
                      <h6 className="subtitle">Total Bookings</h6>
                    </div>
                    <div className="card-tools">
                      <Icon name="calendar" className="card-hint-icon text-info"></Icon>
                    </div>
                  </div>
                  <div className="card-amount">
                    <span className="amount">{metrics.totalBookings}</span>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xxl="3" sm="6">
              <Card className="card-bordered">
                <CardBody className="card-inner">
                  <div className="card-title-group align-start mb-0">
                    <div className="card-title">
                      <h6 className="subtitle">Total Earnings</h6>
                    </div>
                    <div className="card-tools">
                      <Icon name="coins" className="card-hint-icon text-warning"></Icon>
                    </div>
                  </div>
                  <div className="card-amount">
                    <span className="amount">{formatCurrency(metrics.totalEarnings)}</span>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Block>

        {/* Tours Table */}
        <Block>
          <DataTable className="card-stretch">
            <div className="card-inner position-relative card-tools-toggle">
              <div className="card-title-group">
                <div className="card-tools">
                  <div className="form-inline flex-nowrap gx-3">
                    <div className="form-wrap w-150px">
                      <select 
                        className="form-select" 
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                      >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="paused">Paused</option>
                        <option value="inactive">Inactive</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>
                    <div className="form-wrap w-150px">
                      <select 
                        className="form-select" 
                        value={filters.category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                      >
                        <option value="">All Categories</option>
                        {categories && categories.map(cat => (
                          <option key={cat.id} value={cat.name}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="btn-wrap">
                      <span className="d-none d-md-block">
                        <Button
                          color="light"
                          outline
                          className="btn-dim"
                          onClick={refetch}
                          disabled={isLoading}
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
                  <span className="sub-text">Tour</span>
                </DataTableRow>
                <DataTableRow size="mb">
                  <span className="sub-text">Details</span>
                </DataTableRow>
                <DataTableRow size="md">
                  <span className="sub-text">Price</span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text">Performance</span>
                </DataTableRow>
                <DataTableRow size="md">
                  <span className="sub-text">Status</span>
                </DataTableRow>
                <DataTableRow className="nk-tb-col-tools text-right">
                  <span className="sub-text">Action</span>
                </DataTableRow>
              </DataTableHead>
              {filteredTours.length === 0 ? (
                <DataTableItem>
                  <div className="text-center p-4">
                    <Icon name="map" style={{ fontSize: '3rem', color: '#ccc' }} />
                    <h6 className="mt-2">No Tours Found</h6>
                    <p className="text-soft">
                      {tours.length === 0 
                        ? "You haven't created any tours yet. Create your first tour to get started." 
                        : "No tours match your current filters."
                      }
                    </p>
                    {tours.length === 0 && (
                      <Link to="/tours/create">
                        <Button color="primary">
                          <Icon name="plus" />
                          <span>Create Your First Tour</span>
                        </Button>
                      </Link>
                    )}
                  </div>
                </DataTableItem>
              ) : filteredTours.map((tour) => (
                <DataTableItem key={tour.id}>
                  <DataTableRow>
                    <div className="user-card">
                      <UserAvatar 
                        theme="primary" 
                        text={tour.title.charAt(0)}
                        image={tour.images[0]}
                      />
                      <div className="user-info">
                        <span className="tb-lead">{tour.title}</span>
                        <span className="sub-text">{tour.location}</span>
                      </div>
                    </div>
                  </DataTableRow>
                  <DataTableRow size="mb">
                    <div>
                      <div className="tb-sub">
                        <Icon name="clock" className="mr-1"></Icon>
                        {tour.duration || 'Duration TBD'}
                      </div>
                      <div className="tb-sub">
                        <Icon name="users" className="mr-1"></Icon>
                        Max {tour.max_participants || tour.groupSize || 0} people
                      </div>
                      <div className="tb-sub">
                        <Badge color={getDifficultyColor(tour.difficulty)} className="badge-sm">
                          {tour.difficulty || 'Easy'}
                        </Badge>
                      </div>
                    </div>
                  </DataTableRow>
                  <DataTableRow size="md">
                    <div>
                      <span className="tb-amount">{formatCurrency(tour.price)}</span>
                      <div className="tb-sub text-muted">per person</div>
                    </div>
                  </DataTableRow>
                  <DataTableRow size="lg">
                    <div>
                      <div className="tb-sub">
                        <Icon name="star-fill" className="text-warning mr-1"></Icon>
                        {tour.rating} • {tour.bookings} bookings
                      </div>
                      <div className="tb-sub text-success">
                        {formatCurrency(tour.earnings)} earned
                      </div>
                      <div className="tb-sub text-muted small">
                        Last booked: {tour.lastBooked}
                      </div>
                    </div>
                  </DataTableRow>
                  <DataTableRow size="md">
                    <Badge color={getStatusColor(tour.status)}>
                      {tour.status}
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
                                  tag={Link}
                                  to={`/tours/${tour.id}/edit`}
                                >
                                  <Icon name="edit"></Icon>
                                  <span>Edit Tour</span>
                                </DropdownItem>
                              </li>
                              <li>
                                <DropdownItem
                                  tag={Link}
                                  to={`/tours/${tour.id}`}
                                >
                                  <Icon name="eye"></Icon>
                                  <span>View Details</span>
                                </DropdownItem>
                              </li>
                              <li>
                                <DropdownItem
                                  tag={Link}
                                  to={`/tours/${tour.id}/availability`}
                                >
                                  <Icon name="calendar"></Icon>
                                  <span>Manage Schedule</span>
                                </DropdownItem>
                              </li>
                              <li>
                                <DropdownItem
                                  tag={Link}
                                  to={`/tours/${tour.id}/bookings`}
                                >
                                  <Icon name="users"></Icon>
                                  <span>View Bookings</span>
                                </DropdownItem>
                              </li>
                              <li className="divider"></li>
                              <li>
                                <DropdownItem
                                  tag="a"
                                  href="#remove"
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                    handleDeleteTour(tour.id);
                                  }}
                                  className="text-danger"
                                >
                                  <Icon name="trash"></Icon>
                                  <span>Delete Tour</span>
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
      </Content>
    </React.Fragment>
  );
};

export default MyTours;

