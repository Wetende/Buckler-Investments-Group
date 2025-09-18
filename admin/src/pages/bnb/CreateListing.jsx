import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
  PreviewCard,
} from "@/components/Component";
import { Card, CardBody, CardHeader, FormGroup, Input, Label, Form } from "reactstrap";
import { useSaveBnbListing, useBnbListing } from "@/hooks/useBnb";
import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone";

// Validation schema
const listingSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title too long"),
  description: z.string().min(50, "Description must be at least 50 characters").max(2000, "Description too long"),
  property_type: z.string().min(1, "Please select a property type"),
  location: z.string().min(5, "Please provide a detailed location"),
  max_guests: z.number().min(1, "At least 1 guest").max(20, "Maximum 20 guests"),
  bedrooms: z.number().min(0, "Cannot be negative").max(10, "Maximum 10 bedrooms"),
  bathrooms: z.number().min(1, "At least 1 bathroom").max(10, "Maximum 10 bathrooms"),
  price_per_night: z.number().min(100, "Minimum price is KES 100").max(1000000, "Price too high"),
  amenities: z.array(z.string()).min(1, "Please select at least one amenity"),
  house_rules: z.string().optional(),
  cancellation_policy: z.enum(["flexible", "moderate", "strict"]),
});

const CreateListing = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const viewMode = searchParams.get('view');
  const isEdit = !!editId;
  const isView = !!viewMode;

  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = 4;

  // API hooks
  const saveListing = useSaveBnbListing();
  const { data: existingListing, isLoading: loadingListing } = useBnbListing(editId, {
    enabled: isEdit
  });

  // Form hook with validation
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    reset
  } = useForm({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: "",
      description: "",
      property_type: "",
      location: "",
      max_guests: 1,
      bedrooms: 1,
      bathrooms: 1,
      price_per_night: 0,
      amenities: [],
      house_rules: "",
      cancellation_policy: "flexible"
    },
    mode: 'onChange'
  });

  const watchedValues = watch();

  const propertyTypes = [
    { value: "apartment", label: "Apartment" },
    { value: "house", label: "House" },
    { value: "villa", label: "Villa" },
    { value: "studio", label: "Studio" },
    { value: "cottage", label: "Cottage" },
    { value: "townhouse", label: "Townhouse" },
    { value: "condo", label: "Condominium" },
    { value: "loft", label: "Loft" }
  ];

  const availableAmenities = [
    "WiFi", "Kitchen", "Parking", "Swimming Pool", "Garden", "Balcony", 
    "Air Conditioning", "Heating", "Washer", "Dryer", "TV", 
    "Hot Water", "Security", "Pets Allowed", "Smoking Allowed",
    "Gym/Fitness", "BBQ Grill", "Fireplace", "Ocean View", "Mountain View",
    "Netflix", "Workspace", "Iron", "Hair Dryer", "Shampoo"
  ];

  // Load existing listing data for edit mode
  useEffect(() => {
    if (existingListing && isEdit) {
      reset({
        title: existingListing.title || "",
        description: existingListing.description || "",
        property_type: existingListing.property_type || "",
        location: existingListing.location || existingListing.address || "",
        max_guests: existingListing.max_guests || existingListing.guests || 1,
        bedrooms: existingListing.bedrooms || 1,
        bathrooms: existingListing.bathrooms || 1,
        price_per_night: existingListing.price_per_night || existingListing.price || 0,
        amenities: existingListing.amenities || [],
        house_rules: existingListing.house_rules || "",
        cancellation_policy: existingListing.cancellation_policy || "flexible"
      });
      
      // Set uploaded images if they exist
      if (existingListing.images) {
        setUploadedImages(existingListing.images.map((url, index) => ({
          id: index,
          url: url,
          file: null,
          preview: url
        })));
      }
    }
  }, [existingListing, isEdit, reset]);

  // Image upload with drag & drop (Airbnb-style)
  const onDrop = useCallback((acceptedFiles) => {
    const newImages = acceptedFiles.map((file, index) => ({
      id: Date.now() + index,
      file,
      url: null,
      preview: URL.createObjectURL(file)
    }));
    
    setUploadedImages(prev => [...prev, ...newImages]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize: 5242880, // 5MB
    multiple: true
  });

  const removeImage = (imageId) => {
    setUploadedImages(prev => {
      const updated = prev.filter(img => img.id !== imageId);
      // Clean up object URLs
      const removed = prev.find(img => img.id === imageId);
      if (removed && removed.preview && removed.preview.startsWith('blob:')) {
        URL.revokeObjectURL(removed.preview);
      }
      return updated;
    });
  };

  const reorderImages = (fromIndex, toIndex) => {
    setUploadedImages(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(fromIndex, 1);
      result.splice(toIndex, 0, removed);
      return result;
    });
  };

  // Handle amenity toggle
  const handleAmenityToggle = (amenity) => {
    const currentAmenities = watchedValues.amenities || [];
    const newAmenities = currentAmenities.includes(amenity)
      ? currentAmenities.filter(a => a !== amenity)
      : [...currentAmenities, amenity];
    
    setValue('amenities', newAmenities);
  };

  // Form submission
  const onSubmit = async (data) => {
    if (uploadedImages.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    setIsSubmitting(true);
    try {
      const listingData = {
        id: isEdit ? parseInt(editId) : 0,
        ...data,
        images: uploadedImages, // Will be processed by the API
        status: 'draft' // Default status
      };

      await saveListing.mutateAsync(listingData);
      
      toast.success(isEdit ? 'Listing updated successfully!' : 'Listing created successfully!');
      navigate('/dashboard/bnb/my-listings');
    } catch (error) {
      toast.error(isEdit ? 'Failed to update listing' : 'Failed to create listing');
      console.error('Listing submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h5 className="mb-4">Basic Information</h5>
            <Row className="g-4">
              <Col sm="12">
                <FormGroup>
                  <Label htmlFor="title" className="form-label">Property Title *</Label>
                  <div className="form-control-wrap">
                    <Input
                      type="text"
                      id="title"
                      className={`form-control ${errors.title ? 'error' : ''}`}
                      placeholder="Enter a catchy title for your property"
                      {...register('title')}
                    />
                    {errors.title && (
                      <span className="form-note-error">{errors.title.message}</span>
                    )}
                  </div>
                  <div className="form-note">
                    Create a title that highlights your property's best features
                  </div>
                </FormGroup>
              </Col>
              <Col sm="12">
                <FormGroup>
                  <Label htmlFor="description" className="form-label">Description *</Label>
                  <div className="form-control-wrap">
                    <Input
                      type="textarea"
                      id="description"
                      rows="4"
                      className={`form-control ${errors.description ? 'error' : ''}`}
                      placeholder="Describe your property, its unique features, neighborhood, and what makes it special"
                      {...register('description')}
                    />
                    {errors.description && (
                      <span className="form-note-error">{errors.description.message}</span>
                    )}
                  </div>
                  <div className="form-note">
                    {watchedValues.description?.length || 0}/2000 characters (minimum 50 required)
                  </div>
                </FormGroup>
              </Col>
              <Col sm="6">
                <FormGroup>
                  <Label htmlFor="property_type" className="form-label">Property Type *</Label>
                  <div className="form-control-wrap">
                    <Input
                      type="select"
                      id="property_type"
                      className={`form-control ${errors.property_type ? 'error' : ''}`}
                      {...register('property_type')}
                    >
                      <option value="">Select property type</option>
                      {propertyTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </Input>
                    {errors.property_type && (
                      <span className="form-note-error">{errors.property_type.message}</span>
                    )}
                  </div>
                </FormGroup>
              </Col>
              <Col sm="6">
                <FormGroup>
                  <Label htmlFor="location" className="form-label">Location *</Label>
                  <div className="form-control-wrap">
                    <Input
                      type="text"
                      id="location"
                      className={`form-control ${errors.location ? 'error' : ''}`}
                      placeholder="Enter full address or area (e.g., Westlands, Nairobi)"
                      {...register('location')}
                    />
                    {errors.location && (
                      <span className="form-note-error">{errors.location.message}</span>
                    )}
                  </div>
                  <div className="form-note">
                    Include neighborhood, city, and any landmarks
                  </div>
                </FormGroup>
              </Col>
            </Row>
          </div>
        );

      case 2:
        return (
          <div>
            <h5 className="mb-4">Property Details</h5>
            <Row className="g-4">
              <Col sm="4">
                <FormGroup>
                  <Label htmlFor="max_guests" className="form-label">Maximum Guests *</Label>
                  <div className="form-control-wrap">
                    <Input
                      type="number"
                      id="max_guests"
                      min="1"
                      max="20"
                      className={`form-control ${errors.max_guests ? 'error' : ''}`}
                      {...register('max_guests', { valueAsNumber: true })}
                    />
                    {errors.max_guests && (
                      <span className="form-note-error">{errors.max_guests.message}</span>
                    )}
                  </div>
                </FormGroup>
              </Col>
              <Col sm="4">
                <FormGroup>
                  <Label htmlFor="bedrooms" className="form-label">Bedrooms *</Label>
                  <div className="form-control-wrap">
                    <Input
                      type="number"
                      id="bedrooms"
                      min="0"
                      max="10"
                      className={`form-control ${errors.bedrooms ? 'error' : ''}`}
                      {...register('bedrooms', { valueAsNumber: true })}
                    />
                    {errors.bedrooms && (
                      <span className="form-note-error">{errors.bedrooms.message}</span>
                    )}
                  </div>
                  <div className="form-note">0 for studio apartments</div>
                </FormGroup>
              </Col>
              <Col sm="4">
                <FormGroup>
                  <Label htmlFor="bathrooms" className="form-label">Bathrooms *</Label>
                  <div className="form-control-wrap">
                    <Input
                      type="number"
                      id="bathrooms"
                      min="1"
                      max="10"
                      className={`form-control ${errors.bathrooms ? 'error' : ''}`}
                      {...register('bathrooms', { valueAsNumber: true })}
                    />
                    {errors.bathrooms && (
                      <span className="form-note-error">{errors.bathrooms.message}</span>
                    )}
                  </div>
                </FormGroup>
              </Col>
              <Col sm="12">
                <FormGroup>
                  <Label className="form-label">Amenities *</Label>
                  <div className="custom-control-group">
                    <Row className="g-2">
                      {availableAmenities.map(amenity => (
                        <Col sm="6" md="4" key={amenity}>
                          <div className="custom-control custom-checkbox">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id={`amenity-${amenity.replace(/\s+/g, '-').toLowerCase()}`}
                              checked={(watchedValues.amenities || []).includes(amenity)}
                              onChange={() => handleAmenityToggle(amenity)}
                            />
                            <label 
                              className="custom-control-label" 
                              htmlFor={`amenity-${amenity.replace(/\s+/g, '-').toLowerCase()}`}
                            >
                              {amenity}
                            </label>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>
                  {errors.amenities && (
                    <span className="form-note-error">{errors.amenities.message}</span>
                  )}
                  <div className="form-note">
                    Select all amenities available at your property ({(watchedValues.amenities || []).length} selected)
                  </div>
                </FormGroup>
              </Col>
            </Row>
          </div>
        );

      case 3:
        return (
          <div>
            <h5 className="mb-4">Pricing & Photos</h5>
            <Row className="g-4">
              <Col sm="6">
                <FormGroup>
                  <Label htmlFor="price_per_night" className="form-label">Price per Night (KES) *</Label>
                  <div className="form-control-wrap">
                    <Input
                      type="number"
                      id="price_per_night"
                      min="100"
                      step="50"
                      className={`form-control ${errors.price_per_night ? 'error' : ''}`}
                      placeholder="Enter nightly rate"
                      {...register('price_per_night', { valueAsNumber: true })}
                    />
                    {errors.price_per_night && (
                      <span className="form-note-error">{errors.price_per_night.message}</span>
                    )}
                  </div>
                  <div className="form-note">
                    Set a competitive price for your area
                  </div>
                </FormGroup>
              </Col>
              <Col sm="6">
                <FormGroup>
                  <Label htmlFor="cancellation_policy" className="form-label">Cancellation Policy *</Label>
                  <div className="form-control-wrap">
                    <Input
                      type="select"
                      id="cancellation_policy"
                      className={`form-control ${errors.cancellation_policy ? 'error' : ''}`}
                      {...register('cancellation_policy')}
                    >
                      <option value="flexible">Flexible - Full refund 1 day prior</option>
                      <option value="moderate">Moderate - Full refund 5 days prior</option>
                      <option value="strict">Strict - 50% refund up to 1 week prior</option>
                    </Input>
                    {errors.cancellation_policy && (
                      <span className="form-note-error">{errors.cancellation_policy.message}</span>
                    )}
                  </div>
                </FormGroup>
              </Col>
              <Col sm="12">
                <FormGroup>
                  <Label className="form-label">Property Photos *</Label>
                  
                  {/* Drag & Drop Upload Area */}
                  <div 
                    {...getRootProps()} 
                    className={`dropzone ${isDragActive ? 'dropzone-active' : ''}`}
                    style={{
                      border: '2px dashed #e5e9f2',
                      borderRadius: '8px',
                      padding: '3rem 2rem',
                      textAlign: 'center',
                      cursor: 'pointer',
                      backgroundColor: isDragActive ? '#f8f9fa' : '#fff',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <input {...getInputProps()} />
                    <div>
                      <Icon name="upload" style={{ fontSize: '3rem', color: '#6c757d', marginBottom: '1rem' }} />
                      <h6 className="title">
                        {isDragActive ? 'Drop the images here' : 'Drag & drop images here, or click to browse'}
                      </h6>
                      <p className="text-muted">
                        Upload high-quality photos (JPEG, PNG, WebP) • Max 5MB each • At least 1 photo required
                      </p>
                    </div>
                  </div>

                  {/* Image Preview Grid */}
                  {uploadedImages.length > 0 && (
                    <div className="uploaded-images mt-4">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="title">Uploaded Photos ({uploadedImages.length})</h6>
                        <small className="text-muted">Drag to reorder • First photo is the main image</small>
                      </div>
                      <Row className="g-3">
                        {uploadedImages.map((image, index) => (
                          <Col sm="6" md="4" lg="3" key={image.id}>
                            <div className="image-preview position-relative">
                              <div 
                                className="image-container"
                                style={{
                                  position: 'relative',
                                  aspectRatio: '4/3',
                                  overflow: 'hidden',
                                  borderRadius: '8px',
                                  border: index === 0 ? '3px solid #007bff' : '1px solid #e5e9f2'
                                }}
                              >
                                <img
                                  src={image.preview}
                                  alt={`Property photo ${index + 1}`}
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                  }}
                                />
                                {index === 0 && (
                                  <div 
                                    className="main-photo-badge"
                                    style={{
                                      position: 'absolute',
                                      top: '8px',
                                      left: '8px',
                                      background: '#007bff',
                                      color: 'white',
                                      padding: '4px 8px',
                                      borderRadius: '4px',
                                      fontSize: '12px',
                                      fontWeight: 'bold'
                                    }}
                                  >
                                    MAIN
                                  </div>
                                )}
                                <Button
                                  size="sm"
                                  color="danger"
                                  className="position-absolute"
                                  style={{ top: '8px', right: '8px', padding: '4px 8px' }}
                                  onClick={() => removeImage(image.id)}
                                >
                                  <Icon name="cross" />
                                </Button>
                              </div>
                              <p className="text-center mt-2 mb-0 small">
                                {index === 0 ? 'Main Photo' : `Photo ${index + 1}`}
                              </p>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </div>
                  )}

                  <div className="form-note mt-3">
                    <Icon name="info" className="mr-1" />
                    Upload at least 1 high-quality photo. The first photo will be your main listing image. 
                    Great photos get more bookings!
                  </div>
                </FormGroup>
              </Col>
            </Row>
          </div>
        );

      case 4:
        return (
          <div>
            <h5 className="mb-4">House Rules & Final Details</h5>
            <Row className="g-4">
              <Col sm="12">
                <FormGroup>
                  <Label htmlFor="house_rules" className="form-label">House Rules</Label>
                  <div className="form-control-wrap">
                    <Input
                      type="textarea"
                      id="house_rules"
                      rows="4"
                      className={`form-control ${errors.house_rules ? 'error' : ''}`}
                      placeholder="Enter any specific rules for guests (e.g., no smoking, no pets, quiet hours, check-in/out times, etc.)"
                      {...register('house_rules')}
                    />
                    {errors.house_rules && (
                      <span className="form-note-error">{errors.house_rules.message}</span>
                    )}
                  </div>
                  <div className="form-note">
                    Be clear about your expectations to ensure great guest experiences
                  </div>
                </FormGroup>
              </Col>
              
              <Col sm="12">
                <div className="preview-block">
                  <h6>Listing Preview</h6>
                  <Card className="card-bordered">
                    <CardBody>
                      <div className="d-flex align-items-start">
                        {/* Main Image Preview */}
                        <div className="me-3" style={{ width: '120px', height: '90px', flexShrink: 0 }}>
                          {uploadedImages.length > 0 ? (
                            <img
                              src={uploadedImages[0].preview}
                              alt="Property preview"
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: '8px'
                              }}
                            />
                          ) : (
                            <div 
                              style={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: '#f8f9fa',
                                border: '2px dashed #e5e9f2',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <Icon name="img" className="text-muted" />
                            </div>
                          )}
                        </div>

                        {/* Listing Details */}
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{watchedValues.title || "Property Title"}</h6>
                          <p className="text-soft mb-2">
                            {watchedValues.property_type ? 
                              propertyTypes.find(t => t.value === watchedValues.property_type)?.label 
                              : "Property Type"
                            } • {watchedValues.location || "Location"}
                          </p>
                          
                          <div className="d-flex align-items-center mb-2 text-sm">
                            <Icon name="users" className="mr-1" style={{ fontSize: '14px' }}></Icon>
                            <span className="mr-3">{watchedValues.max_guests || 0} guests</span>
                            <Icon name="home" className="mr-1" style={{ fontSize: '14px' }}></Icon>
                            <span className="mr-3">{watchedValues.bedrooms || 0} bedrooms</span>
                            <Icon name="check-circle" className="mr-1" style={{ fontSize: '14px' }}></Icon>
                            <span>{watchedValues.bathrooms || 0} bathrooms</span>
                          </div>
                          
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="text-soft small">
                              {(watchedValues.amenities || []).length} amenities • {uploadedImages.length} photos
                            </span>
                            <span className="h6 mb-0 text-primary">
                              KES {(watchedValues.price_per_night || 0).toLocaleString()}/night
                            </span>
                          </div>

                          {watchedValues.cancellation_policy && (
                            <div className="mt-2">
                              <span className="badge badge-outline-info badge-sm">
                                {watchedValues.cancellation_policy} cancellation
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Description Preview */}
                      {watchedValues.description && (
                        <div className="mt-3 pt-3 border-top">
                          <p className="text-soft mb-0" style={{ fontSize: '14px' }}>
                            {watchedValues.description.length > 150 
                              ? `${watchedValues.description.substring(0, 150)}...` 
                              : watchedValues.description
                            }
                          </p>
                        </div>
                      )}

                      {/* Popular Amenities Preview */}
                      {(watchedValues.amenities || []).length > 0 && (
                        <div className="mt-3 pt-3 border-top">
                          <small className="text-muted d-block mb-2">Popular amenities:</small>
                          <div className="d-flex flex-wrap gap-1">
                            {(watchedValues.amenities || []).slice(0, 6).map(amenity => (
                              <span key={amenity} className="badge badge-outline-light badge-sm">
                                {amenity}
                              </span>
                            ))}
                            {(watchedValues.amenities || []).length > 6 && (
                              <span className="badge badge-outline-light badge-sm">
                                +{(watchedValues.amenities || []).length - 6} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </CardBody>
                  </Card>
                  <div className="form-note mt-2">
                    <Icon name="info" className="mr-1" />
                    This is how your listing will appear to potential guests
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        );

      default:
        return null;
    }
  };

  // Loading state for edit mode
  if (loadingListing && isEdit) {
    return (
      <React.Fragment>
        <Head title={isEdit ? "Edit Listing" : "Create Listing"} />
        <Content>
          <BlockHead size="sm">
            <BlockHeadContent>
              <BlockTitle page>Loading Listing...</BlockTitle>
            </BlockHeadContent>
          </BlockHead>
          <Block>
            <div className="d-flex justify-content-center p-4">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          </Block>
        </Content>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Head title={isEdit ? "Edit Listing" : "Create Listing"} />
      <Content>
        <BlockHead size="sm">
          <BlockHeadContent>
            <BlockTitle page>
              {isView ? "View Listing" : isEdit ? "Edit Listing" : "Create New Listing"}
            </BlockTitle>
            <BlockDes className="text-soft">
              <p>
                {isView 
                  ? "View your listing details" 
                  : isEdit 
                    ? "Update your property information" 
                    : "Add a new property to your BnB portfolio"
                }
              </p>
            </BlockDes>
          </BlockHeadContent>
          <div className="nk-block-head-sub">
            <Button color="light" outline onClick={() => navigate('/dashboard/bnb/my-listings')}>
              <Icon name="arrow-left" className="mr-1" />
              Back to Listings
            </Button>
          </div>
        </BlockHead>

        <Block>
          <Card className="card-bordered">
            <CardHeader>
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="title">
                  {isView ? "Listing Details" : "Listing Information"}
                </h6>
                {isEdit && (
                  <span className="badge badge-outline-info">Editing</span>
                )}
              </div>
              
              {/* Progress Steps */}
              <div className="progress-wrap mt-3">
                <div className="progress progress-md">
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                  ></div>
                </div>
                <div className="progress-text">
                  <div className="progress-label">Step {currentStep} of {totalSteps}</div>
                  <div className="progress-percent">{Math.round((currentStep / totalSteps) * 100)}%</div>
                </div>
              </div>
            </CardHeader>
            
            <CardBody>
              <Form onSubmit={handleSubmit(onSubmit)}>
                {renderStepContent()}

                <div className="form-group mt-5">
                  <Row>
                    <Col sm="6">
                      {currentStep > 1 && (
                        <Button
                          type="button"
                          color="light"
                          size="lg"
                          onClick={prevStep}
                          disabled={isSubmitting}
                        >
                          <Icon name="arrow-left" className="mr-1"></Icon>
                          Previous
                        </Button>
                      )}
                    </Col>
                    <Col sm="6" className="text-right">
                      {isView ? (
                        <Button
                          type="button"
                          color="primary"
                          size="lg"
                          onClick={() => navigate(`/dashboard/bnb/create-listing?edit=${editId || viewMode}`)}
                        >
                          <Icon name="edit" className="mr-1"></Icon>
                          Edit Listing
                        </Button>
                      ) : currentStep < totalSteps ? (
                        <Button
                          type="button"
                          color="primary"
                          size="lg"
                          onClick={nextStep}
                          disabled={isSubmitting}
                        >
                          Next
                          <Icon name="arrow-right" className="ml-1"></Icon>
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          color="primary"
                          size="lg"
                          disabled={isSubmitting || uploadedImages.length === 0}
                        >
                          {isSubmitting ? (
                            <>
                              <div className="spinner-border spinner-border-sm mr-2" role="status">
                                <span className="sr-only">Loading...</span>
                              </div>
                              {isEdit ? 'Updating...' : 'Creating...'}
                            </>
                          ) : (
                            <>
                              <Icon name={isEdit ? "edit" : "check"} className="mr-1"></Icon>
                              {isEdit ? "Update Listing" : "Create Listing"}
                            </>
                          )}
                        </Button>
                      )}
                    </Col>
                  </Row>
                  
                  {/* Form validation summary */}
                  {Object.keys(errors).length > 0 && (
                    <div className="alert alert-warning mt-3">
                      <h6>Please fix the following errors:</h6>
                      <ul className="mb-0">
                        {Object.entries(errors).map(([field, error]) => (
                          <li key={field}>
                            <strong>{field.replace(/_/g, ' ')}:</strong> {error.message}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Form>
            </CardBody>
          </Card>
        </Block>
      </Content>
    </React.Fragment>
  );
};

export default CreateListing;

