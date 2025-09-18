import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import Head from "@/layout/head/Head";
import Content from "@/layout/content/Content";
import {
  Block,
  BlockHead,
  BlockContent,
  BlockTitle,
  Row,
  Col,
  Button,
  Icon,
  BlockBetween,
  BlockHeadContent,
} from "@/components/Component";
import RSelect from "@/components/select/ReactSelect";
import { useCreateVehicle } from "../../hooks/useCars";
import VehicleImageUpload from "../../components/upload/VehicleImageUpload";

// Validation schema for vehicle
const vehicleSchema = z.object({
  make: z.string().min(2, "Make must be at least 2 characters"),
  model: z.string().min(2, "Model must be at least 2 characters"),
  year: z.number().min(1990, "Year must be 1990 or later").max(new Date().getFullYear() + 1),
  pricePerDay: z.number().min(1, "Price per day must be greater than 0"),
  location: z.string().min(3, "Location must be at least 3 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.string().min(1, "Please select a category"),
  transmission: z.string().min(1, "Please select transmission type"),
  fuelType: z.string().min(1, "Please select fuel type"),
  seats: z.number().min(2, "Must have at least 2 seats").max(50),
  mileage: z.number().min(0, "Mileage cannot be negative"),
  features: z.array(z.string()).optional(),
});

const AddVehicle = () => {
  const navigate = useNavigate();
  const createVehicle = useCreateVehicle();
  const [vehicleImages, setVehicleImages] = React.useState([]);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      make: "",
      model: "",
      year: new Date().getFullYear(),
      pricePerDay: 0,
      location: "",
      description: "",
      category: "",
      transmission: "",
      fuelType: "",
      seats: 5,
      mileage: 0,
      features: [],
    },
  });

  const categoryOptions = [
    { value: "economy", label: "Economy" },
    { value: "compact", label: "Compact" },
    { value: "midsize", label: "Midsize" },
    { value: "suv", label: "SUV" },
    { value: "luxury", label: "Luxury" },
    { value: "van", label: "Van" },
    { value: "pickup", label: "Pickup Truck" },
  ];

  const transmissionOptions = [
    { value: "automatic", label: "Automatic" },
    { value: "manual", label: "Manual" },
  ];

  const fuelTypeOptions = [
    { value: "petrol", label: "Petrol" },
    { value: "diesel", label: "Diesel" },
    { value: "hybrid", label: "Hybrid" },
    { value: "electric", label: "Electric" },
  ];

  const onSubmit = async (data) => {
    try {
      // Transform form data to match API structure
      const vehicleData = {
        make: data.make,
        model: data.model,
        year: data.year,
        daily_rate: data.pricePerDay,
        currency: "KES",
        owner_id: 1, // TODO: Get from authenticated user context
        location: data.location,
        description: data.description,
        category: data.category,
        transmission: data.transmission,
        fuel_type: data.fuelType,
        seats: data.seats,
        features: data.features || [],
        images: vehicleImages, // Include uploaded image URLs
        status: "available"
      };

      await createVehicle.mutateAsync(vehicleData);
      navigate("/cars/my-vehicles");
    } catch (error) {
      console.error("Failed to create vehicle:", error);
      // Error handling is done in the mutation hook via toast
    }
  };

  const handleImagesChange = (imageUrls) => {
    setVehicleImages(imageUrls);
  };

  return (
    <React.Fragment>
      <Head title="Add Vehicle" />
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page>Add New Vehicle</BlockTitle>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        <Block>
          <BlockContent>
            <div className="card card-bordered">
              <div className="card-inner">
                <form onSubmit={handleSubmit(onSubmit)} className="admin-form">
                  <Row className="g-4">
                    <Col sm="6">
                      <div className="form-group">
                        <label className="form-label">Make</label>
                        <div className="form-control-wrap">
                          <input
                            type="text"
                            className={`form-control ${errors.make ? "error" : ""}`}
                            {...register("make")}
                            placeholder="Enter vehicle make (e.g., Toyota)"
                          />
                          {errors.make && (
                            <span className="form-note-error">{errors.make.message}</span>
                          )}
                        </div>
                      </div>
                    </Col>

                    <Col sm="6">
                      <div className="form-group">
                        <label className="form-label">Model</label>
                        <div className="form-control-wrap">
                          <input
                            type="text"
                            className={`form-control ${errors.model ? "error" : ""}`}
                            {...register("model")}
                            placeholder="Enter vehicle model (e.g., Camry)"
                          />
                          {errors.model && (
                            <span className="form-note-error">{errors.model.message}</span>
                          )}
                        </div>
                      </div>
                    </Col>

                    <Col sm="6">
                      <div className="form-group">
                        <label className="form-label">Year</label>
                        <div className="form-control-wrap">
                          <input
                            type="number"
                            className={`form-control ${errors.year ? "error" : ""}`}
                            {...register("year", { valueAsNumber: true })}
                            placeholder="Enter year"
                          />
                          {errors.year && (
                            <span className="form-note-error">{errors.year.message}</span>
                          )}
                        </div>
                      </div>
                    </Col>

                    <Col sm="6">
                      <div className="form-group">
                        <label className="form-label">Price per Day (KES)</label>
                        <div className="form-control-wrap">
                          <input
                            type="number"
                            className={`form-control ${errors.pricePerDay ? "error" : ""}`}
                            {...register("pricePerDay", { valueAsNumber: true })}
                            placeholder="Enter daily rental price"
                          />
                          {errors.pricePerDay && (
                            <span className="form-note-error">{errors.pricePerDay.message}</span>
                          )}
                        </div>
                      </div>
                    </Col>

                    <Col sm="6">
                      <div className="form-group">
                        <label className="form-label">Category</label>
                        <div className="form-control-wrap">
                          <RSelect
                            options={categoryOptions}
                            placeholder="Select vehicle category"
                            onChange={(option) => setValue("category", option.value)}
                          />
                          {errors.category && (
                            <span className="form-note-error">{errors.category.message}</span>
                          )}
                        </div>
                      </div>
                    </Col>

                    <Col sm="6">
                      <div className="form-group">
                        <label className="form-label">Location</label>
                        <div className="form-control-wrap">
                          <input
                            type="text"
                            className={`form-control ${errors.location ? "error" : ""}`}
                            {...register("location")}
                            placeholder="Enter pickup location"
                          />
                          {errors.location && (
                            <span className="form-note-error">{errors.location.message}</span>
                          )}
                        </div>
                      </div>
                    </Col>

                    <Col sm="6">
                      <div className="form-group">
                        <label className="form-label">Transmission</label>
                        <div className="form-control-wrap">
                          <RSelect
                            options={transmissionOptions}
                            placeholder="Select transmission type"
                            onChange={(option) => setValue("transmission", option.value)}
                          />
                          {errors.transmission && (
                            <span className="form-note-error">{errors.transmission.message}</span>
                          )}
                        </div>
                      </div>
                    </Col>

                    <Col sm="6">
                      <div className="form-group">
                        <label className="form-label">Fuel Type</label>
                        <div className="form-control-wrap">
                          <RSelect
                            options={fuelTypeOptions}
                            placeholder="Select fuel type"
                            onChange={(option) => setValue("fuelType", option.value)}
                          />
                          {errors.fuelType && (
                            <span className="form-note-error">{errors.fuelType.message}</span>
                          )}
                        </div>
                      </div>
                    </Col>

                    <Col sm="6">
                      <div className="form-group">
                        <label className="form-label">Number of Seats</label>
                        <div className="form-control-wrap">
                          <input
                            type="number"
                            className={`form-control ${errors.seats ? "error" : ""}`}
                            {...register("seats", { valueAsNumber: true })}
                            placeholder="Enter number of seats"
                          />
                          {errors.seats && (
                            <span className="form-note-error">{errors.seats.message}</span>
                          )}
                        </div>
                      </div>
                    </Col>

                    <Col sm="6">
                      <div className="form-group">
                        <label className="form-label">Mileage (KM)</label>
                        <div className="form-control-wrap">
                          <input
                            type="number"
                            className={`form-control ${errors.mileage ? "error" : ""}`}
                            {...register("mileage", { valueAsNumber: true })}
                            placeholder="Enter vehicle mileage"
                          />
                          {errors.mileage && (
                            <span className="form-note-error">{errors.mileage.message}</span>
                          )}
                        </div>
                      </div>
                    </Col>

                    <Col sm="12">
                      <VehicleImageUpload
                        vehicleId={null} // No vehicle ID for new vehicles
                        existingImages={[]}
                        onImagesChange={handleImagesChange}
                        maxFiles={5}
                        className="mb-4"
                      />
                    </Col>

                    <Col sm="12">
                      <div className="form-group">
                        <label className="form-label">Description</label>
                        <div className="form-control-wrap">
                          <textarea
                            className={`form-control ${errors.description ? "error" : ""}`}
                            {...register("description")}
                            rows="4"
                            placeholder="Describe the vehicle, its condition, and any special features..."
                          />
                          {errors.description && (
                            <span className="form-note-error">{errors.description.message}</span>
                          )}
                        </div>
                      </div>
                    </Col>
                  </Row>

                  <div className="form-group mt-4">
                    <Button type="submit" color="primary" size="lg" disabled={isSubmitting}>
                      {isSubmitting ? "Adding..." : "Add Vehicle"}
                    </Button>
                    <Button
                      type="button"
                      color="light"
                      size="lg"
                      className="ml-2"
                      onClick={() => window.history.back()}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </BlockContent>
        </Block>
      </Content>
    </React.Fragment>
  );
};

export default AddVehicle;


