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

const MyProperties = () => {
  const [sm, updateSm] = useState(false);

  // Mock data for properties
  const properties = [
    {
      id: 1,
      title: "4BR Villa - Karen",
      images: ["villa1.jpg", "villa2.jpg"],
      location: "Karen, Nairobi",
      type: "Villa",
      purpose: "For Sale",
      bedrooms: 4,
      bathrooms: 3,
      size: "350 sqm",
      price: 25000000,
      currency: "KES",
      status: "active",
      inquiries: 18,
      views: 245,
      lastUpdated: "2 days ago",
      agent: "John Doe"
    },
    {
      id: 2,
      title: "2BR Apartment - Westlands",
      images: ["apt1.jpg", "apt2.jpg"],
      location: "Westlands, Nairobi",
      type: "Apartment",
      purpose: "For Rent",
      bedrooms: 2,
      bathrooms: 2,
      size: "120 sqm",
      price: 85000,
      currency: "KES",
      status: "active",
      inquiries: 12,
      views: 178,
      lastUpdated: "1 week ago",
      agent: "Jane Smith"
    },
    {
      id: 3,
      title: "Commercial Plot - CBD",
      images: ["plot1.jpg"],
      location: "Nairobi CBD",
      type: "Land",
      purpose: "For Sale",
      bedrooms: 0,
      bathrooms: 0,
      size: "0.5 acres",
      price: 85000000,
      currency: "KES",
      status: "pending",
      inquiries: 25,
      views: 322,
      lastUpdated: "3 days ago",
      agent: "Mike Wilson"
    }
  ];

  const metrics = {
    totalProperties: properties.length,
    activeProperties: properties.filter(p => p.status === 'active').length,
    totalInquiries: properties.reduce((sum, p) => sum + p.inquiries, 0),
    totalViews: properties.reduce((sum, p) => sum + p.views, 0),
    averagePrice: Math.round(properties.reduce((sum, p) => sum + p.price, 0) / properties.length)
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
      case 'pending': return 'warning';
      case 'sold': return 'info';
      case 'rented': return 'info';
      case 'inactive': return 'secondary';
      default: return 'light';
    }
  };

  const getPurposeColor = (purpose) => {
    switch (purpose) {
      case 'For Sale': return 'primary';
      case 'For Rent': return 'success';
      default: return 'info';
    }
  };

  return (
    <React.Fragment>
      <Head title="My Properties" />
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page>My Properties</BlockTitle>
              <BlockDes className="text-soft">
                <p>Manage your property listings and track performance.</p>
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
                      <Button color="primary">
                        <Icon name="plus"></Icon>
                        <span>Add Property</span>
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
                      <h6 className="subtitle">Total Properties</h6>
                    </div>
                    <div className="card-tools">
                      <Icon name="building" className="card-hint-icon text-primary"></Icon>
                    </div>
                  </div>
                  <div className="card-amount">
                    <span className="amount">{metrics.totalProperties}</span>
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
                    <span className="amount">{metrics.activeProperties}</span>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xxl="3" sm="6">
              <Card className="card-bordered">
                <CardBody className="card-inner">
                  <div className="card-title-group align-start mb-0">
                    <div className="card-title">
                      <h6 className="subtitle">Total Inquiries</h6>
                    </div>
                    <div className="card-tools">
                      <Icon name="chat" className="card-hint-icon text-info"></Icon>
                    </div>
                  </div>
                  <div className="card-amount">
                    <span className="amount">{metrics.totalInquiries}</span>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xxl="3" sm="6">
              <Card className="card-bordered">
                <CardBody className="card-inner">
                  <div className="card-title-group align-start mb-0">
                    <div className="card-title">
                      <h6 className="subtitle">Total Views</h6>
                    </div>
                    <div className="card-tools">
                      <Icon name="eye" className="card-hint-icon text-warning"></Icon>
                    </div>
                  </div>
                  <div className="card-amount">
                    <span className="amount">{metrics.totalViews}</span>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Block>

        {/* Properties Table */}
        <Block>
          <DataTable className="card-stretch">
            <div className="card-inner position-relative card-tools-toggle">
              <div className="card-title-group">
                <div className="card-tools">
                  <div className="form-inline flex-nowrap gx-3">
                    <div className="form-wrap w-150px">
                      <select className="form-select js-select2" data-search="off">
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="sold">Sold</option>
                        <option value="rented">Rented</option>
                      </select>
                    </div>
                    <div className="form-wrap w-150px">
                      <select className="form-select js-select2" data-search="off">
                        <option value="all">All Types</option>
                        <option value="villa">Villa</option>
                        <option value="apartment">Apartment</option>
                        <option value="land">Land</option>
                        <option value="commercial">Commercial</option>
                      </select>
                    </div>
                    <div className="btn-wrap">
                      <span className="d-none d-md-block">
                        <Button
                          color="light"
                          outline
                          className="btn-dim"
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
                  <span className="sub-text">Property</span>
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
              {properties.map((property) => (
                <DataTableItem key={property.id}>
                  <DataTableRow>
                    <div className="user-card">
                      <UserAvatar 
                        theme="primary" 
                        text={property.title.charAt(0)}
                        image={property.images[0]}
                      />
                      <div className="user-info">
                        <span className="tb-lead">{property.title}</span>
                        <span className="sub-text">{property.location}</span>
                      </div>
                    </div>
                  </DataTableRow>
                  <DataTableRow size="mb">
                    <div>
                      <div className="tb-sub">
                        <Icon name="home" className="mr-1"></Icon>
                        {property.type} • {property.size}
                      </div>
                      <div className="tb-sub">
                        <Icon name="bed" className="mr-1"></Icon>
                        {property.bedrooms > 0 ? `${property.bedrooms} beds` : 'No beds'} • 
                        {property.bathrooms > 0 ? ` ${property.bathrooms} baths` : ' No baths'}
                      </div>
                      <div className="tb-sub">
                        <Badge color={getPurposeColor(property.purpose)} className="badge-sm">
                          {property.purpose}
                        </Badge>
                      </div>
                    </div>
                  </DataTableRow>
                  <DataTableRow size="md">
                    <div>
                      <span className="tb-amount">{formatCurrency(property.price)}</span>
                      <div className="tb-sub text-muted">
                        {property.purpose === 'For Rent' ? 'per month' : 'total'}
                      </div>
                    </div>
                  </DataTableRow>
                  <DataTableRow size="lg">
                    <div>
                      <div className="tb-sub">
                        <Icon name="eye" className="text-info mr-1"></Icon>
                        {property.views} views
                      </div>
                      <div className="tb-sub">
                        <Icon name="chat" className="text-success mr-1"></Icon>
                        {property.inquiries} inquiries
                      </div>
                      <div className="tb-sub text-muted small">
                        Updated: {property.lastUpdated}
                      </div>
                    </div>
                  </DataTableRow>
                  <DataTableRow size="md">
                    <Badge color={getStatusColor(property.status)}>
                      {property.status}
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
                                  }}
                                >
                                  <Icon name="edit"></Icon>
                                  <span>Edit Property</span>
                                </DropdownItem>
                              </li>
                              <li>
                                <DropdownItem
                                  tag="a"
                                  href="#view"
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                  }}
                                >
                                  <Icon name="eye"></Icon>
                                  <span>View Details</span>
                                </DropdownItem>
                              </li>
                              <li>
                                <DropdownItem
                                  tag="a"
                                  href="#promote"
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                  }}
                                >
                                  <Icon name="growth"></Icon>
                                  <span>Promote Listing</span>
                                </DropdownItem>
                              </li>
                              <li className="divider"></li>
                              <li>
                                <DropdownItem
                                  tag="a"
                                  href="#remove"
                                  onClick={(ev) => {
                                    ev.preventDefault();
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
              ))}
            </DataTableBody>
          </DataTable>
        </Block>
      </Content>
    </React.Fragment>
  );
};

export default MyProperties;











