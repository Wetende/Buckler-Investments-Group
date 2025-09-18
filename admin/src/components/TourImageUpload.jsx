import React from 'react';
import AdminFileUpload from './AdminFileUpload';
import { useUploadTourImages, useDeleteFile } from '@/hooks/useUploads';

const TourImageUpload = ({
  tourId,
  existingImages = [],
  onImagesChange,
  maxFiles = 10,
  maxSize = 5242880, // 5MB
  className = ''
}) => {
  return (
    <AdminFileUpload
      entityType="tour"
      entityId={tourId}
      existingFiles={existingImages}
      onFilesChange={onImagesChange}
      uploadHook={useUploadTourImages}
      deleteHook={useDeleteFile}
      maxFiles={maxFiles}
      maxSize={maxSize}
      acceptedTypes={{
        'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
      }}
      uploadText="Drag & drop tour images here, or click to select"
      className={className}
      showPreviews={true}
    />
  );
};

export default TourImageUpload;
