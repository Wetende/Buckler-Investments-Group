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

const Orders = () => {
  const [orders, setOrders] = useState([
    {
      id: 1,
      orderId: "INV001",
      productName: "Growth Fund Alpha",
      customerName: "John Doe",
      customerEmail: "john@example.com",
      orderType: "buy",
      amount: 50000,
      units: 125.5,
      unitPrice: 398.41,
      status: "completed",
      orderDate: "2024-01-15",
      settledDate: "2024-01-17",
      reference: "TXN123456789",
    },
    {
      id: 2,
      orderId: "INV002",
      productName: "Conservative Bond Fund",
      customerName: "Jane Smith",
      customerEmail: "jane@example.com",
      orderType: "buy",
      amount: 100000,
      units: 250.0,
      unitPrice: 400.0,
      status: "pending",
      orderDate: "2024-02-01",
      settledDate: null,
      reference: "TXN123456790",
    },
    {
      id: 3,
      orderId: "INV003",
      productName: "Equity Growth Fund",
      customerName: "Mike Johnson",
      customerEmail: "mike@example.com",
      orderType: "sell",
      amount: 25000,
      units: 60.0,
      unitPrice: 416.67,
      status: "processing",
      orderDate: "2024-02-03",
      settledDate: null,
      reference: "TXN123456791",
    },
    {
      id: 4,
      orderId: "INV004",
      productName: "Money Market Fund",
      customerName: "Sarah Wilson",
      customerEmail: "sarah@example.com",
      orderType: "buy",
      amount: 75000,
      units: 750.0,
      unitPrice: 100.0,
      status: "failed",
      orderDate: "2024-02-05",
      settledDate: null,
      reference: "TXN123456792",
    },
  ]);

  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const columns = [
    {
      title: "Order",
      key: "orderId",
      render: (item) => (
        <div>
          <span className="tb-lead">#{item.orderId}</span>
          <span className="sub-text d-block">{item.reference}</span>
        </div>
      ),
    },
    {
      title: "Product",
      key: "productName",
      render: (item) => <span className="tb-lead">{item.productName}</span>,
    },
    {
      title: "Customer",
      key: "customerName",
      render: (item) => (
        <div>
          <span className="tb-lead">{item.customerName}</span>
          <span className="sub-text d-block">{item.customerEmail}</span>
        </div>
      ),
    },
    {
      title: "Type",
      key: "orderType",
      render: (item) => (
        <span className={`badge badge-outline-${item.orderType === "buy" ? "success" : "warning"}`}>
          {item.orderType.toUpperCase()}
        </span>
      ),
    },
    {
      title: "Amount & Units",
      key: "amount",
      render: (item) => (
        <div>
          <span className="tb-amount">KES {item.amount.toLocaleString()}</span>
          <span className="sub-text d-block">{item.units} units @ KES {item.unitPrice}</span>
        </div>
      ),
    },
    {
      title: "Order Date",
      key: "orderDate",
      render: (item) => (
        <div>
          <span className="tb-lead">{item.orderDate}</span>
          {item.settledDate && (
            <span className="sub-text d-block">Settled: {item.settledDate}</span>
          )}
        </div>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (item) => {
        const statusColors = {
          completed: "success",
          pending: "warning",
          processing: "info",
          failed: "danger",
          cancelled: "secondary",
        };
        return (
          <span className={`badge badge-outline-${statusColors[item.status] || "secondary"}`}>
            {item.status}
          </span>
        );
      },
    },
  ];

  const handleView = (item) => {
    console.log("View order details:", item);
    // TODO: Navigate to order details
  };

  const handleProcess = (item) => {
    if (item.status === "pending") {
      console.log("Process order:", item);
      setOrders(
        orders.map((order) =>
          order.id === item.id 
            ? { ...order, status: "processing" } 
            : order
        )
      );
      alert("Order processing initiated!");
    }
  };

  const handleCancel = (item) => {
    if (item.status === "pending" || item.status === "processing") {
      if (window.confirm(`Are you sure you want to cancel order ${item.orderId}?`)) {
        setOrders(
          orders.map((order) =>
            order.id === item.id 
              ? { ...order, status: "cancelled" } 
              : order
          )
        );
        console.log("Cancel order:", item);
      }
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
      actions.push(
        { label: "Process", icon: "check", onClick: handleProcess, color: "success" },
        { label: "Cancel", icon: "cross", onClick: handleCancel, color: "danger" }
      );
    }

    if (item.status === "processing") {
      actions.push({ label: "Cancel", icon: "cross", onClick: handleCancel, color: "danger" });
    }

    return actions;
  };

  // Filter orders based on status and type
  const filteredOrders = orders.filter((order) => {
    const statusMatch = statusFilter === "all" || order.status === statusFilter;
    const typeMatch = typeFilter === "all" || order.orderType === typeFilter;
    return statusMatch && typeMatch;
  });

  // Calculate totals
  const totalOrders = orders.length;
  const totalValue = orders.reduce((sum, order) => sum + order.amount, 0);
  const completedOrders = orders.filter((order) => order.status === "completed").length;
  const pendingOrders = orders.filter((order) => order.status === "pending").length;

  return (
    <React.Fragment>
      <Head title="Investment Orders" />
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page>Investment Orders</BlockTitle>
              <p className="text-soft">Manage all investment product orders</p>
            </BlockHeadContent>
            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle">
                <Button color="light" outline className="btn-white btn-dim btn-sm me-2">
                  <Icon name="download" />
                  <span>Export</span>
                </Button>
                <Button color="primary" className="btn-sm">
                  <Icon name="plus" />
                  <span>Manual Order</span>
                </Button>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        <Block>
          <BlockContent>
            {/* Orders Summary Cards */}
            <Row className="g-gs mb-4">
              <Col sm="6" lg="3">
                <div className="card card-bordered h-100">
                  <div className="card-inner">
                    <div className="card-title-group align-start mb-0">
                      <div className="card-title">
                        <h6 className="title">Total Orders</h6>
                      </div>
                      <div className="card-tools">
                        <em className="card-hint-icon icon ni ni-list text-primary"></em>
                      </div>
                    </div>
                    <div className="card-amount">
                      <span className="amount text-primary">{totalOrders}</span>
                    </div>
                  </div>
                </div>
              </Col>
              
              <Col sm="6" lg="3">
                <div className="card card-bordered h-100">
                  <div className="card-inner">
                    <div className="card-title-group align-start mb-0">
                      <div className="card-title">
                        <h6 className="title">Total Value</h6>
                      </div>
                      <div className="card-tools">
                        <em className="card-hint-icon icon ni ni-wallet text-success"></em>
                      </div>
                    </div>
                    <div className="card-amount">
                      <span className="amount text-success">KES {totalValue.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </Col>

              <Col sm="6" lg="3">
                <div className="card card-bordered h-100">
                  <div className="card-inner">
                    <div className="card-title-group align-start mb-0">
                      <div className="card-title">
                        <h6 className="title">Completed</h6>
                      </div>
                      <div className="card-tools">
                        <em className="card-hint-icon icon ni ni-check-circle text-success"></em>
                      </div>
                    </div>
                    <div className="card-amount">
                      <span className="amount text-success">{completedOrders}</span>
                      <span className="sub-text">
                        {totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0}% completion rate
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
                        <h6 className="title">Pending</h6>
                      </div>
                      <div className="card-tools">
                        <em className="card-hint-icon icon ni ni-clock text-warning"></em>
                      </div>
                    </div>
                    <div className="card-amount">
                      <span className="amount text-warning">{pendingOrders}</span>
                      <span className="sub-text">Require processing</span>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

            {/* Filters */}
            <div className="card card-bordered mb-4">
              <div className="card-inner">
                <Row className="g-3">
                  <Col sm="6" md="4">
                    <div className="form-group">
                      <label className="form-label">Filter by Status</label>
                      <select 
                        className="form-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="failed">Failed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </Col>
                  <Col sm="6" md="4">
                    <div className="form-group">
                      <label className="form-label">Filter by Type</label>
                      <select 
                        className="form-select"
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                      >
                        <option value="all">All Types</option>
                        <option value="buy">Buy Orders</option>
                        <option value="sell">Sell Orders</option>
                      </select>
                    </div>
                  </Col>
                  <Col sm="12" md="4">
                    <div className="form-group">
                      <label className="form-label">&nbsp;</label>
                      <div className="d-flex gap-2">
                        <Button 
                          color="light" 
                          outline 
                          onClick={() => {
                            setStatusFilter("all");
                            setTypeFilter("all");
                          }}
                        >
                          Clear Filters
                        </Button>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>

            {/* Orders Table */}
            <AdminDataTable
              data={filteredOrders}
              columns={columns}
              actions={getActions(orders[0])} // Pass sample actions
              onBulkAction={handleBulkAction}
              selectable={true}
            />
          </BlockContent>
        </Block>
      </Content>
    </React.Fragment>
  );
};

export default Orders;
