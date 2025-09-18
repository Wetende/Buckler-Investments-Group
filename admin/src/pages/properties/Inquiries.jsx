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

const Inquiries = () => {
  const [inquiries, setInquiries] = useState([
    {
      id: 1,
      name: "James Mwangi",
      email: "james@example.com",
      phone: "+254712345678",
      property: "4BR Villa - Karen",
      message: "I'd like to schedule a viewing this weekend.",
      date: "2024-02-10",
      status: "open",
      source: "website",
    },
    {
      id: 2,
      name: "Grace Wanjiku",
      email: "grace@example.com",
      phone: "+254711223344",
      property: "2BR Apartment - Westlands",
      message: "Is the apartment still available for March?",
      date: "2024-02-11",
      status: "responded",
      source: "website",
    },
    {
      id: 3,
      name: "Peter Ochieng",
      email: "peter@example.com",
      phone: "+254798765432",
      property: "Commercial Plot - CBD",
      message: "Can we negotiate the price?",
      date: "2024-02-12",
      status: "closed",
      source: "phone",
    },
  ]);

  const columns = [
    { title: "Client", key: "name", render: (i) => (
      <div>
        <span className="tb-lead">{i.name}</span>
        <span className="sub-text d-block">{i.email} • {i.phone}</span>
      </div>
    ) },
    { title: "Property", key: "property" },
    { title: "Message", key: "message", render: (i) => (
      <span className="text-wrap" style={{ maxWidth: 300, display: 'inline-block' }}>{i.message}</span>
    ) },
    { title: "Date", key: "date" },
    { title: "Status", key: "status", render: (i) => (
      <span className={`badge badge-outline-${i.status === 'open' ? 'warning' : i.status === 'responded' ? 'info' : 'success'}`}>
        {i.status}
      </span>
    ) },
  ];

  const handleRespond = (item) => {
    setInquiries(prev => prev.map(i => i.id === item.id ? { ...i, status: 'responded' } : i));
  };

  const handleClose = (item) => {
    setInquiries(prev => prev.map(i => i.id === item.id ? { ...i, status: 'closed' } : i));
  };

  const actions = [
    { label: 'Respond', icon: 'chat', color: 'primary', onClick: handleRespond },
    { label: 'Close', icon: 'check', color: 'success', onClick: handleClose },
  ];

  return (
    <React.Fragment>
      <Head title="Property Inquiries" />
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page>Property Inquiries</BlockTitle>
            </BlockHeadContent>
            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle">
                <Button color="light" outline className="btn-white btn-dim btn-sm me-2">
                  <Icon name="download" />
                  <span>Export</span>
                </Button>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        <Block>
          <BlockContent>
            <AdminDataTable
              data={inquiries}
              columns={columns}
              actions={actions}
              selectable={true}
              onBulkAction={() => {}}
            />
          </BlockContent>
        </Block>
      </Content>
    </React.Fragment>
  );
};

export default Inquiries;


