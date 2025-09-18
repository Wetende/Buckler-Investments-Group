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
} from "@/components/Component";
import AdminDataTable from "@/components/data/AdminDataTable";

const Rentals = () => {
  const [rentals, setRentals] = useState([
    {
      id: 1,
      vehicleId: 1,
      vehicleName: "Toyota Camry 2022",
      customerName: "John Doe",
      customerEmail: "john@example.com",
      startDate: "2024-02-01",
      endDate: "2024-02-05",
      totalAmount: 20000,
      status: "active",
      location: "Nairobi",
    },
    {
      id: 2,
      vehicleId: 2,
      vehicleName: "Honda CR-V 2021",
      customerName: "Jane Smith",
      customerEmail: "jane@example.com",
      startDate: "2024-01-28",
      endDate: "2024-02-02",
      totalAmount: 35000,
      status: "completed",
      location: "Mombasa",
    },
    {
      id: 3,
      vehicleId: 3,
      vehicleName: "Nissan X-Trail 2020",
      customerName: "Mike Johnson",
      customerEmail: "mike@example.com",
      startDate: "2024-02-10",
      endDate: "2024-02-15",
      totalAmount: 30000,
      status: "confirmed",
      location: "Kisumu",
    },
  ]);

  const columns = [
    {
      title: "Vehicle",
      key: "vehicleName",
      render: (item) => (
        <div>
          <span className="tb-lead">{item.vehicleName}</span>
          <span className="sub-text d-block">{item.location}</span>
        </div>
      ),
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
      title: "Rental Period",
      key: "period",
      render: (item) => (
        <div>
          <span className="tb-lead">{item.startDate} to {item.endDate}</span>
          <span className="sub-text d-block">
            {Math.ceil((new Date(item.endDate) - new Date(item.startDate)) / (1000 * 60 * 60 * 24))} days
          </span>
        </div>
      ),
    },
    {
      title: "Amount",
      key: "totalAmount",
      render: (item) => <span className="tb-amount">KES {item.totalAmount.toLocaleString()}</span>,
    },
    {
      title: "Status",
      key: "status",
      render: (item) => {
        const statusColors = {
          active: "success",
          completed: "info",
          confirmed: "warning",
          cancelled: "danger",
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
    console.log("View rental:", item);
    // TODO: Navigate to rental details
  };

  const handleEdit = (item) => {
    console.log("Edit rental:", item);
    // TODO: Navigate to edit rental form
  };

  const handleCancel = (item) => {
    if (window.confirm(`Are you sure you want to cancel the rental for ${item.vehicleName}?`)) {
      setRentals(
        rentals.map((rental) =>
          rental.id === item.id ? { ...rental, status: "cancelled" } : rental
        )
      );
      console.log("Cancel rental:", item);
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

    if (item.status === "confirmed") {
      actions.push({ label: "Edit", icon: "edit", onClick: handleEdit, color: "primary" });
    }

    if (item.status === "active" || item.status === "confirmed") {
      actions.push({ label: "Cancel", icon: "cross", onClick: handleCancel, color: "danger" });
    }

    return actions;
  };

  return (
    <React.Fragment>
      <Head title="Vehicle Rentals" />
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page>Vehicle Rentals</BlockTitle>
              <p className="text-soft">Manage all vehicle rental bookings</p>
            </BlockHeadContent>
            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle">
                <Button color="light" outline className="btn-white btn-dim btn-sm me-2">
                  <Icon name="download" />
                  <span>Export</span>
                </Button>
                <Button color="primary" className="btn-sm">
                  <Icon name="filter" />
                  <span>Filter</span>
                </Button>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        <Block>
          <BlockContent>
            <div className="row g-3 mb-3">
              <div className="col-sm-6 col-lg-3">
                <div className="card card-bordered h-100">
                  <div className="card-inner">
                    <div className="card-title-group align-start mb-0">
                      <div className="card-title">
                        <h6 className="title">Total Rentals</h6>
                      </div>
                    </div>
                    <div className="card-amount">
                      <span className="amount text-primary">{rentals.length}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-lg-3">
                <div className="card card-bordered h-100">
                  <div className="card-inner">
                    <div className="card-title-group align-start mb-0">
                      <div className="card-title">
                        <h6 className="title">Active Rentals</h6>
                      </div>
                    </div>
                    <div className="card-amount">
                      <span className="amount text-success">
                        {rentals.filter((r) => r.status === "active").length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-lg-3">
                <div className="card card-bordered h-100">
                  <div className="card-inner">
                    <div className="card-title-group align-start mb-0">
                      <div className="card-title">
                        <h6 className="title">Total Revenue</h6>
                      </div>
                    </div>
                    <div className="card-amount">
                      <span className="amount text-info">
                        KES {rentals.reduce((sum, r) => sum + r.totalAmount, 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-lg-3">
                <div className="card card-bordered h-100">
                  <div className="card-inner">
                    <div className="card-title-group align-start mb-0">
                      <div className="card-title">
                        <h6 className="title">Avg. Rental Value</h6>
                      </div>
                    </div>
                    <div className="card-amount">
                      <span className="amount text-warning">
                        KES {Math.round(rentals.reduce((sum, r) => sum + r.totalAmount, 0) / rentals.length).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <AdminDataTable
              data={rentals}
              columns={columns}
              actions={getActions(rentals[0])} // Pass sample actions, getActions will be called per row
              onBulkAction={handleBulkAction}
              selectable={true}
            />
          </BlockContent>
        </Block>
      </Content>
    </React.Fragment>
  );
};

export default Rentals;
