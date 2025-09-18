import { axiosPrivate } from './axios'

// =============================================================================
// ADMIN FILE UPLOAD SERVICE
// =============================================================================

/**
 * Upload files to the server with progress tracking
 * @param {File|FileList|Array} files - File(s) to upload
 * @param {Object} options - Upload options
 * @param {Function} onUploadProgress - Progress callback
 * @returns {Promise} Upload response
 */
export const uploadFiles = async (files, options = {}, onUploadProgress) => {
  const formData = new FormData()
  
  // Handle different file input types
  const fileArray = Array.isArray(files) ? files : 
                   files instanceof FileList ? Array.from(files) : [files]
  
  // Append files to FormData
  fileArray.forEach((file, index) => {
    if (options.multiple) {
      formData.append(`files[${index}]`, file)
    } else {
      formData.append('file', file)
    }
  })
  
  // Add metadata
  if (options.type) formData.append('type', options.type)
  if (options.entity_id) formData.append('entity_id', options.entity_id)
  if (options.entity_type) formData.append('entity_type', options.entity_type)
  
  const { data } = await axiosPrivate.post('/api/v1/admin/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      )
      onUploadProgress?.(percentCompleted)
    }
  })
  
  return data
}

/**
 * Upload tour images specifically
 * @param {number} tourId - Tour ID
 * @param {File|Array} files - Image files
 * @param {Function} onUploadProgress - Progress callback
 * @returns {Promise} Upload response
 */
export const uploadTourImages = async (tourId, files, onUploadProgress) => {
  return uploadFiles(files, {
    type: 'tour_image',
    entity_id: tourId,
    entity_type: 'tour',
    multiple: true
  }, onUploadProgress)
}

/**
 * Upload property images
 * @param {number} propertyId - Property ID
 * @param {File|Array} files - Image files
 * @param {Function} onUploadProgress - Progress callback
 * @returns {Promise} Upload response
 */
export const uploadPropertyImages = async (propertyId, files, onUploadProgress) => {
  return uploadFiles(files, {
    type: 'property_image',
    entity_id: propertyId,
    entity_type: 'property',
    multiple: true
  }, onUploadProgress)
}

/**
 * Upload BnB listing images
 * @param {number} listingId - Listing ID
 * @param {File|Array} files - Image files
 * @param {Function} onUploadProgress - Progress callback
 * @returns {Promise} Upload response
 */
export const uploadBnbImages = async (listingId, files, onUploadProgress) => {
  return uploadFiles(files, {
    type: 'bnb_image',
    entity_id: listingId,
    entity_type: 'bnb_listing',
    multiple: true
  }, onUploadProgress)
}

/**
 * Upload car images
 * @param {number} carId - Car ID
 * @param {File|Array} files - Image files
 * @param {Function} onUploadProgress - Progress callback
 * @returns {Promise} Upload response
 */
export const uploadCarImages = async (carId, files, onUploadProgress) => {
  return uploadFiles(files, {
    type: 'car_image',
    entity_id: carId,
    entity_type: 'car',
    multiple: true
  }, onUploadProgress)
}

/**
 * Upload single file (documents, etc.)
 * @param {File} file - File to upload
 * @param {Object} options - Upload options
 * @param {Function} onUploadProgress - Progress callback
 * @returns {Promise} Upload response
 */
export const uploadDocument = async (file, options = {}, onUploadProgress) => {
  return uploadFiles(file, {
    type: options.type || 'document',
    entity_id: options.entity_id,
    entity_type: options.entity_type,
    multiple: false
  }, onUploadProgress)
}

/**
 * Delete uploaded file
 * @param {number} fileId - File ID to delete
 * @returns {Promise} Delete response
 */
export const deleteFile = async (fileId) => {
  const { data } = await axiosPrivate.get(`/api/v1/admin/upload/${fileId}/delete`)
  return data
}

/**
 * Get file details
 * @param {number} fileId - File ID
 * @returns {Promise} File details
 */
export const getFile = async (fileId) => {
  const { data } = await axiosPrivate.get(`/api/v1/admin/upload/${fileId}`)
  return data
}

/**
 * List files for entity
 * @param {string} entityType - Entity type (tour, property, etc.)
 * @param {number} entityId - Entity ID
 * @param {Object} params - Query parameters
 * @returns {Promise} File list
 */
export const listFiles = async (entityType, entityId, params = {}) => {
  const { data } = await axiosPrivate.get('/api/v1/admin/upload', {
    params: {
      entity_type: entityType,
      entity_id: entityId,
      ...params
    }
  })
  return data
}

/**
 * Bulk delete files
 * @param {Array} fileIds - Array of file IDs to delete
 * @returns {Promise} Bulk delete response
 */
export const bulkDeleteFiles = async (fileIds) => {
  const { data } = await axiosPrivate.post('/api/v1/admin/upload/bulk-delete', {
    file_ids: fileIds
  })
  return data
}

// Export admin upload service pattern
export default {
  uploadFiles,
  uploadTourImages,
  uploadPropertyImages,
  uploadBnbImages,
  uploadCarImages,
  uploadDocument,
  deleteFile,
  getFile,
  listFiles,
  bulkDeleteFiles
}
