import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'
import { m, AnimatePresence } from 'framer-motion'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'

// Components
import { fadeIn } from '../../Functions/GlobalAnimations'
import Buttons from '../Button/Buttons'
import { Input, Select, TextArea, Checkbox } from '../Form/Form'
import MessageBox from '../MessageBox/MessageBox'
import ResponsiveStepIndicator from '../StepIndicator/ResponsiveStepIndicator'

// API Hooks
import { useHostApplicationForm, usePersonalInfoPrefill, useSubmitHostApplication } from '../../api/useHost'

// Animation variants for step transitions
const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 300 : -300,
    opacity: 0
  })
};

// Multi-step form component with improved mobile UX
const BecomeHostFormNew = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [direction, setDirection] = useState(0)
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

  const totalSteps = 6
  
  // Step configuration
  const stepConfig = [
    {
      title: "Personal Info",
      description: "Basic information",
      shortTitle: "Personal"
    },
    {
      title: "Property Details", 
      description: "About your space",
      shortTitle: "Property"
    },
    {
      title: "Pricing & Availability",
      description: "Set your rates", 
      shortTitle: "Pricing"
    },
    {
      title: "Hosting Experience",
      description: "Your background",
      shortTitle: "Experience"
    },
    {
      title: "Documents",
      description: "Required uploads",
      shortTitle: "Documents"
    },
    {
      title: "Review & Submit",
      description: "Final confirmation",
      shortTitle: "Review"
    }
  ];

  const stepTitles = stepConfig.map(s => s.title);
  const stepDescriptions = stepConfig.map(s => s.description);

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

  // Navigation functions
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setDirection(1)
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setDirection(-1)
      setCurrentStep(currentStep - 1)
    }
  }

  const goToStep = (stepNumber) => {
    if (stepNumber >= 1 && stepNumber <= totalSteps && stepNumber <= currentStep + 1) {
      setDirection(stepNumber > currentStep ? 1 : -1)
      setCurrentStep(stepNumber)
    }
  }

  // Validation schemas for each step
  const getValidationSchema = (step) => {
    switch (step) {
      case 1:
        return Yup.object().shape({
          personal_info: Yup.object().shape({
            first_name: Yup.string().required('First name is required'),
            last_name: Yup.string().required('Last name is required'),
            email: Yup.string().email('Invalid email').required('Email is required'),
            phone: Yup.string().required('Phone number is required'),
            date_of_birth: Yup.date().required('Date of birth is required'),
            national_id: Yup.string().required('National ID is required'),
            address: Yup.string().required('Address is required'),
          })
        })
      case 2:
        return Yup.object().shape({
          property_details: Yup.object().shape({
            property_type: Yup.string().required('Property type is required'),
            property_title: Yup.string().required('Property title is required'),
            property_description: Yup.string().required('Property description is required'),
            location: Yup.string().required('Location is required'),
            bedrooms: Yup.number().min(1, 'At least 1 bedroom required'),
            bathrooms: Yup.number().min(1, 'At least 1 bathroom required'),
            max_guests: Yup.number().min(1, 'Must accommodate at least 1 guest'),
          })
        })
      case 3:
        return Yup.object().shape({
          pricing_availability: Yup.object().shape({
            base_price: Yup.number().min(1, 'Base price must be greater than 0'),
            currency: Yup.string().required('Currency is required'),
            minimum_stay: Yup.number().min(1, 'Minimum stay must be at least 1 night'),
          })
        })
      case 4:
        return Yup.object().shape({
          hosting_experience: Yup.object().shape({
            experience_level: Yup.string().required('Experience level is required'),
            why_host: Yup.string().required('Please tell us why you want to host'),
          })
        })
      case 5:
        return Yup.object().shape({
          documents: Yup.object().shape({
            id_document: Yup.mixed().required('ID document is required'),
            property_ownership: Yup.mixed().required('Property ownership document is required'),
          })
        })
      case 6:
        return Yup.object().shape({
          terms_accepted: Yup.boolean().oneOf([true], 'You must accept the terms'),
          privacy_policy_accepted: Yup.boolean().oneOf([true], 'You must accept the privacy policy'),
        })
      default:
        return Yup.object()
    }
  }

  // Initial values
  const getInitialValues = () => ({
    personal_info: {
      first_name: prefillData?.first_name || formData.personal_info?.first_name || '',
      last_name: prefillData?.last_name || formData.personal_info?.last_name || '',
      email: prefillData?.email || formData.personal_info?.email || '',
      phone: prefillData?.phone || formData.personal_info?.phone || '',
      date_of_birth: formData.personal_info?.date_of_birth || '',
      national_id: formData.personal_info?.national_id || '',
      address: formData.personal_info?.address || '',
    },
    property_details: {
      property_type: formData.property_details?.property_type || '',
      property_title: formData.property_details?.property_title || '',
      property_description: formData.property_details?.property_description || '',
      location: formData.property_details?.location || '',
      bedrooms: formData.property_details?.bedrooms || 1,
      bathrooms: formData.property_details?.bathrooms || 1,
      max_guests: formData.property_details?.max_guests || 2,
      amenities: formData.property_details?.amenities || [],
    },
    pricing_availability: {
      base_price: formData.pricing_availability?.base_price || '',
      currency: formData.pricing_availability?.currency || 'KES',
      minimum_stay: formData.pricing_availability?.minimum_stay || 1,
      availability_calendar: formData.pricing_availability?.availability_calendar || {},
    },
    hosting_experience: {
      experience_level: formData.hosting_experience?.experience_level || '',
      previous_platforms: formData.hosting_experience?.previous_platforms || [],
      why_host: formData.hosting_experience?.why_host || '',
      house_rules: formData.hosting_experience?.house_rules || '',
    },
    documents: {
      id_document: formData.documents?.id_document || null,
      property_ownership: formData.documents?.property_ownership || null,
      business_license: formData.documents?.business_license || null,
    },
    terms_accepted: formData.terms_accepted || false,
    privacy_policy_accepted: formData.privacy_policy_accepted || false,
    marketing_emails_consent: formData.marketing_emails_consent || false,
  })

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      if (currentStep < totalSteps) {
        // Save current step data and proceed
        setFormData({ ...formData, ...values })
        
        // Auto-save to backend
        await saveApplication({ ...formData, ...values })
        
        nextStep()
      } else {
        // Final submission
        const finalData = { ...formData, ...values }
        const savedApplication = await saveApplication(finalData)
        
        // Submit for review
        await submitApplication.mutateAsync(savedApplication.id)
        
        setIsSubmitted(true)
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitError(error.message || 'An error occurred while saving your application')
    }
  }

  // Show success message after submission
  if (isSubmitted) {
    return (
      <Container className="py-[80px]">
        <Row className="justify-center">
          <Col lg={8} className="text-center">
            <m.div {...fadeIn}>
              <div className="bg-green-50 border border-green-200 rounded-lg p-8 mb-6">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-3xl font-serif font-semibold text-green-800 mb-4">
                  Application Submitted Successfully!
                </h2>
                <p className="text-green-700 mb-6">
                  Thank you for your interest in becoming a host. We'll review your application 
                  and get back to you within 3-5 business days.
                </p>
                <div className="space-y-3">
                  <Buttons
                    onClick={() => navigate('/account/host')}
                    className="btn-fancy btn-fill mr-4"
                    themeColor="#16a34a"
                    color="#fff"
                    title="View Application Status"
                  />
                  <Buttons
                    onClick={() => navigate('/')}
                    className="btn-fancy btn-outline"
                    title="Return to Home"
                  />
                </div>
              </div>
            </m.div>
          </Col>
        </Row>
      </Container>
    )
  }

  return (
    <Container className="py-[80px]">
      <Row className="justify-center">
        <Col xl={10} lg={12}>
          <m.div {...fadeIn}>
            {/* Responsive Step Indicator */}
            <ResponsiveStepIndicator
              currentStep={currentStep}
              totalSteps={totalSteps}
              stepTitles={stepTitles}
              stepDescriptions={stepDescriptions}
              onStepClick={goToStep}
              mobileVariant="auto" // Auto-select based on screen size
              className="mb-8"
            />

            {/* Error Message */}
            {submitError && (
              <MessageBox
                theme="message-box01"
                variant="error"
                message={submitError}
                className="mb-6"
                onClose={() => setSubmitError(null)}
              />
            )}

            {/* Form */}
            <Formik
              initialValues={getInitialValues()}
              validationSchema={getValidationSchema(currentStep)}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ values, errors, touched, setFieldValue, isValid }) => (
                <Form>
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="p-6 lg:p-8 min-h-[600px]">
                      <AnimatePresence mode="wait" custom={direction}>
                        {/* Step Content - I'll create separate step components for cleaner code */}
                        <m.div
                          key={currentStep}
                          custom={direction}
                          variants={slideVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 }
                          }}
                        >
                          {/* Step content will be rendered based on currentStep */}
                          <StepContent 
                            step={currentStep}
                            values={values}
                            errors={errors}
                            touched={touched}
                            setFieldValue={setFieldValue}
                          />
                        </m.div>
                      </AnimatePresence>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="bg-gray-50 px-6 py-4 lg:px-8 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        {currentStep > 1 ? (
                          <Buttons
                            type="button"
                            onClick={prevStep}
                            className="btn-fancy btn-outline"
                            title="Previous"
                            disabled={isSubmitting}
                          />
                        ) : (
                          <div></div>
                        )}

                        <div className="text-center">
                          <div className="text-sm text-gray-600 mb-2">
                            {currentStep === totalSteps ? 'Ready to submit?' : 'Continue to next step'}
                          </div>
                          <Buttons
                            type="submit"
                            className="btn-fancy btn-fill"
                            themeColor="#f59e0b"
                            color="#fff"
                            title={
                              isSubmitting 
                                ? 'Saving...' 
                                : currentStep === totalSteps 
                                  ? 'Submit Application' 
                                  : 'Next Step'
                            }
                            disabled={isSubmitting || !isValid}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </m.div>
        </Col>
      </Row>
    </Container>
  )
}

// Separate component for step content to keep main component clean
const StepContent = ({ step, values, errors, touched, setFieldValue }) => {
  switch (step) {
    case 1:
      return <PersonalInfoStep values={values} errors={errors} touched={touched} />
    case 2:
      return <PropertyDetailsStep values={values} errors={errors} touched={touched} setFieldValue={setFieldValue} />
    case 3:
      return <PricingAvailabilityStep values={values} errors={errors} touched={touched} />
    case 4:
      return <HostingExperienceStep values={values} errors={errors} touched={touched} />
    case 5:
      return <DocumentsStep values={values} errors={errors} touched={touched} setFieldValue={setFieldValue} />
    case 6:
      return <ReviewSubmitStep values={values} errors={errors} touched={touched} setFieldValue={setFieldValue} />
    default:
      return null
  }
}

// Step 1: Personal Information
const PersonalInfoStep = ({ values, errors, touched }) => (
  <div>
    <div className="mb-6">
      <h3 className="text-2xl font-serif font-semibold mb-2">Personal Information</h3>
      <p className="text-gray-600">Tell us about yourself to get started.</p>
    </div>
    
    <Row>
      <Col md={6}>
        <Input
          type="text"
          name="personal_info.first_name"
          label="First Name"
          className="mb-4"
          showErrorIcon={false}
        />
      </Col>
      <Col md={6}>
        <Input
          type="text"
          name="personal_info.last_name"
          label="Last Name"
          className="mb-4"
          showErrorIcon={false}
        />
      </Col>
      <Col md={6}>
        <Input
          type="email"
          name="personal_info.email"
          label="Email Address"
          className="mb-4"
          showErrorIcon={false}
        />
      </Col>
      <Col md={6}>
        <Input
          type="tel"
          name="personal_info.phone"
          label="Phone Number"
          placeholder="+254712345678"
          className="mb-4"
          showErrorIcon={false}
        />
      </Col>
      <Col md={6}>
        <Input
          type="date"
          name="personal_info.date_of_birth"
          label="Date of Birth"
          className="mb-4"
          showErrorIcon={false}
        />
      </Col>
      <Col md={6}>
        <Input
          type="text"
          name="personal_info.national_id"
          label="National ID Number"
          className="mb-4"
          showErrorIcon={false}
        />
      </Col>
      <Col md={12}>
        <TextArea
          name="personal_info.address"
          label="Physical Address"
          rows="3"
          className="mb-4"
          showErrorIcon={false}
        />
      </Col>
    </Row>
  </div>
)

// Step 2: Property Details - will continue with other steps...
const PropertyDetailsStep = ({ values, errors, touched, setFieldValue }) => (
  <div>
    <div className="mb-6">
      <h3 className="text-2xl font-serif font-semibold mb-2">Property Details</h3>
      <p className="text-gray-600">Describe your property and what makes it special.</p>
    </div>
    
    <Row>
      <Col md={6}>
        <Select
          name="property_details.property_type"
          label="Property Type"
          className="mb-4"
          options={[
            { value: '', label: 'Select property type' },
            { value: 'apartment', label: 'Apartment' },
            { value: 'house', label: 'House' },
            { value: 'villa', label: 'Villa' },
            { value: 'cottage', label: 'Cottage' },
            { value: 'studio', label: 'Studio' },
          ]}
          showErrorIcon={false}
        />
      </Col>
      <Col md={6}>
        <Input
          type="text"
          name="property_details.location"
          label="Location"
          placeholder="e.g., Westlands, Nairobi"
          className="mb-4"
          showErrorIcon={false}
        />
      </Col>
      <Col md={12}>
        <Input
          type="text"
          name="property_details.property_title"
          label="Property Title"
          placeholder="e.g., Cozy apartment in the heart of Nairobi"
          className="mb-4"
          showErrorIcon={false}
        />
      </Col>
      <Col md={12}>
        <TextArea
          name="property_details.property_description"
          label="Property Description"
          rows="4"
          placeholder="Describe your property, its features, and nearby attractions..."
          className="mb-4"
          showErrorIcon={false}
        />
      </Col>
      <Col md={4}>
        <Input
          type="number"
          name="property_details.bedrooms"
          label="Bedrooms"
          min="1"
          className="mb-4"
          showErrorIcon={false}
        />
      </Col>
      <Col md={4}>
        <Input
          type="number"
          name="property_details.bathrooms"
          label="Bathrooms"
          min="1"
          className="mb-4"
          showErrorIcon={false}
        />
      </Col>
      <Col md={4}>
        <Input
          type="number"
          name="property_details.max_guests"
          label="Maximum Guests"
          min="1"
          className="mb-4"
          showErrorIcon={false}
        />
      </Col>
    </Row>
  </div>
)

// Add other step components here...
const PricingAvailabilityStep = ({ values, errors, touched }) => (
  <div>
    <div className="mb-6">
      <h3 className="text-2xl font-serif font-semibold mb-2">Pricing & Availability</h3>
      <p className="text-gray-600">Set your rates and availability preferences.</p>
    </div>
    
    <Row>
      <Col md={6}>
        <Input
          type="number"
          name="pricing_availability.base_price"
          label="Base Price per Night"
          min="1"
          className="mb-4"
          showErrorIcon={false}
        />
      </Col>
      <Col md={6}>
        <Select
          name="pricing_availability.currency"
          label="Currency"
          className="mb-4"
          options={[
            { value: 'KES', label: 'Kenyan Shilling (KES)' },
            { value: 'USD', label: 'US Dollar (USD)' },
            { value: 'EUR', label: 'Euro (EUR)' },
          ]}
          showErrorIcon={false}
        />
      </Col>
      <Col md={6}>
        <Input
          type="number"
          name="pricing_availability.minimum_stay"
          label="Minimum Stay (nights)"
          min="1"
          className="mb-4"
          showErrorIcon={false}
        />
      </Col>
    </Row>
  </div>
)

const HostingExperienceStep = ({ values, errors, touched }) => (
  <div>
    <div className="mb-6">
      <h3 className="text-2xl font-serif font-semibold mb-2">Hosting Experience</h3>
      <p className="text-gray-600">Tell us about your hosting background and goals.</p>
    </div>
    
    <Row>
      <Col md={12}>
        <Select
          name="hosting_experience.experience_level"
          label="Hosting Experience Level"
          className="mb-4"
          options={[
            { value: '', label: 'Select experience level' },
            { value: 'new', label: 'New to hosting' },
            { value: 'some', label: 'Some experience' },
            { value: 'experienced', label: 'Very experienced' },
          ]}
          showErrorIcon={false}
        />
      </Col>
      <Col md={12}>
        <TextArea
          name="hosting_experience.why_host"
          label="Why do you want to become a host?"
          rows="4"
          placeholder="Tell us your motivation for hosting..."
          className="mb-4"
          showErrorIcon={false}
        />
      </Col>
    </Row>
  </div>
)

const DocumentsStep = ({ values, errors, touched, setFieldValue }) => (
  <div>
    <div className="mb-6">
      <h3 className="text-2xl font-serif font-semibold mb-2">Required Documents</h3>
      <p className="text-gray-600">Upload the required documents to verify your identity and property ownership.</p>
    </div>
    
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">National ID or Passport</label>
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => setFieldValue('documents.id_document', e.target.files[0])}
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Property Ownership Document</label>
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => setFieldValue('documents.property_ownership', e.target.files[0])}
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
      </div>
    </div>
  </div>
)

const ReviewSubmitStep = ({ values, errors, touched, setFieldValue }) => (
  <div>
    <div className="mb-6">
      <h3 className="text-2xl font-serif font-semibold mb-2">Review & Submit</h3>
      <p className="text-gray-600">Please review your information and submit your application.</p>
    </div>
    
    {/* Application Summary */}
    <div className="bg-gray-50 rounded-lg p-6 mb-6">
      <h4 className="font-semibold mb-4">Application Summary</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <strong>Name:</strong> {values.personal_info?.first_name} {values.personal_info?.last_name}
        </div>
        <div>
          <strong>Email:</strong> {values.personal_info?.email}
        </div>
        <div>
          <strong>Property:</strong> {values.property_details?.property_title}
        </div>
        <div>
          <strong>Location:</strong> {values.property_details?.location}
        </div>
        <div>
          <strong>Base Price:</strong> {values.pricing_availability?.currency} {values.pricing_availability?.base_price}
        </div>
        <div>
          <strong>Max Guests:</strong> {values.property_details?.max_guests}
        </div>
      </div>
    </div>
    
    {/* Terms and Conditions */}
    <div className="space-y-4">
      <Checkbox
        name="terms_accepted"
        label="I agree to the Terms and Conditions"
        className="mb-2"
      />
      
      <Checkbox
        name="privacy_policy_accepted"
        label="I agree to the Privacy Policy"
        className="mb-2"
      />
      
      <Checkbox
        name="marketing_emails_consent"
        label="I would like to receive marketing emails (optional)"
        className="mb-2"
      />
    </div>
  </div>
)

export default BecomeHostFormNew
