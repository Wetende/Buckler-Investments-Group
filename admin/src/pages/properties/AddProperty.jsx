import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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

const propertySchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  location: z.string().min(3, "Location must be at least 3 characters"),
  type: z.string().min(1, "Select a property type"),
  purpose: z.string().min(1, "Select purpose"),
  price: z.number().min(0, "Price must be positive"),
  bedrooms: z.number().min(0),
  bathrooms: z.number().min(0),
  size: z.string().min(1, "Enter size (e.g., 120 sqm)"),
});

const AddProperty = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      type: "",
      purpose: "",
      price: 0,
      bedrooms: 0,
      bathrooms: 0,
      size: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      // TODO: Wire to properties service: POST with id: 0
      console.log("create property payload:", { id: 0, ...data });
      alert("Property created (mock). Wire API next.");
    } catch (e) {
      console.error(e);
      alert("Failed to create property");
    }
  };

  return (
    <React.Fragment>
      <Head title="Add Property" />
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page>Add New Property</BlockTitle>
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
                        <label className="form-label">Title</label>
                        <div className="form-control-wrap">
                          <input type="text" className={`form-control ${errors.title ? "error" : ""}`} {...register("title")} />
                          {errors.title && <span className="form-note-error">{errors.title.message}</span>}
                        </div>
                      </div>
                    </Col>
                    <Col sm="6">
                      <div className="form-group">
                        <label className="form-label">Location</label>
                        <div className="form-control-wrap">
                          <input type="text" className={`form-control ${errors.location ? "error" : ""}`} {...register("location")} />
                          {errors.location && <span className="form-note-error">{errors.location.message}</span>}
                        </div>
                      </div>
                    </Col>

                    <Col sm="6">
                      <div className="form-group">
                        <label className="form-label">Type</label>
                        <div className="form-control-wrap">
                          <select className={`form-select ${errors.type ? "error" : ""}`} {...register("type")}>
                            <option value="">Select type</option>
                            <option value="apartment">Apartment</option>
                            <option value="villa">Villa</option>
                            <option value="house">House</option>
                            <option value="land">Land</option>
                            <option value="commercial">Commercial</option>
                          </select>
                          {errors.type && <span className="form-note-error">{errors.type.message}</span>}
                        </div>
                      </div>
                    </Col>
                    <Col sm="6">
                      <div className="form-group">
                        <label className="form-label">Purpose</label>
                        <div className="form-control-wrap">
                          <select className={`form-select ${errors.purpose ? "error" : ""}`} {...register("purpose")}>
                            <option value="">Select purpose</option>
                            <option value="For Sale">For Sale</option>
                            <option value="For Rent">For Rent</option>
                          </select>
                          {errors.purpose && <span className="form-note-error">{errors.purpose.message}</span>}
                        </div>
                      </div>
                    </Col>

                    <Col sm="6">
                      <div className="form-group">
                        <label className="form-label">Price (KES)</label>
                        <div className="form-control-wrap">
                          <input type="number" className={`form-control ${errors.price ? "error" : ""}`} {...register("price", { valueAsNumber: true })} />
                          {errors.price && <span className="form-note-error">{errors.price.message}</span>}
                        </div>
                      </div>
                    </Col>
                    <Col sm="3">
                      <div className="form-group">
                        <label className="form-label">Bedrooms</label>
                        <div className="form-control-wrap">
                          <input type="number" className={`form-control ${errors.bedrooms ? "error" : ""}`} {...register("bedrooms", { valueAsNumber: true })} />
                          {errors.bedrooms && <span className="form-note-error">{errors.bedrooms.message}</span>}
                        </div>
                      </div>
                    </Col>
                    <Col sm="3">
                      <div className="form-group">
                        <label className="form-label">Bathrooms</label>
                        <div className="form-control-wrap">
                          <input type="number" className={`form-control ${errors.bathrooms ? "error" : ""}`} {...register("bathrooms", { valueAsNumber: true })} />
                          {errors.bathrooms && <span className="form-note-error">{errors.bathrooms.message}</span>}
                        </div>
                      </div>
                    </Col>
                    <Col sm="6">
                      <div className="form-group">
                        <label className="form-label">Size</label>
                        <div className="form-control-wrap">
                          <input type="text" className={`form-control ${errors.size ? "error" : ""}`} {...register("size")} placeholder="e.g., 120 sqm" />
                          {errors.size && <span className="form-note-error">{errors.size.message}</span>}
                        </div>
                      </div>
                    </Col>
                    <Col sm="12">
                      <div className="form-group">
                        <label className="form-label">Description</label>
                        <div className="form-control-wrap">
                          <textarea className={`form-control ${errors.description ? "error" : ""}`} rows="4" {...register("description")} />
                          {errors.description && <span className="form-note-error">{errors.description.message}</span>}
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <div className="form-group mt-4">
                    <Button type="submit" color="primary" size="lg" disabled={isSubmitting}>
                      {isSubmitting ? "Saving..." : "Create Property"}
                    </Button>
                    <Button type="button" color="light" size="lg" className="ml-2" onClick={() => window.history.back()}>
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

export default AddProperty;


