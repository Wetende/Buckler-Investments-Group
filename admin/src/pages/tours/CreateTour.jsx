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
} from "@/components/Component";
import { Card, CardBody, CardHeader, FormGroup, Input, Label, Form } from "reactstrap";
import { useSaveTour, useTourCategories, useUploadTourImages } from "@/hooks/useTours";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import TourImageUpload from "@/components/TourImageUpload";

const CreateTour = () => {
  const navigate = useNavigate();
  
  // API Hooks
  const saveTour = useSaveTour();
  const uploadImages = useUploadTourImages();
  const { data: categories } = useTourCategories();
  
  // Form State
  const [formData, setFormData] = useState({
    id: 0, // 0 for create, >0 for update
    title: "",
    description: "",
    location: "",
    duration: "",
    max_participants: 10,
    price: "",
    difficulty: "Easy",
    category: "",
    inclusions: [],
    exclusions: "",
    itinerary: [{ day: 1, title: "", description: "", activities: [] }],
    requirements: "",
    images: [],
    startDates: []
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const totalSteps = 5;

  // Use real categories from API or fallback
  const tourCategories = categories || [
    { id: 1, name: "Wildlife Safari", value: "wildlife" },
    { id: 2, name: "Cultural Tours", value: "cultural" },
    { id: 3, name: "Adventure", value: "adventure" },
    { id: 4, name: "Beach & Coast", value: "beach" },
    { id: 5, name: "City Tours", value: "city" }
  ];

  const difficultyLevels = [
    { value: "Easy", label: "Easy - Suitable for all ages" },
    { value: "Moderate", label: "Moderate - Some physical activity required" },
    { value: "Challenging", label: "Challenging - Good fitness level required" }
  ];

  const commonInclusions = [
    "Accommodation", "Meals", "Transportation", "Guide", "Entry Fees", 
    "Equipment", "Insurance", "Airport Transfer", "Water", "First Aid"
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleInclusionToggle = (inclusion) => {
    setFormData(prev => ({
      ...prev,
      inclusions: prev.inclusions.includes(inclusion)
        ? prev.inclusions.filter(i => i !== inclusion)
        : [...prev.inclusions, inclusion]
    }));
  };

  const addItineraryDay = () => {
    setFormData(prev => ({
      ...prev,
      itinerary: [...prev.itinerary, {
        day: prev.itinerary.length + 1,
        title: "",
        description: "",
        activities: []
      }]
    }));
  };

  const updateItineraryDay = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.map((day, i) => 
        i === index ? { ...day, [field]: value } : day
      )
    }));
  };

  const nextStep = () => {
    if (validateCurrentStep() && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      setFormErrors({}); // Clear errors when moving to next step
    } else if (!validateCurrentStep()) {
      toast.error("Please fix the form errors before continuing");
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Form validation
  const validateCurrentStep = () => {
    const errors = {};
    
    switch (currentStep) {
      case 1:
        if (!formData.title.trim()) errors.title = "Tour title is required";
        if (!formData.description.trim()) errors.description = "Description is required";
        if (!formData.location.trim()) errors.location = "Location is required";
        if (!formData.category) errors.category = "Category is required";
        break;
      case 2:
        if (!formData.duration.trim()) errors.duration = "Duration is required";
        if (!formData.price) errors.price = "Price is required";
        if (formData.price && formData.price <= 0) errors.price = "Price must be greater than 0";
        if (formData.max_participants < 1) errors.max_participants = "Must allow at least 1 participant";
        break;
      case 3:
        if (formData.inclusions.length === 0) errors.inclusions = "Select at least one inclusion";
        break;
      case 4:
        if (formData.itinerary.length === 0) errors.itinerary = "Add at least one day to the itinerary";
        break;
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateCurrentStep()) {
      toast.error("Please fix the form errors before submitting");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare tour data for API
      const tourData = {
        id: formData.id,
        title: formData.title,
        description: formData.description,
        location: formData.location,
        duration: formData.duration,
        max_participants: parseInt(formData.max_participants),
        price: parseFloat(formData.price),
        difficulty: formData.difficulty,
        category: formData.category,
        inclusions: formData.inclusions,
        exclusions: formData.exclusions,
        itinerary: formData.itinerary,
        requirements: formData.requirements,
        operator_id: 1, // TODO: Get from auth context
        status: "active"
      };

      // Save tour
      const savedTour = await saveTour.mutateAsync(tourData);
      
      // Upload images if any
      if (formData.images.length > 0) {
        // Extract files from local images
        const imagesToUpload = formData.images
          .filter(img => img.isLocal && img.file)
          .map(img => img.file);
          
        if (imagesToUpload.length > 0) {
          await uploadImages.mutateAsync({
            tourId: savedTour.id,
            files: imagesToUpload,
            onUploadProgress: setUploadProgress
          });
        }
      }

      toast.success("Tour created successfully!");
      navigate("/tours/my-tours");
      
    } catch (error) {
      console.error("Error creating tour:", error);
      toast.error(error.response?.data?.detail || "Failed to create tour");
    } finally {
      setIsSubmitting(false);
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
                  <Label htmlFor="title">Tour Title *</Label>
                  <Input
                    type="text"
                    id="title"
                    placeholder="Enter an engaging title for your tour"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    invalid={!!formErrors.title}
                  />
                  {formErrors.title && (
                    <div className="form-note-error">
                      <span>{formErrors.title}</span>
                    </div>
                  )}
                </FormGroup>
              </Col>
              <Col sm="12">
                <FormGroup>
                  <Label htmlFor="description">Description *</Label>
                  <Input
                    type="textarea"
                    id="description"
                    rows="4"
                    placeholder="Describe the tour experience, highlights, and what makes it unique"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    invalid={!!formErrors.description}
                  />
                  {formErrors.description && (
                    <div className="form-note-error">
                      <span>{formErrors.description}</span>
                    </div>
                  )}
                </FormGroup>
              </Col>
              <Col sm="6">
                <FormGroup>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    type="text"
                    id="location"
                    placeholder="Primary tour location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    invalid={!!formErrors.location}
                  />
                  {formErrors.location && (
                    <div className="form-note-error">
                      <span>{formErrors.location}</span>
                    </div>
                  )}
                </FormGroup>
              </Col>
              <Col sm="6">
                <FormGroup>
                  <Label htmlFor="category">Category *</Label>
                  <Input
                    type="select"
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    invalid={!!formErrors.category}
                  >
                    <option value="">Select category</option>
                    {tourCategories.map(cat => (
                      <option key={cat.id || cat.value} value={cat.name || cat.value}>
                        {cat.name || cat.label}
                      </option>
                    ))}
                  </Input>
                  {formErrors.category && (
                    <div className="form-note-error">
                      <span>{formErrors.category}</span>
                    </div>
                  )}
                </FormGroup>
              </Col>
            </Row>
          </div>
        );

      case 2:
        return (
          <div>
            <h5 className="mb-4">Tour Details</h5>
            <Row className="g-4">
              <Col sm="4">
                <FormGroup>
                  <Label htmlFor="duration">Duration *</Label>
                  <Input
                    type="text"
                    id="duration"
                    placeholder="e.g., 3 Days, 2 Nights"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    invalid={!!formErrors.duration}
                  />
                  {formErrors.duration && (
                    <div className="form-note-error">
                      <span>{formErrors.duration}</span>
                    </div>
                  )}
                </FormGroup>
              </Col>
              <Col sm="4">
                <FormGroup>
                  <Label htmlFor="max_participants">Max Group Size *</Label>
                  <Input
                    type="number"
                    id="max_participants"
                    min="1"
                    max="50"
                    value={formData.max_participants}
                    onChange={(e) => handleInputChange('max_participants', parseInt(e.target.value))}
                    invalid={!!formErrors.max_participants}
                  />
                  {formErrors.max_participants && (
                    <div className="form-note-error">
                      <span>{formErrors.max_participants}</span>
                    </div>
                  )}
                </FormGroup>
              </Col>
              <Col sm="4">
                <FormGroup>
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <Input
                    type="select"
                    id="difficulty"
                    value={formData.difficulty}
                    onChange={(e) => handleInputChange('difficulty', e.target.value)}
                  >
                    {difficultyLevels.map(level => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col sm="6">
                <FormGroup>
                  <Label htmlFor="price">Price per Person (KES) *</Label>
                  <Input
                    type="number"
                    id="price"
                    placeholder="Enter price"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    invalid={!!formErrors.price}
                  />
                  {formErrors.price && (
                    <div className="form-note-error">
                      <span>{formErrors.price}</span>
                    </div>
                  )}
                </FormGroup>
              </Col>
              <Col sm="6">
                <FormGroup>
                  <Label htmlFor="requirements">Requirements</Label>
                  <Input
                    type="textarea"
                    id="requirements"
                    rows="3"
                    placeholder="Age limits, fitness requirements, what to bring, etc."
                    value={formData.requirements}
                    onChange={(e) => handleInputChange('requirements', e.target.value)}
                  />
                </FormGroup>
              </Col>
            </Row>
          </div>
        );

      case 3:
        return (
          <div>
            <h5 className="mb-4">Inclusions & Exclusions</h5>
            <Row className="g-4">
              <Col sm="12">
                <FormGroup>
                  <Label>What's Included *</Label>
                  <div className="custom-control-group">
                    <Row className="g-2">
                      {commonInclusions.map(inclusion => (
                        <Col sm="4" key={inclusion}>
                          <div className="custom-control custom-checkbox">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id={`inclusion-${inclusion}`}
                              checked={formData.inclusions.includes(inclusion)}
                              onChange={() => handleInclusionToggle(inclusion)}
                            />
                            <label className="custom-control-label" htmlFor={`inclusion-${inclusion}`}>
                              {inclusion}
                            </label>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>
                  {formErrors.inclusions && (
                    <div className="form-note-error mt-2">
                      <span>{formErrors.inclusions}</span>
                    </div>
                  )}
                </FormGroup>
              </Col>
              <Col sm="12">
                <FormGroup>
                  <Label htmlFor="exclusions">Exclusions</Label>
                  <Input
                    type="textarea"
                    id="exclusions"
                    rows="3"
                    placeholder="List what's not included (e.g., personal expenses, tips, optional activities)"
                    value={formData.exclusions}
                    onChange={(e) => handleInputChange('exclusions', e.target.value)}
                  />
                </FormGroup>
              </Col>
            </Row>
          </div>
        );

      case 4:
        return (
          <div>
            <h5 className="mb-4">Itinerary</h5>
            {formData.itinerary.map((day, index) => (
              <Card key={index} className="card-bordered mb-3">
                <CardBody>
                  <h6>Day {day.day}</h6>
                  <Row className="g-3">
                    <Col sm="6">
                      <FormGroup>
                        <Label>Day Title</Label>
                        <Input
                          type="text"
                          placeholder="e.g., Arrival & Game Drive"
                          value={day.title}
                          onChange={(e) => updateItineraryDay(index, 'title', e.target.value)}
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="12">
                      <FormGroup>
                        <Label>Description</Label>
                        <Input
                          type="textarea"
                          rows="3"
                          placeholder="Detailed description of the day's activities"
                          value={day.description}
                          onChange={(e) => updateItineraryDay(index, 'description', e.target.value)}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            ))}
            <Button color="light" outline onClick={addItineraryDay}>
              <Icon name="plus"></Icon>
              <span>Add Day</span>
            </Button>
          </div>
        );

      case 5:
        return (
          <div>
            <h5 className="mb-4">Photos & Final Details</h5>
            <Row className="g-4">
              <Col sm="12">
                <FormGroup>
                  <Label>Tour Photos</Label>
                  <TourImageUpload
                    tourId={null} // No tourId yet since we're creating
                    existingImages={formData.images}
                    onImagesChange={(images) => handleInputChange('images', images)}
                    maxFiles={10}
                    maxSize={5242880} // 5MB
                    className="mt-2"
                  />
                  <div className="form-note mt-2">
                    Upload high-quality photos that showcase the tour experience. Images will be uploaded after the tour is created.
                  </div>
                </FormGroup>
              </Col>
              <Col sm="12">
                <div className="preview-block">
                  <h6>Tour Preview</h6>
                  <Card className="card-bordered">
                    <CardBody>
                      <h6>{formData.title || "Tour Title"}</h6>
                      <p className="text-soft">{formData.location || "Location"}</p>
                      <div className="d-flex align-items-center mb-2">
                        <Icon name="clock" className="mr-1"></Icon>
                        <span className="mr-3">{formData.duration || "Duration"}</span>
                        <Icon name="users" className="mr-1"></Icon>
                        <span className="mr-3">Max {formData.max_participants} people</span>
                        <Icon name="flag" className="mr-1"></Icon>
                        <span>{formData.difficulty}</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-soft">
                          {formData.inclusions.length} inclusions
                        </span>
                        <span className="h6 mb-0">
                          KES {formData.price || "0"}/person
                        </span>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </Col>
            </Row>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <React.Fragment>
      <Head title="Create Tour" />
      <Content>
        <BlockHead size="sm">
          <BlockHeadContent>
            <BlockTitle page>Create New Tour</BlockTitle>
            <BlockDes className="text-soft">
              <p>Add a new tour package to your offerings.</p>
            </BlockDes>
          </BlockHeadContent>
        </BlockHead>

        <Block>
          <Card className="card-bordered">
            <CardHeader>
              <h6 className="title">Tour Information</h6>
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
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <Form onSubmit={handleSubmit}>
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
                        >
                          <Icon name="arrow-left" className="mr-1"></Icon>
                          Previous
                        </Button>
                      )}
                    </Col>
                    <Col sm="6" className="text-right">
                      {currentStep < totalSteps ? (
                        <Button
                          type="button"
                          color="primary"
                          size="lg"
                          onClick={nextStep}
                        >
                          Next
                          <Icon name="arrow-right" className="ml-1"></Icon>
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          color="primary"
                          size="lg"
                          disabled={isSubmitting || saveTour.isLoading}
                        >
                          {isSubmitting || saveTour.isLoading ? (
                            <>
                              <div className="spinner-border spinner-border-sm mr-2" role="status">
                                <span className="sr-only">Loading...</span>
                              </div>
                              {uploadProgress > 0 ? `Uploading... ${uploadProgress}%` : 'Creating Tour...'}
                            </>
                          ) : (
                            <>
                              <Icon name="check" className="mr-1"></Icon>
                              Create Tour
                            </>
                          )}
                        </Button>
                      )}
                    </Col>
                  </Row>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Block>
      </Content>
    </React.Fragment>
  );
};

export default CreateTour;

