import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'
import { m } from 'framer-motion'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'

// Components
import { fadeIn } from '../../Functions/GlobalAnimations'
import Buttons from '../Button/Buttons'
import { Input, Select, TextArea, Checkbox } from '../Form/Form'
import MessageBox from '../MessageBox/MessageBox'

// API Hooks
import { useHostApplicationForm, usePersonalInfoPrefill, useSubmitHostApplication } from '../../api/useHost'

// Multi-step form component
const BecomeHostForm = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  
  const { 
    existingApplication, 
    isLoadingApplication, 
    saveApplication, 
    isSubmitting 
  } = useHostApplicationForm()
  
  const { data: prefillData } = usePersonalInfoPrefill()
  const submitApplication = useSubmitHostApplication()

  const totalSteps = 6 // 5 form steps + 1 review step

  // Load existing data if available
  useEffect(() => {
    if (existingApplication) {
      setFormData({
        personal_info: existingApplication.personal_info || {},
        property_details: existingApplication.property_details || {},
        pricing_availability: existingApplication.pricing_availability || {},
        hosting_experience: existingApplication.hosting_experience || {},
        documents: existingApplication.documents || {},
        terms_accepted: existingApplication.terms_accepted || false,
        privacy_policy_accepted: existingApplication.privacy_policy_accepted || false,
        marketing_emails_consent: existingApplication.marketing_emails_consent || false,
      })
    }
  }, [existingApplication])

  const steps = [
    { title: 'Personal Information', key: 'personal_info' },
    { title: 'Property Details', key: 'property_details' },
    { title: 'Pricing & Availability', key: 'pricing_availability' },
    { title: 'Hosting Experience', key: 'hosting_experience' },
    { title: 'Documents', key: 'documents' },
    { title: 'Review & Submit', key: 'review' },
  ]

  const handleStepComplete = async (stepData) => {
    const newFormData = { ...formData, ...stepData }
    setFormData(newFormData)

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleSubmit = async () => {
    try {
      setSubmitError(null)
      
      // Save the complete application
      const savedApplication = await saveApplication(formData)
      
      // Submit for review
      await submitApplication.mutateAsync(savedApplication.id)
      
      setIsSubmitted(true)
    } catch (error) {
      console.error('Failed to submit application:', error)
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to submit application'
      setSubmitError(errorMessage)
    }
  }

  const renderProgressBar = () => (
    <div className="mb-6 sm:mb-8">
      {/* Mobile: Show only current step */}
      <div className="block sm:hidden">
        <div className="text-center mb-4">
          <div className="text-sm text-gray-600 mb-2">
            Step {currentStep} of {totalSteps}
          </div>
          <div className="text-base font-medium text-darkgray">
            {steps[currentStep - 1]?.title}
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-basecolor h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Desktop: Show all steps */}
      <div className="hidden sm:block">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center flex-1">
              <div className={`w-8 md:w-10 h-8 md:h-10 rounded-full flex items-center justify-center text-sm md:text-base font-medium ${
                index + 1 <= currentStep 
                  ? 'bg-basecolor text-white' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {index + 1}
              </div>
              <div className="ml-2 md:ml-3 text-sm md:text-base flex-1">
                <span className={index + 1 <= currentStep ? 'text-basecolor font-medium' : 'text-gray-500'}>
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-8 md:w-12 h-0.5 mx-2 md:mx-4 ${
                  index + 1 < currentStep ? 'bg-basecolor' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="text-sm md:text-base text-gray-600 text-center">
          Step {currentStep} of {totalSteps}
        </div>
      </div>
    </div>
  )

  if (isSubmitted) {
    return (
      <Container>
        <Row className="justify-center">
          <Col lg={8}>
            <m.div {...fadeIn} className="text-center py-16">
              <div className="bg-white w-[120px] h-[120px] rounded-full shadow-[0_0_15px_rgba(0,0,0,0.08)] flex items-center justify-center mx-auto mb-8">
                <i className="feather-check-circle text-6xl text-green-500"></i>
              </div>
              <h2 className="heading-4 font-serif font-semibold text-darkgray mb-4">
                Application Submitted Successfully!
              </h2>
              <p className="text-lg mb-6 leading-[26px]">
                Thank you for applying to become a host. We'll review your application and get back to you within 2-3 business days.
              </p>
              <Buttons
                onClick={() => navigate('/account')}
                className="btn-fancy btn-fill font-medium font-serif rounded-none uppercase"
                themeColor="#232323"
                color="#fff"
                title="Go to Dashboard"
              />
            </m.div>
          </Col>
        </Row>
      </Container>
    )
  }

  if (isLoadingApplication) {
    return (
      <Container>
        <Row className="justify-center">
          <Col lg={8}>
            <div className="text-center py-16">
              <div className="spinner-border text-primary mb-4" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <p>Loading your application...</p>
            </div>
          </Col>
        </Row>
      </Container>
    )
  }

  return (
    <Container>
      <Row className="justify-center">
        <Col xs={12} sm={11} md={10} lg={10} xl={8}>
          <m.div {...fadeIn} className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 sm:p-6 md:p-8">
            {/* Header */}
            <div className="text-center mb-8 sm:mb-12 md:mb-16">
              <div className="flex flex-row items-center justify-center text-center mb-[10px]">
                <span className="w-[15px] sm:w-[25px] h-[1px] bg-basecolor opacity-40"></span>
                <div className="font-serif text-sm sm:text-xmd text-basecolor px-[10px]">host application</div>
                <span className="w-[15px] sm:w-[25px] h-[1px] bg-basecolor opacity-40"></span>
              </div>
              <h1 className="heading-5 sm:heading-4 font-serif font-semibold text-darkgray uppercase tracking-[-1px] mb-3 sm:mb-4">
                Become a Host
              </h1>
              <p className="text-base sm:text-lg text-gray-700 leading-[24px] sm:leading-[26px] px-4 sm:px-0">
                Join our platform and start earning from your property
              </p>
            </div>

            {/* Progress Bar */}
            {renderProgressBar()}

            {/* Form Steps */}
            <div className="min-h-[500px]">
              {currentStep === 1 && (
                <PersonalInfoStep
                  initialData={formData.personal_info || {}}
                  prefillData={prefillData}
                  onComplete={(data) => handleStepComplete({ personal_info: data })}
                  onBack={() => navigate('/bnb')}
                />
              )}
              
              {currentStep === 2 && (
                <PropertyDetailsStep
                  initialData={formData.property_details || {}}
                  onComplete={(data) => handleStepComplete({ property_details: data })}
                  onBack={() => setCurrentStep(1)}
                />
              )}
              
              {currentStep === 3 && (
                <PricingAvailabilityStep
                  initialData={formData.pricing_availability || {}}
                  onComplete={(data) => handleStepComplete({ pricing_availability: data })}
                  onBack={() => setCurrentStep(2)}
                />
              )}
              
              {currentStep === 4 && (
                <HostingExperienceStep
                  initialData={formData.hosting_experience || {}}
                  onComplete={(data) => handleStepComplete({ hosting_experience: data })}
                  onBack={() => setCurrentStep(3)}
                />
              )}
              
              {currentStep === 5 && (
                <DocumentsStep
                  initialData={formData.documents || {}}
                  onComplete={(data) => handleStepComplete({ documents: data })}
                  onBack={() => setCurrentStep(4)}
                />
              )}
              
              {currentStep === 6 && (
                <ReviewStep
                  formData={formData}
                  onSubmit={handleSubmit}
                  onBack={() => setCurrentStep(5)}
                  isSubmitting={isSubmitting || submitApplication.isLoading}
                  onUpdateLegalConsent={(data) => setFormData({ ...formData, ...data })}
                  submitError={submitError}
                />
              )}
            </div>
          </m.div>
        </Col>
      </Row>
    </Container>
  )
}

// Step 1: Personal Information
const PersonalInfoStep = ({ initialData, prefillData, onComplete, onBack }) => {
  const validationSchema = Yup.object({
    first_name: Yup.string().min(2).max(50).required('First name is required'),
    last_name: Yup.string().min(2).max(50).required('Last name is required'),
    date_of_birth: Yup.date().required('Date of birth is required'),
    phone_number: Yup.string()
      .matches(/^(\+254|254|0)?[7][0-9]{8}$/, 'Invalid Kenyan phone number')
      .required('Phone number is required'),
    national_id: Yup.string().min(6).max(20).required('National ID is required'),
    address: Yup.string().min(10).max(200).required('Address is required'),
    city: Yup.string().min(2).max(50).required('City is required'),
    emergency_contact_name: Yup.string().min(2).max(100).required('Emergency contact name is required'),
    emergency_contact_phone: Yup.string()
      .matches(/^(\+254|254|0)?[7][0-9]{8}$/, 'Invalid Kenyan phone number')
      .required('Emergency contact phone is required'),
  })

  const getInitialValues = () => ({
    first_name: initialData.first_name || prefillData?.first_name || '',
    last_name: initialData.last_name || prefillData?.last_name || '',
    date_of_birth: initialData.date_of_birth || '',
    phone_number: initialData.phone_number || prefillData?.phone_number || '',
    national_id: initialData.national_id || '',
    address: initialData.address || prefillData?.address || '',
    city: initialData.city || prefillData?.city || '',
    emergency_contact_name: initialData.emergency_contact_name || '',
    emergency_contact_phone: initialData.emergency_contact_phone || '',
  })

  return (
    <div>
      <h3 className="heading-6 sm:heading-5 font-serif font-semibold text-darkgray mb-4 sm:mb-6">
        Personal Information
      </h3>
      
      <Formik
        initialValues={getInitialValues()}
        validationSchema={validationSchema}
        onSubmit={onComplete}
        enableReinitialize
      >
        {({ errors, touched, isValid, dirty }) => (
          <Form>
            <div className="bg-lightgray p-3 sm:p-4 md:p-6 rounded-lg border border-gray-200 mb-6">
              <Row className="g-3 sm:g-4">
              <Col xs={12} sm={6}>
                <Input
                  type="text"
                  name="first_name"
                  label="First Name"
                  labelClass="!mb-[10px] font-medium text-darkgray text-base d-block"
                  className={`w-full !h-[44px] sm:!h-[50px] !text-sm sm:!text-base !px-3 sm:!px-4 !py-2 sm:!py-3 border-2 rounded-lg ${errors.first_name && touched.first_name ? 'border-red-500 error' : 'border-gray-300 focus:border-basecolor'}`}
                />
                {errors.first_name && touched.first_name && (
                  <span className="form-note-error text-red-500 text-sm mt-1">{errors.first_name}</span>
                )}
              </Col>
              
              <Col xs={12} sm={6}>
                <Input
                  type="text"
                  name="last_name"
                  label="Last Name"
                  labelClass="!mb-[10px] font-medium text-darkgray text-base d-block"
                  className={`w-full !h-[44px] sm:!h-[50px] !text-sm sm:!text-base !px-3 sm:!px-4 !py-2 sm:!py-3 border-2 rounded-lg ${errors.last_name && touched.last_name ? 'border-red-500 error' : 'border-gray-300 focus:border-basecolor'}`}
                />
                {errors.last_name && touched.last_name && (
                  <span className="form-note-error text-red-500 text-sm mt-1">{errors.last_name}</span>
                )}
              </Col>
              
              <Col xs={12} sm={6}>
                <Input
                  type="date"
                  name="date_of_birth"
                  label="Date of Birth"
                  labelClass="!mb-[10px] font-medium text-darkgray text-base d-block"
                  className={`w-full !h-[44px] sm:!h-[50px] !text-sm sm:!text-base !px-3 sm:!px-4 !py-2 sm:!py-3 border-2 rounded-lg ${errors.date_of_birth && touched.date_of_birth ? 'border-red-500 error' : 'border-gray-300 focus:border-basecolor'}`}
                />
                {errors.date_of_birth && touched.date_of_birth && (
                  <span className="form-note-error text-red-500 text-sm mt-1">{errors.date_of_birth}</span>
                )}
              </Col>
              
              <Col xs={12} sm={6}>
                <Input
                  type="tel"
                  name="phone_number"
                  label="Phone Number"
                  placeholder="+254 7XX XXX XXX"
                  labelClass="!mb-[10px] font-medium text-darkgray text-base d-block"
                  className={`w-full !h-[44px] sm:!h-[50px] !text-sm sm:!text-base !px-3 sm:!px-4 !py-2 sm:!py-3 border-2 rounded-lg ${errors.phone_number && touched.phone_number ? 'border-red-500 error' : 'border-gray-300 focus:border-basecolor'}`}
                />
                {errors.phone_number && touched.phone_number && (
                  <span className="form-note-error text-red-500 text-sm mt-1">{errors.phone_number}</span>
                )}
              </Col>
              
              <Col xs={12} sm={6}>
                <Input
                  type="text"
                  name="national_id"
                  label="National ID"
                  labelClass="!mb-[10px] font-medium text-darkgray text-base d-block"
                  className={`w-full !h-[44px] sm:!h-[50px] !text-sm sm:!text-base !px-3 sm:!px-4 !py-2 sm:!py-3 border-2 rounded-lg ${errors.national_id && touched.national_id ? 'border-red-500 error' : 'border-gray-300 focus:border-basecolor'}`}
                />
                {errors.national_id && touched.national_id && (
                  <span className="form-note-error text-red-500 text-sm mt-1">{errors.national_id}</span>
                )}
              </Col>
              
              <Col xs={12} sm={6}>
                <Input
                  type="text"
                  name="city"
                  label="City"
                  labelClass="!mb-[10px] font-medium text-darkgray text-base d-block"
                  className={`w-full !h-[44px] sm:!h-[50px] !text-sm sm:!text-base !px-3 sm:!px-4 !py-2 sm:!py-3 border-2 rounded-lg ${errors.city && touched.city ? 'border-red-500 error' : 'border-gray-300 focus:border-basecolor'}`}
                />
                {errors.city && touched.city && (
                  <span className="form-note-error text-red-500 text-sm mt-1">{errors.city}</span>
                )}
              </Col>
              
              <Col xs={12}>
                <TextArea
                  name="address"
                  label="Address"
                  rows={3}
                  labelClass="!mb-[10px] font-medium text-darkgray text-base d-block"
                  className={`w-full !text-sm sm:!text-base !px-3 sm:!px-4 !py-2 sm:!py-3 border-2 rounded-lg ${errors.address && touched.address ? 'border-red-500 error' : 'border-gray-300 focus:border-basecolor'}`}
                />
                {errors.address && touched.address && (
                  <span className="form-note-error text-red-500 text-sm mt-1">{errors.address}</span>
                )}
              </Col>
              
              <Col xs={12} sm={6}>
                <Input
                  type="text"
                  name="emergency_contact_name"
                  label="Emergency Contact Name"
                  labelClass="!mb-[10px] font-medium text-darkgray text-base d-block"
                  className={`w-full !h-[44px] sm:!h-[50px] !text-sm sm:!text-base !px-3 sm:!px-4 !py-2 sm:!py-3 border-2 rounded-lg ${errors.emergency_contact_name && touched.emergency_contact_name ? 'border-red-500 error' : 'border-gray-300 focus:border-basecolor'}`}
                />
                {errors.emergency_contact_name && touched.emergency_contact_name && (
                  <span className="form-note-error text-red-500 text-sm mt-1">{errors.emergency_contact_name}</span>
                )}
              </Col>
              
              <Col xs={12} sm={6}>
                <Input
                  type="tel"
                  name="emergency_contact_phone"
                  label="Emergency Contact Phone"
                  placeholder="+254 7XX XXX XXX"
                  labelClass="!mb-[10px] font-medium text-darkgray text-base d-block"
                  className={`w-full !h-[44px] sm:!h-[50px] !text-sm sm:!text-base !px-3 sm:!px-4 !py-2 sm:!py-3 border-2 rounded-lg ${errors.emergency_contact_phone && touched.emergency_contact_phone ? 'border-red-500 error' : 'border-gray-300 focus:border-basecolor'}`}
                />
                {errors.emergency_contact_phone && touched.emergency_contact_phone && (
                  <span className="form-note-error text-red-500 text-sm mt-1">{errors.emergency_contact_phone}</span>
                )}
              </Col>
              </Row>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-0 mt-6 sm:mt-8">
              <div className="order-2 sm:order-1">
                {onBack && (
                  <Buttons
                    type="button"
                    onClick={onBack}
                    className="btn-fancy btn-outline font-medium font-serif rounded-lg uppercase h-[50px] px-6 sm:px-8 w-full sm:w-auto"
                    themeColor="#232323"
                    color="#232323"
                    title="Back"
                  />
                )}
              </div>
              
              <div className="order-1 sm:order-2">
                <Buttons
                  type="submit"
                  disabled={!isValid}
                  className="btn-fancy btn-fill font-medium font-serif rounded-lg uppercase h-[50px] px-6 sm:px-8 w-full sm:w-auto"
                  themeColor="#232323"
                  color="#fff"
                  title="Next Step"
                />
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

// This file is getting quite large, let me split it into separate step components
// For now, I'll include placeholder components for the other steps

const PropertyDetailsStep = ({ initialData, onComplete, onBack }) => (
  <div>
    <h3 className="heading-5 font-serif font-semibold text-darkgray mb-6">
      Property Details
    </h3>
    <p className="mb-6">This step will include property type, description, amenities, etc.</p>
    
    <div className="flex justify-between mt-8">
      <Buttons
        onClick={onBack}
        className="btn-fancy btn-outline font-medium font-serif rounded-none uppercase"
        themeColor="#232323"
        color="#232323"
        title="Back"
      />
      
      <Buttons
        onClick={() => onComplete(initialData)}
        className="btn-fancy btn-fill font-medium font-serif rounded-none uppercase"
        themeColor="#232323"
        color="#fff"
        title="Next Step"
      />
    </div>
  </div>
)

const PricingAvailabilityStep = ({ initialData, onComplete, onBack }) => (
  <div>
    <h3 className="heading-5 font-serif font-semibold text-darkgray mb-6">
      Pricing & Availability
    </h3>
    <p className="mb-6">This step will include pricing, availability calendar, house rules, etc.</p>
    
    <div className="flex justify-between mt-8">
      <Buttons
        onClick={onBack}
        className="btn-fancy btn-outline font-medium font-serif rounded-none uppercase"
        themeColor="#232323"
        color="#232323"
        title="Back"
      />
      
      <Buttons
        onClick={() => onComplete(initialData)}
        className="btn-fancy btn-fill font-medium font-serif rounded-none uppercase"
        themeColor="#232323"
        color="#fff"
        title="Next Step"
      />
    </div>
  </div>
)

const HostingExperienceStep = ({ initialData, onComplete, onBack }) => (
  <div>
    <h3 className="heading-5 font-serif font-semibold text-darkgray mb-6">
      Hosting Experience
    </h3>
    <p className="mb-6">This step will include hosting experience, motivation, languages, etc.</p>
    
    <div className="flex justify-between mt-8">
      <Buttons
        onClick={onBack}
        className="btn-fancy btn-outline font-medium font-serif rounded-none uppercase"
        themeColor="#232323"
        color="#232323"
        title="Back"
      />
      
      <Buttons
        onClick={() => onComplete(initialData)}
        className="btn-fancy btn-fill font-medium font-serif rounded-none uppercase"
        themeColor="#232323"
        color="#fff"
        title="Next Step"
      />
    </div>
  </div>
)

const DocumentsStep = ({ initialData, onComplete, onBack }) => (
  <div>
    <h3 className="heading-5 font-serif font-semibold text-darkgray mb-6">
      Required Documents
    </h3>
    <p className="mb-6">This step will include ID upload, property documents, etc.</p>
    
    <div className="flex justify-between mt-8">
      <Buttons
        onClick={onBack}
        className="btn-fancy btn-outline font-medium font-serif rounded-none uppercase"
        themeColor="#232323"
        color="#232323"
        title="Back"
      />
      
      <Buttons
        onClick={() => onComplete(initialData)}
        className="btn-fancy btn-fill font-medium font-serif rounded-none uppercase"
        themeColor="#232323"
        color="#fff"
        title="Next Step"
      />
    </div>
  </div>
)

const ReviewStep = ({ formData, onSubmit, onBack, isSubmitting, onUpdateLegalConsent, submitError }) => {
  const [legalConsent, setLegalConsent] = useState({
    terms_accepted: formData.terms_accepted || false,
    privacy_policy_accepted: formData.privacy_policy_accepted || false,
    marketing_emails_consent: formData.marketing_emails_consent || false,
  })

  const handleConsentChange = (field, value) => {
    const newConsent = { ...legalConsent, [field]: value }
    setLegalConsent(newConsent)
    onUpdateLegalConsent(newConsent)
  }

  const canSubmit = legalConsent.terms_accepted && legalConsent.privacy_policy_accepted

  return (
    <div>
      <h3 className="heading-5 font-serif font-semibold text-darkgray mb-6">
        Review & Submit
      </h3>
      
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-4">Application Summary</h4>
        <div className="bg-gray-50 p-6 rounded-lg">
          <p><strong>Name:</strong> {formData.personal_info?.first_name} {formData.personal_info?.last_name}</p>
          <p><strong>Phone:</strong> {formData.personal_info?.phone_number}</p>
          <p><strong>City:</strong> {formData.personal_info?.city}</p>
          <p className="mt-2">
            <small>Complete application data will be reviewed by our team.</small>
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-4">Legal Requirements</h4>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <Checkbox
              name="terms_accepted"
              checked={legalConsent.terms_accepted}
              onChange={(e) => handleConsentChange('terms_accepted', e.target.checked)}
              className="mt-1"
            />
            <label className="ml-3 text-sm">
              I agree to the <a href="/terms" target="_blank" className="text-blue-600 underline">Terms and Conditions</a> *
            </label>
          </div>
          
          <div className="flex items-start">
            <Checkbox
              name="privacy_policy_accepted"
              checked={legalConsent.privacy_policy_accepted}
              onChange={(e) => handleConsentChange('privacy_policy_accepted', e.target.checked)}
              className="mt-1"
            />
            <label className="ml-3 text-sm">
              I agree to the <a href="/privacy" target="_blank" className="text-blue-600 underline">Privacy Policy</a> *
            </label>
          </div>
          
          <div className="flex items-start">
            <Checkbox
              name="marketing_emails_consent"
              checked={legalConsent.marketing_emails_consent}
              onChange={(e) => handleConsentChange('marketing_emails_consent', e.target.checked)}
              className="mt-1"
            />
            <label className="ml-3 text-sm">
              I consent to receiving marketing emails (optional)
            </label>
          </div>
        </div>
      </div>

      {submitError && (
        <MessageBox
          theme="message-box01"
          variant="error"
          message={submitError}
          className="mb-6"
        />
      )}

      <div className="flex justify-between mt-8">
        <Buttons
          onClick={onBack}
          className="btn-fancy btn-outline font-medium font-serif rounded-none uppercase"
          themeColor="#232323"
          color="#232323"
          title="Back"
        />
        
        <Buttons
          onClick={onSubmit}
          disabled={!canSubmit || isSubmitting}
          className="btn-fancy btn-fill font-medium font-serif rounded-none uppercase"
          themeColor="#232323"
          color="#fff"
          title={isSubmitting ? "Submitting..." : "Submit Application"}
        />
      </div>
    </div>
  )
}

export default BecomeHostForm
