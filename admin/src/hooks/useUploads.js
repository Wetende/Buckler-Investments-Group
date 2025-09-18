import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import {
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
} from '../api/uploads'
import { toast } from 'react-toastify'

// =============================================================================
// UPLOAD HOOKS
// =============================================================================

/**
 * Generic file upload hook
 * @param {Object} options - Configuration options
 * @returns {Object} Mutation object
 */
export const useUploadFiles = (options = {}) => {
  const qc = useQueryClient()
  
  return useMutation({
    mutationFn: ({ files, uploadOptions, onUploadProgress }) => 
      uploadFiles(files, uploadOptions, onUploadProgress),
    onSuccess: (data, variables) => {
      // Invalidate related queries
      if (variables.uploadOptions?.entity_type && variables.uploadOptions?.entity_id) {
        qc.invalidateQueries({ 
          queryKey: ['admin', 'files', variables.uploadOptions.entity_type, variables.uploadOptions.entity_id] 
        })
      }
      
      const fileCount = Array.isArray(data) ? data.length : 1
      toast.success(`${fileCount} file(s) uploaded successfully!`)
      
      // Call custom success handler
      options.onSuccess?.(data, variables)
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to upload files')
      options.onError?.(error)
    }
  })
}

/**
 * Tour images upload hook
 * @returns {Object} Mutation object
 */
export const useUploadTourImages = () => {
  const qc = useQueryClient()
  
  return useMutation({
    mutationFn: ({ tourId, files, onUploadProgress }) => 
      uploadTourImages(tourId, files, onUploadProgress),
    onSuccess: (data, variables) => {
      // Invalidate tour-related queries
      qc.invalidateQueries({ queryKey: ['admin', 'tours', 'detail', variables.tourId] })
      qc.invalidateQueries({ queryKey: ['admin', 'tours', 'list'] })
      qc.invalidateQueries({ queryKey: ['admin', 'files', 'tour', variables.tourId] })
      
      const fileCount = Array.isArray(data) ? data.length : 1
      toast.success(`${fileCount} tour image(s) uploaded successfully!`)
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to upload tour images')
    }
  })
}

/**
 * Property images upload hook
 * @returns {Object} Mutation object
 */
export const useUploadPropertyImages = () => {
  const qc = useQueryClient()
  
  return useMutation({
    mutationFn: ({ propertyId, files, onUploadProgress }) => 
      uploadPropertyImages(propertyId, files, onUploadProgress),
    onSuccess: (data, variables) => {
      // Invalidate property-related queries
      qc.invalidateQueries({ queryKey: ['admin', 'properties', 'detail', variables.propertyId] })
      qc.invalidateQueries({ queryKey: ['admin', 'properties', 'list'] })
      qc.invalidateQueries({ queryKey: ['admin', 'files', 'property', variables.propertyId] })
      
      const fileCount = Array.isArray(data) ? data.length : 1
      toast.success(`${fileCount} property image(s) uploaded successfully!`)
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to upload property images')
    }
  })
}

/**
 * BnB images upload hook
 * @returns {Object} Mutation object
 */
export const useUploadBnbImages = () => {
  const qc = useQueryClient()
  
  return useMutation({
    mutationFn: ({ listingId, files, onUploadProgress }) => 
      uploadBnbImages(listingId, files, onUploadProgress),
    onSuccess: (data, variables) => {
      // Invalidate BnB-related queries
      qc.invalidateQueries({ queryKey: ['admin', 'bnb', 'detail', variables.listingId] })
      qc.invalidateQueries({ queryKey: ['admin', 'bnb', 'list'] })
      qc.invalidateQueries({ queryKey: ['admin', 'files', 'bnb_listing', variables.listingId] })
      
      const fileCount = Array.isArray(data) ? data.length : 1
      toast.success(`${fileCount} listing image(s) uploaded successfully!`)
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to upload listing images')
    }
  })
}

/**
 * Car images upload hook
 * @returns {Object} Mutation object
 */
export const useUploadCarImages = () => {
  const qc = useQueryClient()
  
  return useMutation({
    mutationFn: ({ carId, files, onUploadProgress }) => 
      uploadCarImages(carId, files, onUploadProgress),
    onSuccess: (data, variables) => {
      // Invalidate car-related queries
      qc.invalidateQueries({ queryKey: ['admin', 'cars', 'detail', variables.carId] })
      qc.invalidateQueries({ queryKey: ['admin', 'cars', 'list'] })
      qc.invalidateQueries({ queryKey: ['admin', 'files', 'car', variables.carId] })
      
      const fileCount = Array.isArray(data) ? data.length : 1
      toast.success(`${fileCount} car image(s) uploaded successfully!`)
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to upload car images')
    }
  })
}

/**
 * Document upload hook
 * @returns {Object} Mutation object
 */
export const useUploadDocument = () => {
  const qc = useQueryClient()
  
  return useMutation({
    mutationFn: ({ file, options, onUploadProgress }) => 
      uploadDocument(file, options, onUploadProgress),
    onSuccess: (data, variables) => {
      // Invalidate related queries if entity info provided
      if (variables.options?.entity_type && variables.options?.entity_id) {
        qc.invalidateQueries({ 
          queryKey: ['admin', 'files', variables.options.entity_type, variables.options.entity_id] 
        })
      }
      
      toast.success('Document uploaded successfully!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to upload document')
    }
  })
}

// =============================================================================
// FILE MANAGEMENT HOOKS
// =============================================================================

/**
 * Delete file hook
 * @returns {Object} Mutation object
 */
export const useDeleteFile = () => {
  const qc = useQueryClient()
  
  return useMutation({
    mutationFn: deleteFile,
    onSuccess: () => {
      // Invalidate all file-related queries
      qc.invalidateQueries({ queryKey: ['admin', 'files'] })
      toast.success('File deleted successfully!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to delete file')
    }
  })
}

/**
 * Bulk delete files hook
 * @returns {Object} Mutation object
 */
export const useBulkDeleteFiles = () => {
  const qc = useQueryClient()
  
  return useMutation({
    mutationFn: bulkDeleteFiles,
    onSuccess: (data, variables) => {
      // Invalidate all file-related queries
      qc.invalidateQueries({ queryKey: ['admin', 'files'] })
      
      const fileCount = variables.length
      toast.success(`${fileCount} file(s) deleted successfully!`)
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to delete files')
    }
  })
}

/**
 * Get file details hook
 * @param {number} fileId - File ID
 * @returns {Object} Query object
 */
export const useFile = (fileId) => {
  return useQuery({
    queryKey: ['admin', 'files', 'detail', fileId],
    queryFn: () => getFile(fileId),
    enabled: !!fileId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * List files for entity hook
 * @param {string} entityType - Entity type
 * @param {number} entityId - Entity ID
 * @param {Object} params - Query parameters
 * @returns {Object} Query object
 */
export const useEntityFiles = (entityType, entityId, params = {}) => {
  return useQuery({
    queryKey: ['admin', 'files', entityType, entityId, params],
    queryFn: () => listFiles(entityType, entityId, params),
    enabled: !!(entityType && entityId),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Export all upload hooks
export default {
  // Upload hooks
  useUploadFiles,
  useUploadTourImages,
  useUploadPropertyImages,
  useUploadBnbImages,
  useUploadCarImages,
  useUploadDocument,
  
  // File management hooks
  useDeleteFile,
  useBulkDeleteFiles,
  useFile,
  useEntityFiles
}
