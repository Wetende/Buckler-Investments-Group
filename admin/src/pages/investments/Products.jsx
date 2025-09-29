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
  DropdownToggle,
  DropdownMenu,
  UncontrolledDropdown,
  DropdownItem,
  BlockBetween,
} from "@/components/Component";
import { Card, CardBody } from "reactstrap";

const InvestmentProducts = () => {
  const [sm, updateSm] = useState(false);

  // Mock data for investment products
  const products = [
    {
      id: 1,
      name: "Real Estate Fund Alpha",
      type: "Real Estate",
      minInvestment: 50000,
      targetReturn: 12.5,
      duration: "24 months",
      status: "active",
      totalRaised: 15000000,
      targetAmount: 20000000,
      investors: 145,
      riskLevel: "Medium",
      launched: "2024-01-15"
    },
    {
      id: 2,
      name: "Tech Startup Portfolio",
      type: "Equity",
      minInvestment: 100000,
      targetReturn: 25.0,
      duration: "36 months",
      status: "active",
      totalRaised: 8500000,
      targetAmount: 15000000,
      investors: 78,
      riskLevel: "High",
      launched: "2024-02-01"
    },
    {
      id: 3,
      name: "Government Bond Series C",
      type: "Fixed Income",
      minInvestment: 10000,
      targetReturn: 8.5,
      duration: "12 months",
      status: "closed",
      totalRaised: 50000000,
      targetAmount: 50000000,
      investors: 892,
      riskLevel: "Low",
      launched: "2023-12-01"
    }
  ];

  const metrics = {
    totalProducts: products.length,
    activeProducts: products.filter(p => p.status === 'active').length,
    totalRaised: products.reduce((sum, p) => sum + p.totalRaised, 0),
    totalInvestors: products.reduce((sum, p) => sum + p.investors, 0),
    averageReturn: (products.reduce((sum, p) => sum + p.targetReturn, 0) / products.length).toFixed(1)
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'closed': return 'info';
      case 'paused': return 'warning';
      case 'draft': return 'secondary';
      default: return 'light';
    }
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'Low': return 'success';
      case 'Medium': return 'warning';
      case 'High': return 'danger';
      default: return 'info';
    }
  };

  const calculateProgress = (raised, target) => {
    return Math.round((raised / target) * 100);
  };

  return (
    <React.Fragment>
      <Head title="Investment Products" />
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page>Investment Products</BlockTitle>
              <BlockDes className="text-soft">
                <p>Manage investment products and track fund performance.</p>
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
                        <span>Create Product</span>
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
                      <h6 className="subtitle">Total Products</h6>
                    </div>
                    <div className="card-tools">
                      <Icon name="coins" className="card-hint-icon text-primary"></Icon>
                    </div>
                  </div>
                  <div className="card-amount">
                    <span className="amount">{metrics.totalProducts}</span>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xxl="3" sm="6">
              <Card className="card-bordered">
                <CardBody className="card-inner">
                  <div className="card-title-group align-start mb-0">
                    <div className="card-title">
                      <h6 className="subtitle">Active Products</h6>
                    </div>
                    <div className="card-tools">
                      <Icon name="check-circle" className="card-hint-icon text-success"></Icon>
                    </div>
                  </div>
                  <div className="card-amount">
                    <span className="amount">{metrics.activeProducts}</span>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xxl="3" sm="6">
              <Card className="card-bordered">
                <CardBody className="card-inner">
                  <div className="card-title-group align-start mb-0">
                    <div className="card-title">
                      <h6 className="subtitle">Total Raised</h6>
                    </div>
                    <div className="card-tools">
                      <Icon name="growth" className="card-hint-icon text-info"></Icon>
                    </div>
                  </div>
                  <div className="card-amount">
                    <span className="amount">{formatCurrency(metrics.totalRaised)}</span>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xxl="3" sm="6">
              <Card className="card-bordered">
                <CardBody className="card-inner">
                  <div className="card-title-group align-start mb-0">
                    <div className="card-title">
                      <h6 className="subtitle">Total Investors</h6>
                    </div>
                    <div className="card-tools">
                      <Icon name="users" className="card-hint-icon text-warning"></Icon>
                    </div>
                  </div>
                  <div className="card-amount">
                    <span className="amount">{metrics.totalInvestors}</span>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Block>

        {/* Products Table */}
        <Block>
          <DataTable className="card-stretch">
            <DataTableBody>
              <DataTableHead className="nk-tb-item nk-tb-head">
                <DataTableRow>
                  <span className="sub-text">Product</span>
                </DataTableRow>
                <DataTableRow size="md">
                  <span className="sub-text">Returns & Risk</span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text">Funding Progress</span>
                </DataTableRow>
                <DataTableRow size="md">
                  <span className="sub-text">Investors</span>
                </DataTableRow>
                <DataTableRow size="md">
                  <span className="sub-text">Status</span>
                </DataTableRow>
                <DataTableRow className="nk-tb-col-tools text-right">
                  <span className="sub-text">Action</span>
                </DataTableRow>
              </DataTableHead>
              {products.map((product) => (
                <DataTableItem key={product.id}>
                  <DataTableRow>
                    <div>
                      <span className="tb-lead">{product.name}</span>
                      <div className="tb-sub">
                        <Badge color="light" className="badge-sm mr-1">
                          {product.type}
                        </Badge>
                        • Min: {formatCurrency(product.minInvestment)}
                      </div>
                      <div className="tb-sub text-muted small">
                        Duration: {product.duration}
                      </div>
                    </div>
                  </DataTableRow>
                  <DataTableRow size="md">
                    <div>
                      <div className="tb-sub">
                        <Icon name="trending-up" className="text-success mr-1"></Icon>
                        Target: {product.targetReturn}% p.a.
                      </div>
                      <div className="tb-sub">
                        <Badge color={getRiskColor(product.riskLevel)} className="badge-sm">
                          {product.riskLevel} Risk
                        </Badge>
                      </div>
                    </div>
                  </DataTableRow>
                  <DataTableRow size="lg">
                    <div>
                      <div className="tb-sub mb-1">
                        {formatCurrency(product.totalRaised)} / {formatCurrency(product.targetAmount)}
                      </div>
                      <div className="progress progress-sm">
                        <div
                          className="progress-bar bg-primary"
                          style={{ width: `${calculateProgress(product.totalRaised, product.targetAmount)}%` }}
                        ></div>
                      </div>
                      <div className="tb-sub text-muted small">
                        {calculateProgress(product.totalRaised, product.targetAmount)}% funded
                      </div>
                    </div>
                  </DataTableRow>
                  <DataTableRow size="md">
                    <div>
                      <span className="tb-amount">{product.investors}</span>
                      <div className="tb-sub text-muted">investors</div>
                    </div>
                  </DataTableRow>
                  <DataTableRow size="md">
                    <Badge color={getStatusColor(product.status)}>
                      {product.status}
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
                                <DropdownItem tag="a" href="#edit">
                                  <Icon name="edit"></Icon>
                                  <span>Edit Product</span>
                                </DropdownItem>
                              </li>
                              <li>
                                <DropdownItem tag="a" href="#view">
                                  <Icon name="eye"></Icon>
                                  <span>View Analytics</span>
                                </DropdownItem>
                              </li>
                              <li>
                                <DropdownItem tag="a" href="#investors">
                                  <Icon name="users"></Icon>
                                  <span>Manage Investors</span>
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

export default InvestmentProducts;











