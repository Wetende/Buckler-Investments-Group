import React, { useState, useCallback } from 'react';
import Dropzone from 'react-dropzone';
import { Button, Icon } from "@/components/Component";
import { uploadCarImages, deleteFile } from '../../api/uploads';
import { toast } from 'react-toastify';

const VehicleImageUpload = ({ 
  vehicleId = null, 
  existingImages = [], 
  onImagesChange, 
  maxFiles = 5,
  className = ""
}) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDropChange = useCallback(async (acceptedFiles) => {
    if (!acceptedFiles.length) return;

    // Create preview objects
    const newFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        uploading: true,
        uploaded: false
      })
    );

    setFiles(prev => [...prev, ...newFiles]);

    // If vehicleId exists, upload immediately
    if (vehicleId) {
      setUploading(true);
      try {
        const uploadedImages = await uploadCarImages(
          vehicleId, 
          acceptedFiles, 
          (progress) => setUploadProgress(progress)
        );

        // Update files with uploaded URLs
        setFiles(prev => prev.map(file => {
          const matchingUpload = uploadedImages.find(img => img.original_name === file.name);
          if (matchingUpload) {
            return {
              ...file,
              uploading: false,
              uploaded: true,
              url: matchingUpload.url,
              id: matchingUpload.id
            };
          }
          return file;
        }));

        // Notify parent component
        onImagesChange?.(uploadedImages.map(img => img.url));
        toast.success(`${uploadedImages.length} image(s) uploaded successfully`);

      } catch (error) {
        console.error('Upload failed:', error);
        toast.error('Upload failed. Please try again.');
        
        // Remove failed uploads
        setFiles(prev => prev.filter(file => !newFiles.includes(file)));
      } finally {
        setUploading(false);
        setUploadProgress(0);
      }
    } else {
      // For new vehicles, just store files for later upload
      onImagesChange?.(newFiles);
    }
  }, [vehicleId, onImagesChange]);

  const removeFile = useCallback(async (fileToRemove) => {
    if (fileToRemove.uploaded && fileToRemove.id) {
      try {
        await deleteFile(fileToRemove.id);
        toast.success('Image deleted successfully');
      } catch (error) {
        console.error('Delete failed:', error);
        toast.error('Failed to delete image');
        return;
      }
    }

    setFiles(prev => {
      const newFiles = prev.filter(file => file !== fileToRemove);
      onImagesChange?.(newFiles.filter(f => f.uploaded).map(f => f.url));
      return newFiles;
    });

    // Cleanup preview URL
    if (fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
  }, [onImagesChange]);

  const totalImages = files.length + existingImages.length;
  const canAddMore = totalImages < maxFiles;

  return (
    <div className={`vehicle-image-upload ${className}`}>
      <div className="form-group">
        <label className="form-label">Vehicle Images</label>
        <div className="form-note text-soft">
          Upload up to {maxFiles} high-quality images of your vehicle. Recommended size: 1200x800px.
        </div>
        
        {canAddMore && (
          <Dropzone 
            onDrop={handleDropChange}
            accept={{
              'image/*': ['.jpeg', '.jpg', '.png', '.webp']
            }}
            maxFiles={maxFiles - totalImages}
            disabled={uploading}
          >
            {({ getRootProps, getInputProps, isDragActive }) => (
              <div 
                {...getRootProps()} 
                className={`dropzone upload-zone dz-clickable ${isDragActive ? 'dz-drag-hover' : ''} ${uploading ? 'uploading' : ''}`}
                style={{ minHeight: '120px', marginTop: '10px' }}
              >
                <input {...getInputProps()} />
                <div className="dz-message">
                  {uploading ? (
                    <div>
                      <Icon name="upload" className="text-primary" style={{ fontSize: '2rem' }} />
                      <div className="mt-2">
                        <div>Uploading... {uploadProgress}%</div>
                        <div className="progress mt-2" style={{ height: '4px' }}>
                          <div 
                            className="progress-bar bg-primary" 
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Icon name="upload" className="text-soft" style={{ fontSize: '2rem' }} />
                      <div className="mt-2">
                        <span className="dz-message-text">
                          {isDragActive ? 'Drop images here' : 'Drag & drop images here'}
                        </span>
                        <div className="dz-message-or">or</div>
                        <Button color="primary" size="sm">
                          <Icon name="camera" />
                          SELECT IMAGES
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Dropzone>
        )}

        {/* Display existing images */}
        {existingImages.length > 0 && (
          <div className="uploaded-images mt-3">
            <h6 className="text-soft">Existing Images</h6>
            <div className="row g-3">
              {existingImages.map((imageUrl, index) => (
                <div key={index} className="col-md-3">
                  <div className="image-preview">
                    <img 
                      src={imageUrl} 
                      alt={`Vehicle ${index + 1}`}
                      className="img-thumbnail"
                      style={{ width: '100%', height: '120px', objectFit: 'cover' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Display uploaded files */}
        {files.length > 0 && (
          <div className="uploaded-files mt-3">
            <h6 className="text-soft">
              {vehicleId ? 'Uploaded Images' : 'Selected Images'}
            </h6>
            <div className="row g-3">
              {files.map((file, index) => (
                <div key={file.name || index} className="col-md-3">
                  <div className="image-preview position-relative">
                    <img 
                      src={file.preview || file.url} 
                      alt={file.name}
                      className="img-thumbnail"
                      style={{ width: '100%', height: '120px', objectFit: 'cover' }}
                    />
                    
                    {file.uploading && (
                      <div className="upload-overlay">
                        <div className="spinner-border spinner-border-sm text-primary" role="status">
                          <span className="sr-only">Uploading...</span>
                        </div>
                      </div>
                    )}
                    
                    <Button
                      size="sm"
                      color="danger"
                      className="btn-icon position-absolute"
                      style={{ top: '5px', right: '5px' }}
                      onClick={() => removeFile(file)}
                      disabled={file.uploading}
                    >
                      <Icon name="cross" />
                    </Button>
                    
                    {file.uploaded && (
                      <div className="upload-success position-absolute" style={{ top: '5px', left: '5px' }}>
                        <Icon name="check-circle" className="text-success" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {totalImages >= maxFiles && (
          <div className="alert alert-info mt-3">
            <Icon name="info" /> Maximum {maxFiles} images allowed. Remove an image to add more.
          </div>
        )}
      </div>

      <style jsx>{`
        .upload-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.375rem;
        }
        
        .dz-drag-hover {
          border-color: #007bff !important;
          background-color: rgba(0, 123, 255, 0.1) !important;
        }
        
        .dropzone.uploading {
          pointer-events: none;
          opacity: 0.7;
        }
      `}</style>
    </div>
  );
};

export default VehicleImageUpload;
