import React, { useState } from 'react'
import { Modal, ModalBody } from 'reactstrap'
import { Row, Col } from 'react-bootstrap'
import { m } from 'framer-motion'
import Buttons from '../Button/Buttons'
import { usePaymentMethods, useProcessCardPayment, useProcessMobilePayment } from '../../api/usePayments'
import { fadeIn } from '../../Functions/GlobalAnimations'

const PaymentModal = ({ 
    isOpen, 
    onClose, 
    onSuccess,
    paymentData,
    className = '' 
}) => {
    const [selectedMethod, setSelectedMethod] = useState('')
    const [cardDetails, setCardDetails] = useState({
        card_number: '',
        expiry_month: '',
        expiry_year: '',
        cvv: '',
        cardholder_name: ''
    })
    const [mobileDetails, setMobileDetails] = useState({
        phone_number: '',
        provider: '' // mpesa, airtel, etc.
    })
    const [isProcessing, setIsProcessing] = useState(false)

    const { data: paymentMethods = [] } = usePaymentMethods()
    const processCardPayment = useProcessCardPayment()
    const processMobilePayment = useProcessMobilePayment()

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES',
            minimumFractionDigits: 0,
        }).format(price)
    }

    const handlePayment = async () => {
        if (!selectedMethod || !paymentData) return

        setIsProcessing(true)

        try {
            if (selectedMethod === 'card') {
                await processCardPayment.mutateAsync({
                    amount: paymentData.amount,
                    currency: paymentData.currency || 'KES',
                    reference: paymentData.reference,
                    metadata: paymentData.metadata,
                    card_details: cardDetails
                })
            } else if (selectedMethod === 'mobile') {
                await processMobilePayment.mutateAsync({
                    amount: paymentData.amount,
                    currency: paymentData.currency || 'KES',
                    reference: paymentData.reference,
                    metadata: paymentData.metadata,
                    phone_number: mobileDetails.phone_number,
                    provider: mobileDetails.provider
                })
            }

            onSuccess?.()
            onClose()
        } catch (error) {
            console.error('Payment failed:', error)
            alert('Payment failed. Please try again.')
        } finally {
            setIsProcessing(false)
        }
    }

    const handleCardInputChange = (field, value) => {
        setCardDetails(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleMobileInputChange = (field, value) => {
        setMobileDetails(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const isFormValid = () => {
        if (selectedMethod === 'card') {
            return (
                cardDetails.card_number &&
                cardDetails.expiry_month &&
                cardDetails.expiry_year &&
                cardDetails.cvv &&
                cardDetails.cardholder_name
            )
        } else if (selectedMethod === 'mobile') {
            return (
                mobileDetails.phone_number &&
                mobileDetails.provider
            )
        }
        return false
    }

    if (!paymentData) return null

    return (
        <Modal 
            isOpen={isOpen} 
            toggle={onClose} 
            className={`modal-dialog-centered ${className}`}
            size="md"
        >
            <ModalBody>
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
                >
                    <i className="feather-x text-xl"></i>
                </button>

                <div className="p-6">
                    <m.div {...fadeIn}>
                        {/* Header */}
                        <div className="text-center mb-6">
                            <h3 className="font-serif font-semibold text-2xl text-darkgray mb-2">
                                Complete Payment
                            </h3>
                            <p className="text-[#777]">
                                Secure payment processing
                            </p>
                        </div>

                        {/* Payment Summary */}
                        <div className="payment-summary bg-gray-50 p-4 rounded mb-6">
                            <h4 className="font-serif font-medium text-lg mb-3">Payment Summary</h4>
                            <div className="flex justify-between items-center">
                                <span className="text-[#777]">Total Amount:</span>
                                <span className="font-serif font-semibold text-[#ca943d] text-xl">
                                    {formatPrice(paymentData.amount)}
                                </span>
                            </div>
                            {paymentData.description && (
                                <p className="text-sm text-[#777] mt-2">{paymentData.description}</p>
                            )}
                        </div>

                        {/* Payment Methods */}
                        <div className="payment-methods mb-6">
                            <h4 className="font-serif font-medium text-lg mb-4">Select Payment Method</h4>
                            
                            <div className="space-y-3">
                                {/* Card Payment */}
                                <div 
                                    className={`payment-method-option p-4 border rounded cursor-pointer transition-colors ${
                                        selectedMethod === 'card' 
                                            ? 'border-[#ca943d] bg-[#ca943d]/5' 
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                    onClick={() => setSelectedMethod('card')}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-4 h-4 rounded-full border-2 ${
                                                selectedMethod === 'card' 
                                                    ? 'border-[#ca943d] bg-[#ca943d]' 
                                                    : 'border-gray-300'
                                            }`}>
                                                {selectedMethod === 'card' && (
                                                    <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                                                )}
                                            </div>
                                            <i className="fas fa-credit-card text-[#ca943d]"></i>
                                            <span className="font-medium">Credit/Debit Card</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <i className="fab fa-cc-visa text-blue-600"></i>
                                            <i className="fab fa-cc-mastercard text-red-600"></i>
                                        </div>
                                    </div>
                                </div>

                                {/* Mobile Payment */}
                                <div 
                                    className={`payment-method-option p-4 border rounded cursor-pointer transition-colors ${
                                        selectedMethod === 'mobile' 
                                            ? 'border-[#ca943d] bg-[#ca943d]/5' 
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                    onClick={() => setSelectedMethod('mobile')}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-4 h-4 rounded-full border-2 ${
                                                selectedMethod === 'mobile' 
                                                    ? 'border-[#ca943d] bg-[#ca943d]' 
                                                    : 'border-gray-300'
                                            }`}>
                                                {selectedMethod === 'mobile' && (
                                                    <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                                                )}
                                            </div>
                                            <i className="fas fa-mobile-alt text-[#ca943d]"></i>
                                            <span className="font-medium">Mobile Money</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">M-PESA</span>
                                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Airtel</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Form */}
                        {selectedMethod === 'card' && (
                            <div className="card-payment-form">
                                <h4 className="font-serif font-medium text-lg mb-4">Card Details</h4>
                                <Row className="g-3">
                                    <Col md={12}>
                                        <div className="form-group">
                                            <label className="form-label font-serif font-medium text-darkgray mb-2 block">
                                                Cardholder Name
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control h-[52px] rounded-[2px] border-[1px] border-solid border-[#dfdfdf]"
                                                value={cardDetails.cardholder_name}
                                                onChange={(e) => handleCardInputChange('cardholder_name', e.target.value)}
                                                placeholder="Enter cardholder name"
                                                required
                                            />
                                        </div>
                                    </Col>
                                    
                                    <Col md={12}>
                                        <div className="form-group">
                                            <label className="form-label font-serif font-medium text-darkgray mb-2 block">
                                                Card Number
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control h-[52px] rounded-[2px] border-[1px] border-solid border-[#dfdfdf]"
                                                value={cardDetails.card_number}
                                                onChange={(e) => handleCardInputChange('card_number', e.target.value.replace(/\D/g, '').slice(0, 16))}
                                                placeholder="1234 5678 9012 3456"
                                                maxLength="19"
                                                required
                                            />
                                        </div>
                                    </Col>
                                    
                                    <Col md={4}>
                                        <div className="form-group">
                                            <label className="form-label font-serif font-medium text-darkgray mb-2 block">
                                                Month
                                            </label>
                                            <select
                                                className="form-control h-[52px] rounded-[2px] border-[1px] border-solid border-[#dfdfdf]"
                                                value={cardDetails.expiry_month}
                                                onChange={(e) => handleCardInputChange('expiry_month', e.target.value)}
                                                required
                                            >
                                                <option value="">MM</option>
                                                {Array.from({ length: 12 }, (_, i) => (
                                                    <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                                                        {String(i + 1).padStart(2, '0')}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </Col>
                                    
                                    <Col md={4}>
                                        <div className="form-group">
                                            <label className="form-label font-serif font-medium text-darkgray mb-2 block">
                                                Year
                                            </label>
                                            <select
                                                className="form-control h-[52px] rounded-[2px] border-[1px] border-solid border-[#dfdfdf]"
                                                value={cardDetails.expiry_year}
                                                onChange={(e) => handleCardInputChange('expiry_year', e.target.value)}
                                                required
                                            >
                                                <option value="">YYYY</option>
                                                {Array.from({ length: 20 }, (_, i) => (
                                                    <option key={2024 + i} value={2024 + i}>
                                                        {2024 + i}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </Col>
                                    
                                    <Col md={4}>
                                        <div className="form-group">
                                            <label className="form-label font-serif font-medium text-darkgray mb-2 block">
                                                CVV
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control h-[52px] rounded-[2px] border-[1px] border-solid border-[#dfdfdf]"
                                                value={cardDetails.cvv}
                                                onChange={(e) => handleCardInputChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                                                placeholder="123"
                                                maxLength="4"
                                                required
                                            />
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        )}

                        {selectedMethod === 'mobile' && (
                            <div className="mobile-payment-form">
                                <h4 className="font-serif font-medium text-lg mb-4">Mobile Money Details</h4>
                                <Row className="g-3">
                                    <Col md={12}>
                                        <div className="form-group">
                                            <label className="form-label font-serif font-medium text-darkgray mb-2 block">
                                                Mobile Provider
                                            </label>
                                            <select
                                                className="form-control h-[52px] rounded-[2px] border-[1px] border-solid border-[#dfdfdf]"
                                                value={mobileDetails.provider}
                                                onChange={(e) => handleMobileInputChange('provider', e.target.value)}
                                                required
                                            >
                                                <option value="">Select Provider</option>
                                                <option value="mpesa">M-PESA (Safaricom)</option>
                                                <option value="airtel">Airtel Money</option>
                                                <option value="tkash">T-Kash (Telkom)</option>
                                            </select>
                                        </div>
                                    </Col>
                                    
                                    <Col md={12}>
                                        <div className="form-group">
                                            <label className="form-label font-serif font-medium text-darkgray mb-2 block">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                className="form-control h-[52px] rounded-[2px] border-[1px] border-solid border-[#dfdfdf]"
                                                value={mobileDetails.phone_number}
                                                onChange={(e) => handleMobileInputChange('phone_number', e.target.value)}
                                                placeholder="0712345678"
                                                required
                                            />
                                        </div>
                                    </Col>
                                </Row>
                                
                                {selectedMethod === 'mobile' && mobileDetails.provider === 'mpesa' && (
                                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                                        <div className="flex items-center">
                                            <i className="fas fa-info-circle text-green-600 mr-2"></i>
                                            <span className="text-green-800 text-sm">
                                                You will receive an M-PESA prompt on your phone to complete the payment.
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex justify-between items-center mt-8">
                            <Buttons
                                onClick={onClose}
                                className="btn-fancy btn-transparent font-medium font-serif rounded-[2px] uppercase"
                                themeColor="#777"
                                color="#777"
                                title="Cancel"
                            />
                            
                            <Buttons
                                onClick={handlePayment}
                                disabled={!isFormValid() || isProcessing}
                                className="btn-fancy btn-fill font-medium font-serif rounded-[2px] uppercase"
                                themeColor="#ca943d"
                                color="#fff"
                                size="lg"
                                title={isProcessing ? "Processing..." : `Pay ${formatPrice(paymentData.amount)}`}
                            />
                        </div>

                        {/* Security Notice */}
                        <div className="mt-6 text-center">
                            <div className="flex items-center justify-center gap-2 text-sm text-[#777]">
                                <i className="fas fa-lock text-green-600"></i>
                                <span>Your payment information is secure and encrypted</span>
                            </div>
                        </div>
                    </m.div>
                </div>
            </ModalBody>
        </Modal>
    )
}

export default PaymentModal
