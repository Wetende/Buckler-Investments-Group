import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button, Icon, Progress } from '@/components/Component';
import { Row, Col } from 'reactstrap';

/**
 * Generic admin file upload component following DashLite patterns
 * @param {Object} props - Component props
 */
const AdminFileUpload = ({
  entityType, // 'tour', 'property', 'bnb_listing', 'car'
  entityId,
  existingFiles = [],
  onFilesChange,
  uploadHook, // Custom upload hook to use
  deleteHook, // Custom delete hook to use
  maxFiles = 10,
  maxSize = 5242880, // 5MB
  acceptedTypes = {
    'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
  },
  uploadText = 'Drag & drop files here, or click to select',
  className = '',
  showPreviews = true
}) => {
  const [localFiles, setLocalFiles] = useState(existingFiles);
  const [uploadingFiles, setUploadingFiles] = useState([]);
  
  const uploadFiles = uploadHook();
  const deleteFile = deleteHook();

  const onDrop = useCallback(async (acceptedFiles) => {
    if (!entityId) {
      // If no entityId yet, just store files locally for later upload
      const newFiles = acceptedFiles.map(file => ({
        id: `temp_${Date.now()}_${Math.random()}`,
        file,
        name: file.name,
        size: file.size,
        preview: URL.createObjectURL(file),
        isLocal: true
      }));
      
      const updatedFiles = [...localFiles, ...newFiles];
      setLocalFiles(updatedFiles);
      onFilesChange?.(updatedFiles);
      return;
    }

    // Upload files immediately if we have an entityId
    for (const file of acceptedFiles) {
      const uploadId = `upload_${Date.now()}_${Math.random()}`;
      
      // Add to uploading list
      setUploadingFiles(prev => [...prev, {
        id: uploadId,
        name: file.name,
        progress: 0
      }]);

      try {
        const uploadParams = {};
        uploadParams[`${entityType}Id`] = entityId; // tourId, propertyId, etc.
        
        const uploadedFile = await uploadFiles.mutateAsync({
          ...uploadParams,
          files: file,
          onUploadProgress: (progress) => {
            setUploadingFiles(prev => 
              prev.map(item => 
                item.id === uploadId 
                  ? { ...item, progress }
                  : item
              )
            );
          }
        });

        // Remove from uploading list and add to completed files
        setUploadingFiles(prev => prev.filter(item => item.id !== uploadId));
        
        const newFile = {
          id: uploadedFile.id,
          name: uploadedFile.name || file.name,
          url: uploadedFile.url,
          size: file.size,
          type: uploadedFile.type || file.type
        };
        
        const updatedFiles = [...localFiles, newFile];
        setLocalFiles(updatedFiles);
        onFilesChange?.(updatedFiles);

      } catch (error) {
        console.error('Upload failed:', error);
        setUploadingFiles(prev => prev.filter(item => item.id !== uploadId));
      }
    }
  }, [entityType, entityId, localFiles, uploadFiles, onFilesChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes,
    maxSize,
    maxFiles: maxFiles - localFiles.length,
    multiple: true
  });

  const handleDeleteFile = async (fileId, isLocal = false) => {
    if (isLocal) {
      // Remove local file
      const updatedFiles = localFiles.filter(file => file.id !== fileId);
      setLocalFiles(updatedFiles);
      onFilesChange?.(updatedFiles);
    } else {
      // Delete from server
      try {
        await deleteFile.mutateAsync(fileId);
        const updatedFiles = localFiles.filter(file => file.id !== fileId);
        setLocalFiles(updatedFiles);
        onFilesChange?.(updatedFiles);
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isImage = (file) => {
    return file.type?.startsWith('image/') || 
           file.name?.match(/\.(png|jpg|jpeg|gif|webp)$/i);
  };

  return (
    <div className={`admin-file-upload ${className}`}>
      {/* Upload Area */}
      <div 
        {...getRootProps()} 
        className={`upload-dropzone border-dashed border-2 p-4 text-center rounded ${
          isDragActive ? 'border-primary bg-light' : 'border-gray-300'
        } ${localFiles.length >= maxFiles ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
        style={{ minHeight: '120px' }}
      >
        <input {...getInputProps()} />
        
        <div className="d-flex flex-column align-items-center justify-content-center h-100">
          <Icon 
            name="upload" 
            style={{ fontSize: '2rem', color: isDragActive ? '#007bff' : '#6c757d' }} 
          />
          <p className="mt-2 mb-1">
            {isDragActive ? 'Drop the files here...' : uploadText}
          </p>
          <p className="text-muted small">
            Max {formatFileSize(maxSize)} each
            ({localFiles.length}/{maxFiles} uploaded)
          </p>
        </div>
      </div>

      {/* Upload Progress */}
      {uploadingFiles.length > 0 && (
        <div className="upload-progress mt-3">
          <h6>Uploading Files...</h6>
          {uploadingFiles.map(file => (
            <div key={file.id} className="mb-2">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="small">{file.name}</span>
                <span className="small text-muted">{file.progress}%</span>
              </div>
              <Progress value={file.progress} className="progress-sm" />
            </div>
          ))}
        </div>
      )}

      {/* Uploaded Files */}
      {localFiles.length > 0 && (
        <div className="uploaded-files mt-4">
          <h6>Uploaded Files ({localFiles.length})</h6>
          
          {showPreviews ? (
            <Row className="g-3">
              {localFiles.map(file => (
                <Col key={file.id} md="3" sm="4" xs="6">
                  <div className="file-card card border">
                    <div className="file-preview position-relative">
                      {isImage(file) ? (
                        <img
                          src={file.preview || file.url || '/placeholder-image.jpg'}
                          alt={file.name}
                          className="card-img-top"
                          style={{ height: '120px', objectFit: 'cover' }}
                          onLoad={() => {
                            // Clean up preview URL for local files
                            if (file.preview && file.isLocal) {
                              URL.revokeObjectURL(file.preview);
                            }
                          }}
                        />
                      ) : (
                        <div 
                          className="d-flex align-items-center justify-content-center bg-light"
                          style={{ height: '120px' }}
                        >
                          <Icon name="file" style={{ fontSize: '2rem', color: '#6c757d' }} />
                        </div>
                      )}
                      
                      <Button
                        size="sm"
                        color="danger"
                        className="position-absolute top-0 end-0 m-1 p-1"
                        style={{ width: '24px', height: '24px' }}
                        onClick={() => handleDeleteFile(file.id, file.isLocal)}
                        disabled={deleteFile.isLoading}
                      >
                        <Icon name="cross" style={{ fontSize: '12px' }} />
                      </Button>
                    </div>
                    <div className="card-body p-2">
                      <p className="card-text small mb-1 text-truncate" title={file.name}>
                        {file.name}
                      </p>
                      <p className="card-text text-muted small mb-0">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          ) : (
            <div className="file-list">
              {localFiles.map(file => (
                <div key={file.id} className="d-flex align-items-center justify-content-between p-2 border rounded mb-2">
                  <div className="d-flex align-items-center">
                    <Icon name="file" className="mr-2" />
                    <span>{file.name}</span>
                    <span className="text-muted ml-2">
                      ({formatFileSize(file.size)})
                    </span>
                  </div>
                  <Button 
                    size="sm" 
                    color="danger" 
                    outline
                    onClick={() => handleDeleteFile(file.id, file.isLocal)}
                    disabled={deleteFile.isLoading}
                  >
                    <Icon name="trash" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Upload Status */}
      {uploadFiles.isError && (
        <div className="alert alert-danger mt-3">
          <strong>Upload Failed:</strong> {uploadFiles.error?.response?.data?.detail || 'Unknown error occurred'}
        </div>
      )}
    </div>
  );
};

export default AdminFileUpload;
