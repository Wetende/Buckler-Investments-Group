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
import { useNavigate } from "react-router-dom";
import { useBnbListings, useDeleteBnbListing, useSaveBnbListing } from "@/hooks/useBnb";
import { toast } from "react-toastify";
import BnbSearchFilter from "@/components/search/BnbSearchFilter";

const MyListings = () => {
  const [sm, updateSm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [selectedListings, setSelectedListings] = useState(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  const navigate = useNavigate();

  // API hooks for real data
  const { data: listingsData, isLoading, error, refetch } = useBnbListings({
    search: searchQuery || undefined,
    ...filters
  });
  const deleteListingMutation = useDeleteBnbListing();
  const saveListingMutation = useSaveBnbListing();

  const listings = listingsData?.items || [];

  // Calculate metrics from real data
  const metrics = {
    totalListings: listingsData?.total || 0,
    activeListings: listings.filter(l => l.status === 'active').length,
    totalBookings: listings.reduce((sum, l) => sum + (l.total_bookings || 0), 0),
    totalEarnings: listings.reduce((sum, l) => sum + (l.total_earnings || 0), 0),
    averageRating: listings.length > 0 ? 
      (listings.reduce((sum, l) => sum + (l.rating || 0), 0) / listings.length).toFixed(1) : '0.0'
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
      default: return 'light';
    }
  };

  // CRUD operation handlers
  const handleEditListing = (listing) => {
    navigate(`/dashboard/bnb/create-listing?edit=${listing.id}`);
  };

  const handleViewListing = (listing) => {
    // For now, navigate to edit view. Later we can add a separate view modal
    navigate(`/dashboard/bnb/create-listing?view=${listing.id}`);
  };

  const handlePauseListing = async (listing) => {
    try {
      // Toggle the listing status
      const newStatus = listing.status === 'active' ? 'paused' : 'active';
      
      // Update via API
      await saveListingMutation.mutateAsync({
        id: listing.id,
        ...listing,
        status: newStatus
      });
      
      // Success message is handled by the mutation hook
    } catch (error) {
      // Error is handled by the mutation hook
      console.error('Failed to update listing status:', error);
    }
  };

  const handleDeleteListing = async (listing) => {
    if (window.confirm(`Are you sure you want to delete "${listing.title}"? This action cannot be undone.`)) {
      try {
        await deleteListingMutation.mutateAsync(listing.id);
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  // Search and filter handlers
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
  };

  // Bulk operations handlers
  const handleSelectListing = (listingId, checked) => {
    const newSelected = new Set(selectedListings);
    if (checked) {
      newSelected.add(listingId);
    } else {
      newSelected.delete(listingId);
    }
    setSelectedListings(newSelected);
    setShowBulkActions(newSelected.size > 0);
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      const allIds = new Set(listings.map(listing => listing.id));
      setSelectedListings(allIds);
      setShowBulkActions(true);
    } else {
      setSelectedListings(new Set());
      setShowBulkActions(false);
    }
  };

  const handleBulkAction = async (action) => {
    const selectedIds = Array.from(selectedListings);
    
    try {
      switch (action) {
        case 'activate':
          await Promise.all(selectedIds.map(id => {
            const listing = listings.find(l => l.id === id);
            return saveListingMutation.mutateAsync({
              id,
              ...listing,
              status: 'active'
            });
          }));
          toast.success(`${selectedIds.length} listings activated successfully!`);
          break;
          
        case 'pause':
          await Promise.all(selectedIds.map(id => {
            const listing = listings.find(l => l.id === id);
            return saveListingMutation.mutateAsync({
              id,
              ...listing,
              status: 'paused'
            });
          }));
          toast.success(`${selectedIds.length} listings paused successfully!`);
          break;
          
        case 'delete':
          if (window.confirm(`Are you sure you want to delete ${selectedIds.length} listings? This action cannot be undone.`)) {
            await Promise.all(selectedIds.map(id => deleteListingMutation.mutateAsync(id)));
            toast.success(`${selectedIds.length} listings deleted successfully!`);
          }
          break;
          
        default:
          toast.error('Invalid bulk action');
      }
      
      // Clear selections and refresh data
      setSelectedListings(new Set());
      setShowBulkActions(false);
      refetch();
    } catch (error) {
      toast.error('Failed to perform bulk action');
      console.error('Bulk action error:', error);
    }
  };

  // Filter configuration for the search component
  const filterOptions = {
    status: {
      label: 'Status',
      type: 'select',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'paused', label: 'Paused' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'draft', label: 'Draft' }
      ]
    },
    property_type: {
      label: 'Property Type',
      type: 'select',
      options: [
        { value: 'apartment', label: 'Apartment' },
        { value: 'house', label: 'House' },
        { value: 'villa', label: 'Villa' },
        { value: 'studio', label: 'Studio' },
        { value: 'cottage', label: 'Cottage' }
      ]
    },
    bedrooms: {
      label: 'Bedrooms',
      type: 'select',
      options: [
        { value: '1', label: '1 Bedroom' },
        { value: '2', label: '2 Bedrooms' },
        { value: '3', label: '3 Bedrooms' },
        { value: '4', label: '4+ Bedrooms' }
      ]
    },
    location: {
      label: 'Location',
      type: 'text',
      placeholder: 'Enter city or area'
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <React.Fragment>
        <Head title="My Listings" />
        <Content>
          <BlockHead size="sm">
            <BlockBetween>
              <BlockHeadContent>
                <BlockTitle page>My Listings</BlockTitle>
                <BlockDes className="text-soft">
                  <p>Loading your listings...</p>
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
        <Head title="My Listings" />
        <Content>
          <BlockHead size="sm">
            <BlockBetween>
              <BlockHeadContent>
                <BlockTitle page>My Listings</BlockTitle>
                <BlockDes className="text-soft">
                  <p>Error loading listings.</p>
                </BlockDes>
              </BlockHeadContent>
            </BlockBetween>
          </BlockHead>
          <Block>
            <div className="alert alert-danger">
              <h6>Error Loading Listings</h6>
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
      <Head title="My Listings" />
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page>My Listings</BlockTitle>
              <BlockDes className="text-soft">
                <p>Manage your BnB property listings and track performance.</p>
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
                      <Button color="primary" onClick={() => navigate("/dashboard/bnb/create-listing")}>
                        <Icon name="plus"></Icon>
                        <span>Add Listing</span>
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
                      <h6 className="subtitle">Total Listings</h6>
                    </div>
                    <div className="card-tools">
                      <Icon name="home" className="card-hint-icon text-primary"></Icon>
                    </div>
                  </div>
                  <div className="card-amount">
                    <span className="amount">{metrics.totalListings}</span>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xxl="3" sm="6">
              <Card className="card-bordered">
                <CardBody className="card-inner">
                  <div className="card-title-group align-start mb-0">
                    <div className="card-title">
                      <h6 className="subtitle">Active Listings</h6>
                    </div>
                    <div className="card-tools">
                      <Icon name="check-circle" className="card-hint-icon text-success"></Icon>
                    </div>
                  </div>
                  <div className="card-amount">
                    <span className="amount">{metrics.activeListings}</span>
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

        {/* Search and Filter */}
        <Block>
          <BnbSearchFilter
            onSearch={handleSearch}
            onFilter={handleFilter}
            searchPlaceholder="Search listings by title, location, or description..."
            filterOptions={filterOptions}
            showPriceRange={true}
            className="mb-4"
          />
        </Block>

        {/* Bulk Actions Bar */}
        {showBulkActions && (
          <Block>
            <div className="nk-block-head nk-block-head-sm">
              <div className="nk-block-between g-3 flex-column flex-md-row">
                <div className="nk-block-head-content">
                  <h6 className="text-center text-md-start">{selectedListings.size} listing(s) selected</h6>
                </div>
                <div className="nk-block-head-content">
                  <div className="btn-group-sm d-flex flex-wrap gap-2 justify-content-center" role="group">
                    <Button
                      color="success"
                      outline
                      size="sm"
                      onClick={() => handleBulkAction('activate')}
                      className="flex-shrink-0"
                    >
                      <Icon name="play" />
                      <span className="d-none d-sm-inline ms-1">Activate</span>
                    </Button>
                    <Button
                      color="warning"
                      outline
                      size="sm"
                      onClick={() => handleBulkAction('pause')}
                      className="flex-shrink-0"
                    >
                      <Icon name="pause" />
                      <span className="d-none d-sm-inline ms-1">Pause</span>
                    </Button>
                    <Button
                      color="danger"
                      outline
                      size="sm"
                      onClick={() => handleBulkAction('delete')}
                      className="flex-shrink-0"
                    >
                      <Icon name="trash" />
                      <span className="d-none d-sm-inline ms-1">Delete</span>
                    </Button>
                    <Button
                      color="light"
                      outline
                      size="sm"
                      onClick={() => {
                        setSelectedListings(new Set());
                        setShowBulkActions(false);
                      }}
                      className="flex-shrink-0"
                    >
                      <Icon name="cross" />
                      <span className="d-none d-sm-inline ms-1">Cancel</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Block>
        )}

        {/* Listings Table */}
        <Block>
          <DataTable className="card-stretch">
            <div className="card-inner position-relative card-tools-toggle">
              <div className="card-title-group">
                <div className="card-title">
                  <h6 className="title">Your Listings</h6>
                </div>
                <div className="card-tools">
                  <div className="btn-wrap">
                    <Button
                      color="light"
                      outline
                      className="btn-dim"
                      onClick={() => refetch()}
                      title="Refresh listings"
                    >
                      <Icon name="reload"></Icon>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <DataTableBody>
              <DataTableHead className="nk-tb-item nk-tb-head">
                <DataTableRow className="nk-tb-col-check">
                  <div className="custom-control custom-checkbox">
                    <input 
                      type="checkbox" 
                      className="custom-control-input" 
                      id="selectAllListings"
                      checked={selectedListings.size === listings.length && listings.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                    <label className="custom-control-label" htmlFor="selectAllListings"></label>
                  </div>
                </DataTableRow>
                <DataTableRow>
                  <span className="sub-text">Property</span>
                </DataTableRow>
                <DataTableRow size="mb">
                  <span className="sub-text">Details</span>
                </DataTableRow>
                <DataTableRow size="md">
                  <span className="sub-text">Price/Night</span>
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
              {listings.length > 0 ? (
                listings.map((listing) => (
                  <DataTableItem key={listing.id}>
                    <DataTableRow className="nk-tb-col-check">
                      <div className="custom-control custom-checkbox">
                        <input 
                          type="checkbox" 
                          className="custom-control-input" 
                          id={`selectListing_${listing.id}`}
                          checked={selectedListings.has(listing.id)}
                          onChange={(e) => handleSelectListing(listing.id, e.target.checked)}
                        />
                        <label className="custom-control-label" htmlFor={`selectListing_${listing.id}`}></label>
                      </div>
                    </DataTableRow>
                    <DataTableRow>
                      <div className="user-card">
                        <UserAvatar 
                          theme="primary" 
                          text={(listing.title || 'Property').charAt(0)}
                          image={listing.images?.[0] || listing.image_url}
                        />
                        <div className="user-info">
                          <span className="tb-lead">{listing.title || 'Untitled Property'}</span>
                          <span className="sub-text">{listing.location || listing.address || 'Location not specified'}</span>
                        </div>
                      </div>
                    </DataTableRow>
                    <DataTableRow size="mb">
                      <div>
                        <div className="tb-sub">
                          <Icon name="users" className="mr-1"></Icon>
                          {listing.max_guests || listing.guests || 0} guests • {listing.bedrooms || 0} beds • {listing.bathrooms || 0} baths
                        </div>
                        <div className="tb-sub text-muted small">
                          Last booked: {listing.last_booked || listing.lastBooked || 'Never'}
                        </div>
                      </div>
                    </DataTableRow>
                    <DataTableRow size="md">
                      <span className="tb-amount">{formatCurrency(listing.price_per_night || listing.price || 0)}</span>
                    </DataTableRow>
                    <DataTableRow size="lg">
                      <div>
                        <div className="tb-sub">
                          <Icon name="star-fill" className="text-warning mr-1"></Icon>
                          {listing.rating || 0} • {listing.total_bookings || listing.bookings || 0} bookings
                        </div>
                        <div className="tb-sub text-success">
                          {formatCurrency(listing.total_earnings || listing.earnings || 0)} earned
                        </div>
                      </div>
                    </DataTableRow>
                    <DataTableRow size="md">
                      <Badge color={getStatusColor(listing.status)}>
                        {listing.status || 'draft'}
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
                                    href="#edit"
                                    onClick={(ev) => {
                                      ev.preventDefault();
                                      handleEditListing(listing);
                                    }}
                                  >
                                    <Icon name="edit"></Icon>
                                    <span>Edit Listing</span>
                                  </DropdownItem>
                                </li>
                                <li>
                                  <DropdownItem
                                    tag="a"
                                    href="#view"
                                    onClick={(ev) => {
                                      ev.preventDefault();
                                      handleViewListing(listing);
                                    }}
                                  >
                                    <Icon name="eye"></Icon>
                                    <span>View Details</span>
                                  </DropdownItem>
                                </li>
                                <li>
                                  <DropdownItem
                                    tag="a"
                                    href="#pause"
                                    onClick={(ev) => {
                                      ev.preventDefault();
                                      handlePauseListing(listing);
                                    }}
                                  >
                                    <Icon name={listing.status === 'active' ? 'pause' : 'play'}></Icon>
                                    <span>{listing.status === 'active' ? 'Pause' : 'Activate'} Listing</span>
                                  </DropdownItem>
                                </li>
                                <li className="divider"></li>
                                <li>
                                  <DropdownItem
                                    tag="a"
                                    href="#remove"
                                    onClick={(ev) => {
                                      ev.preventDefault();
                                      handleDeleteListing(listing);
                                    }}
                                  >
                                    <Icon name="trash"></Icon>
                                    <span>Remove</span>
                                  </DropdownItem>
                                </li>
                              </ul>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </li>
                      </ul>
                    </DataTableRow>
                  </DataTableItem>
                ))
              ) : (
                <DataTableItem>
                  <DataTableRow className="text-center" style={{ gridColumn: '1 / -1' }}>
                    <div className="p-4">
                      <Icon name="home" className="text-muted" style={{ fontSize: '2rem' }} />
                      <p className="text-muted mt-2">No listings found. Create your first listing to get started!</p>
                      <Button color="primary" size="sm" onClick={() => navigate("/dashboard/bnb/create-listing")}>
                        <Icon name="plus" className="mr-1" />
                        Create Listing
                      </Button>
                    </div>
                  </DataTableRow>
                </DataTableItem>
              )}
            </DataTableBody>
          </DataTable>
        </Block>
      </Content>
    </React.Fragment>
  );
};

export default MyListings;

