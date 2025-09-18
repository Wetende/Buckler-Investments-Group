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
import { Card, CardBody, Modal, ModalBody } from "reactstrap";
import { useBnbPayouts, useRequestPayout } from "@/hooks/useBnb";
import { toast } from "react-toastify";
import { useState as useStatePayout, useEffect } from "react";

const Payouts = () => {
  const [sm, updateSm] = useState(false);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('bank_transfer');

  // API hooks for real data
  const { data: payoutsData, isLoading, error, refetch } = useBnbPayouts();
  const requestPayoutMutation = useRequestPayout();

  const payouts = payoutsData?.items || [];
  const availableBalance = payoutsData?.available_balance || 0;

  // Mock payout data (fallback)
  const mockPayouts = [
    {
      id: "PAY001",
      amount: 94500,
      earnings: [
        { booking: "BNB001", amount: 40500 },
        { booking: "BNB003", amount: 54000 }
      ],
      status: "completed",
      requestDate: "2024-01-31",
      processedDate: "2024-02-02",
      method: "bank_transfer",
      transactionId: "TXN789456123",
      bankAccount: "****1234"
    },
    {
      id: "PAY002",
      amount: 15300,
      earnings: [
        { booking: "BNB002", amount: 15300 }
      ],
      status: "processing",
      requestDate: "2024-02-05",
      processedDate: null,
      method: "mpesa",
      transactionId: null,
      phoneNumber: "****7890"
    },
    {
      id: "PAY003",
      amount: 128500,
      earnings: [
        { booking: "BNB004", amount: 68000 },
        { booking: "BNB005", amount: 32000 },
        { booking: "BNB006", amount: 28500 }
      ],
      status: "pending",
      requestDate: "2024-02-08",
      processedDate: null,
      method: "bank_transfer",
      transactionId: null,
      bankAccount: "****5678"
    },
    {
      id: "PAY004",
      amount: 45000,
      earnings: [
        { booking: "BNB007", amount: 45000 }
      ],
      status: "failed",
      requestDate: "2024-02-01",
      processedDate: null,
      method: "bank_transfer",
      transactionId: null,
      bankAccount: "****9999",
      failureReason: "Invalid account details"
    }
  ];

  // Use real payouts data if available, otherwise fallback to mock data
  const payoutsToUse = payouts.length > 0 ? payouts : mockPayouts;
  
  const metrics = payoutsData?.summary || {
    totalPayouts: payoutsToUse.reduce((sum, p) => sum + p.amount, 0),
    completedPayouts: payoutsToUse.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0),
    pendingAmount: payoutsToUse.filter(p => p.status === 'pending' || p.status === 'processing').reduce((sum, p) => sum + p.amount, 0),
    availableBalance: availableBalance || 85000,
    nextPayoutDate: payoutsData?.next_payout_date || "2024-02-15"
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
      case 'processing': return 'info';
      case 'pending': return 'warning';
      case 'failed': return 'danger';
      default: return 'light';
    }
  };

  const getMethodIcon = (method) => {
    switch (method) {
      case 'bank_transfer': return 'building-bank';
      case 'mpesa': return 'mobile';
      case 'paypal': return 'paypal';
      default: return 'wallet';
    }
  };

  // Payout request handlers
  const handleRequestPayout = () => {
    setShowPayoutModal(true);
  };

  const handleSubmitPayout = async () => {
    if (!selectedAmount || parseFloat(selectedAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (parseFloat(selectedAmount) > metrics.availableBalance) {
      toast.error('Amount exceeds available balance');
      return;
    }

    try {
      await requestPayoutMutation.mutateAsync({
        id: 0, // Create new payout request
        amount: parseFloat(selectedAmount),
        method: selectedMethod
      });
      setShowPayoutModal(false);
      setSelectedAmount('');
      setSelectedMethod('bank_transfer');
    } catch (error) {
      console.error('Payout request failed:', error);
    }
  };

  const handleCloseModal = () => {
    setShowPayoutModal(false);
    setSelectedAmount('');
    setSelectedMethod('bank_transfer');
  };

  return (
    <React.Fragment>
      <Head title="Payouts" />
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page>Payouts</BlockTitle>
              <BlockDes className="text-soft">
                <p>Manage your payout requests and track payment history.</p>
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
                        <Icon name="setting"></Icon>
                        <span>Payout Settings</span>
                      </Button>
                    </li>
                    <li className="nk-block-tools-opt">
                      <Button color="primary" onClick={handleRequestPayout}>
                        <Icon name="wallet-out"></Icon>
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
                      <h6 className="subtitle">Available Balance</h6>
                    </div>
                    <div className="card-tools">
                      <Icon name="wallet" className="card-hint-icon text-primary"></Icon>
                    </div>
                  </div>
                  <div className="card-amount">
                    <span className="amount">{formatCurrency(metrics.availableBalance)}</span>
                  </div>
                  <div className="card-amount-sm">
                    Ready for withdrawal
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xxl="3" sm="6">
              <Card className="card-bordered">
                <CardBody className="card-inner">
                  <div className="card-title-group align-start mb-0">
                    <div className="card-title">
                      <h6 className="subtitle">Total Payouts</h6>
                    </div>
                    <div className="card-tools">
                      <Icon name="coins" className="card-hint-icon text-success"></Icon>
                    </div>
                  </div>
                  <div className="card-amount">
                    <span className="amount">{formatCurrency(metrics.totalPayouts)}</span>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xxl="3" sm="6">
              <Card className="card-bordered">
                <CardBody className="card-inner">
                  <div className="card-title-group align-start mb-0">
                    <div className="card-title">
                      <h6 className="subtitle">Pending Amount</h6>
                    </div>
                    <div className="card-tools">
                      <Icon name="clock" className="card-hint-icon text-warning"></Icon>
                    </div>
                  </div>
                  <div className="card-amount">
                    <span className="amount">{formatCurrency(metrics.pendingAmount)}</span>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xxl="3" sm="6">
              <Card className="card-bordered">
                <CardBody className="card-inner">
                  <div className="card-title-group align-start mb-0">
                    <div className="card-title">
                      <h6 className="subtitle">Next Payout</h6>
                    </div>
                    <div className="card-tools">
                      <Icon name="calendar" className="card-hint-icon text-info"></Icon>
                    </div>
                  </div>
                  <div className="card-amount">
                    <span className="amount">{formatDate(metrics.nextPayoutDate)}</span>
                  </div>
                  <div className="card-amount-sm">
                    Scheduled payout date
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Block>

        {/* Payout Methods */}
        <Block>
          <Card className="card-bordered">
            <CardBody className="card-inner">
              <div className="card-title-group">
                <div className="card-title">
                  <h6 className="title">Payout Methods</h6>
                </div>
                <div className="card-tools">
                  <Button color="primary" outline size="sm">
                    <Icon name="plus"></Icon>
                    <span>Add Method</span>
                  </Button>
                </div>
              </div>
              <Row className="g-3">
                <Col md="4">
                  <div className="payout-method p-3 border rounded">
                    <div className="d-flex align-items-center">
                      <Icon name="building-bank" className="text-primary mr-3" style={{ fontSize: '24px' }}></Icon>
                      <div>
                        <h6 className="mb-0">Bank Transfer</h6>
                        <span className="text-soft">****1234 (Primary)</span>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col md="4">
                  <div className="payout-method p-3 border rounded">
                    <div className="d-flex align-items-center">
                      <Icon name="mobile" className="text-success mr-3" style={{ fontSize: '24px' }}></Icon>
                      <div>
                        <h6 className="mb-0">M-Pesa</h6>
                        <span className="text-soft">+254****7890</span>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col md="4">
                  <div className="payout-method p-3 border rounded border-dashed text-center">
                    <Icon name="plus-circle" className="text-muted" style={{ fontSize: '24px' }}></Icon>
                    <div className="mt-2">
                      <span className="text-soft">Add New Method</span>
                    </div>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Block>

        {/* Payouts Table */}
        <Block>
          <DataTable className="card-stretch">
            <div className="card-inner position-relative card-tools-toggle">
              <div className="card-title-group">
                <div className="card-title">
                  <h6 className="title">Payout History</h6>
                </div>
                <div className="card-tools">
                  <div className="form-inline flex-nowrap gx-3">
                    <div className="form-wrap w-150px">
                      <select className="form-select js-select2" data-search="off">
                        <option value="all">All Status</option>
                        <option value="completed">Completed</option>
                        <option value="processing">Processing</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
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
                  <span className="sub-text">Payout ID</span>
                </DataTableRow>
                <DataTableRow size="md">
                  <span className="sub-text">Amount</span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text">Method</span>
                </DataTableRow>
                <DataTableRow size="md">
                  <span className="sub-text">Request Date</span>
                </DataTableRow>
                <DataTableRow size="md">
                  <span className="sub-text">Status</span>
                </DataTableRow>
                <DataTableRow size="md">
                  <span className="sub-text">Processed Date</span>
                </DataTableRow>
                <DataTableRow className="nk-tb-col-tools text-right">
                  <span className="sub-text">Action</span>
                </DataTableRow>
              </DataTableHead>
              {payoutsToUse.map((payout) => (
                <DataTableItem key={payout.id}>
                  <DataTableRow>
                    <div>
                      <span className="tb-lead">{payout.id}</span>
                      <div className="tb-sub text-muted small">
                        {payout.earnings.length} booking{payout.earnings.length > 1 ? 's' : ''}
                      </div>
                    </div>
                  </DataTableRow>
                  <DataTableRow size="md">
                    <span className="tb-amount">{formatCurrency(payout.amount)}</span>
                  </DataTableRow>
                  <DataTableRow size="lg">
                    <div className="d-flex align-items-center">
                      <Icon name={getMethodIcon(payout.method)} className="mr-2"></Icon>
                      <div>
                        <span className="tb-lead">
                          {payout.method === 'bank_transfer' ? 'Bank Transfer' : 
                           payout.method === 'mpesa' ? 'M-Pesa' : 'PayPal'}
                        </span>
                        <div className="tb-sub text-muted">
                          {payout.bankAccount || payout.phoneNumber || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </DataTableRow>
                  <DataTableRow size="md">
                    <span className="tb-lead">{formatDate(payout.requestDate)}</span>
                  </DataTableRow>
                  <DataTableRow size="md">
                    <div>
                      <Badge color={getStatusColor(payout.status)}>
                        {payout.status}
                      </Badge>
                      {payout.failureReason && (
                        <div className="tb-sub text-danger small mt-1">
                          {payout.failureReason}
                        </div>
                      )}
                    </div>
                  </DataTableRow>
                  <DataTableRow size="md">
                    <span className="tb-lead">{formatDate(payout.processedDate)}</span>
                  </DataTableRow>
                  <DataTableRow className="nk-tb-col-tools">
                    <ul className="nk-tb-actions gx-1">
                      <li>
                        <Button
                          color="light"
                          size="sm"
                          className="btn-icon"
                          onClick={() => {
                            // View payout details
                          }}
                        >
                          <Icon name="eye"></Icon>
                        </Button>
                      </li>
                      {payout.status === 'failed' && (
                        <li>
                          <Button
                            color="primary"
                            size="sm"
                            className="btn-icon"
                            onClick={() => {
                              // Retry payout
                            }}
                          >
                            <Icon name="reload"></Icon>
                          </Button>
                        </li>
                      )}
                    </ul>
                  </DataTableRow>
                </DataTableItem>
              ))}
            </DataTableBody>
          </DataTable>
        </Block>

        {/* Payout Request Modal */}
        <Modal 
          isOpen={showPayoutModal} 
          toggle={handleCloseModal} 
          className="modal-dialog-centered" 
          size="md"
        >
          <ModalBody>
            <a 
              href="#close" 
              onClick={(e) => {
                e.preventDefault();
                handleCloseModal();
              }} 
              className="close"
            >
              <Icon name="cross-sm" />
            </a>
            <div className="p-2">
              <h5 className="title">Request Payout</h5>
              <div className="mt-4">
                <div className="form-group">
                  <label className="form-label">Available Balance</label>
                  <div className="form-control-wrap">
                    <div className="form-control-plaintext">
                      <span className="amount h5 text-primary">
                        {formatCurrency(metrics.availableBalance)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Payout Amount</label>
                  <div className="form-control-wrap">
                    <input 
                      type="number" 
                      className="form-control" 
                      placeholder="Enter amount"
                      value={selectedAmount}
                      onChange={(e) => setSelectedAmount(e.target.value)}
                      max={metrics.availableBalance}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="form-note">
                    Maximum: {formatCurrency(metrics.availableBalance)}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Payout Method</label>
                  <div className="form-control-wrap">
                    <select 
                      className="form-select"
                      value={selectedMethod}
                      onChange={(e) => setSelectedMethod(e.target.value)}
                    >
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="mpesa">M-Pesa</option>
                      <option value="paypal">PayPal</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <Button 
                    type="button" 
                    color="primary"
                    size="lg"
                    onClick={handleSubmitPayout}
                    disabled={requestPayoutMutation.isLoading}
                    className="w-100"
                  >
                    {requestPayoutMutation.isLoading ? 'Processing...' : 'Request Payout'}
                  </Button>
                </div>

                <div className="alert alert-light">
                  <Icon name="info" className="mr-2" />
                  Payouts are processed within 1-3 business days depending on the method.
                </div>
              </div>
            </div>
          </ModalBody>
        </Modal>

      </Content>
    </React.Fragment>
  );
};

export default Payouts;

