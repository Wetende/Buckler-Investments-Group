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
import AdminDataTable from "@/components/data/AdminDataTable";

const Earnings = () => {
  const [earnings, setEarnings] = useState([
    {
      id: 1,
      rentalId: "R001",
      vehicleName: "Toyota Camry 2022",
      customerName: "John Doe",
      startDate: "2024-01-15",
      endDate: "2024-01-20",
      days: 5,
      dailyRate: 4000,
      totalAmount: 20000,
      commission: 3000,
      netEarnings: 17000,
      status: "paid",
      payoutDate: "2024-01-22",
    },
    {
      id: 2,
      rentalId: "R002",
      vehicleName: "Honda CR-V 2021",
      customerName: "Jane Smith",
      startDate: "2024-01-28",
      endDate: "2024-02-02",
      days: 5,
      dailyRate: 7000,
      totalAmount: 35000,
      commission: 5250,
      netEarnings: 29750,
      status: "pending",
      payoutDate: null,
    },
    {
      id: 3,
      rentalId: "R003",
      vehicleName: "Nissan X-Trail 2020",
      customerName: "Mike Johnson",
      startDate: "2024-02-05",
      endDate: "2024-02-10",
      days: 5,
      dailyRate: 6000,
      totalAmount: 30000,
      commission: 4500,
      netEarnings: 25500,
      status: "processing",
      payoutDate: null,
    },
  ]);

  const [timeFilter, setTimeFilter] = useState("this_month");

  const columns = [
    {
      title: "Rental",
      key: "rentalId",
      render: (item) => (
        <div>
          <span className="tb-lead">#{item.rentalId}</span>
          <span className="sub-text d-block">{item.vehicleName}</span>
        </div>
      ),
    },
    {
      title: "Customer",
      key: "customerName",
      render: (item) => <span className="tb-lead">{item.customerName}</span>,
    },
    {
      title: "Period",
      key: "period",
      render: (item) => (
        <div>
          <span className="tb-lead">{item.startDate} to {item.endDate}</span>
          <span className="sub-text d-block">{item.days} days @ KES {item.dailyRate}/day</span>
        </div>
      ),
    },
    {
      title: "Total Amount",
      key: "totalAmount",
      render: (item) => <span className="tb-amount">KES {item.totalAmount.toLocaleString()}</span>,
    },
    {
      title: "Commission",
      key: "commission",
      render: (item) => <span className="tb-amount text-danger">-KES {item.commission.toLocaleString()}</span>,
    },
    {
      title: "Net Earnings",
      key: "netEarnings",
      render: (item) => <span className="tb-amount text-success">KES {item.netEarnings.toLocaleString()}</span>,
    },
    {
      title: "Status",
      key: "status",
      render: (item) => {
        const statusColors = {
          paid: "success",
          pending: "warning",
          processing: "info",
          failed: "danger",
        };
        return (
          <div>
            <span className={`badge badge-outline-${statusColors[item.status] || "secondary"}`}>
              {item.status}
            </span>
            {item.payoutDate && (
              <span className="sub-text d-block">Paid: {item.payoutDate}</span>
            )}
          </div>
        );
      },
    },
  ];

  const handleView = (item) => {
    console.log("View earning details:", item);
    // TODO: Navigate to earning details
  };

  const handleRequestPayout = (item) => {
    if (item.status === "pending") {
      console.log("Request payout for:", item);
      // TODO: Implement payout request
      alert("Payout request submitted successfully!");
    }
  };

  const handleBulkAction = (action, selectedIds) => {
    console.log(`Bulk action: ${action} on IDs: ${selectedIds}`);
    // TODO: Implement bulk actions
  };

  const getActions = (item) => {
    const actions = [
      { label: "View", icon: "eye", onClick: handleView, color: "primary" },
    ];

    if (item.status === "pending") {
      actions.push({
        label: "Request Payout",
        icon: "wallet",
        onClick: handleRequestPayout,
        color: "success",
      });
    }

    return actions;
  };

  // Calculate totals
  const totalEarnings = earnings.reduce((sum, e) => sum + e.netEarnings, 0);
  const totalCommission = earnings.reduce((sum, e) => sum + e.commission, 0);
  const pendingPayouts = earnings
    .filter((e) => e.status === "pending")
    .reduce((sum, e) => sum + e.netEarnings, 0);
  const paidEarnings = earnings
    .filter((e) => e.status === "paid")
    .reduce((sum, e) => sum + e.netEarnings, 0);

  return (
    <React.Fragment>
      <Head title="Car Rental Earnings" />
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page>Earnings Overview</BlockTitle>
              <p className="text-soft">Track your car rental earnings and payouts</p>
            </BlockHeadContent>
            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle">
                <Button color="light" outline className="btn-white btn-dim btn-sm me-2">
                  <Icon name="download" />
                  <span>Export Report</span>
                </Button>
                <Button color="primary" className="btn-sm">
                  <Icon name="wallet" />
                  <span>Request Payout</span>
                </Button>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        <Block>
          <BlockContent>
            {/* Earnings Summary Cards */}
            <Row className="g-gs mb-4">
              <Col sm="6" lg="3">
                <div className="card card-bordered h-100">
                  <div className="card-inner">
                    <div className="card-title-group align-start mb-0">
                      <div className="card-title">
                        <h6 className="title">Total Earnings</h6>
                      </div>
                      <div className="card-tools">
                        <em className="card-hint-icon icon ni ni-growth text-success"></em>
                      </div>
                    </div>
                    <div className="card-amount">
                      <span className="amount text-success">KES {totalEarnings.toLocaleString()}</span>
                      <span className="change up text-success">
                        <em className="icon ni ni-arrow-up"></em>12.5%
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
                        <h6 className="title">Paid Earnings</h6>
                      </div>
                      <div className="card-tools">
                        <em className="card-hint-icon icon ni ni-wallet text-primary"></em>
                      </div>
                    </div>
                    <div className="card-amount">
                      <span className="amount text-primary">KES {paidEarnings.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </Col>

              <Col sm="6" lg="3">
                <div className="card card-bordered h-100">
                  <div className="card-inner">
                    <div className="card-title-group align-start mb-0">
                      <div className="card-title">
                        <h6 className="title">Pending Payouts</h6>
                      </div>
                      <div className="card-tools">
                        <em className="card-hint-icon icon ni ni-clock text-warning"></em>
                      </div>
                    </div>
                    <div className="card-amount">
                      <span className="amount text-warning">KES {pendingPayouts.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </Col>

              <Col sm="6" lg="3">
                <div className="card card-bordered h-100">
                  <div className="card-inner">
                    <div className="card-title-group align-start mb-0">
                      <div className="card-title">
                        <h6 className="title">Total Commission</h6>
                      </div>
                      <div className="card-tools">
                        <em className="card-hint-icon icon ni ni-percent text-danger"></em>
                      </div>
                    </div>
                    <div className="card-amount">
                      <span className="amount text-danger">KES {totalCommission.toLocaleString()}</span>
                      <span className="sub-text">Platform fees</span>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

            {/* Earnings Chart Placeholder */}
            <div className="card card-bordered mb-4">
              <div className="card-inner">
                <div className="card-title-group">
                  <div className="card-title">
                    <h6 className="title">Earnings Trend</h6>
                  </div>
                  <div className="card-tools">
                    <select 
                      className="form-select form-select-sm"
                      value={timeFilter}
                      onChange={(e) => setTimeFilter(e.target.value)}
                    >
                      <option value="this_week">This Week</option>
                      <option value="this_month">This Month</option>
                      <option value="last_3_months">Last 3 Months</option>
                      <option value="this_year">This Year</option>
                    </select>
                  </div>
                </div>
                <div className="card-amount">
                  <div className="placeholder-chart bg-light rounded" style={{ height: "200px" }}>
                    <div className="d-flex align-items-center justify-content-center h-100">
                      <span className="text-muted">Earnings Chart Placeholder</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Earnings Table */}
            <AdminDataTable
              data={earnings}
              columns={columns}
              actions={getActions(earnings[0])} // Pass sample actions
              onBulkAction={handleBulkAction}
              selectable={true}
            />
          </BlockContent>
        </Block>
      </Content>
    </React.Fragment>
  );
};

export default Earnings;
