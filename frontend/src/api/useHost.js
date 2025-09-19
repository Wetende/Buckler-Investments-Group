import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import hostService from './hostService'

// Get current user's host application
export const useMyHostApplication = () => {
    return useQuery({
        queryKey: ['host', 'my-application'],
        queryFn: hostService.getMyHostApplication,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: (failureCount, error) => {
            // Don't retry on 404 (no application exists)
            if (error?.response?.status === 404) {
                return false
            }
            return failureCount < 2
        },
    })
}

// Get specific host application
export const useHostApplication = (applicationId) => {
    return useQuery({
        queryKey: ['host', 'application', applicationId],
        queryFn: () => hostService.getHostApplication(applicationId),
        enabled: !!applicationId,
        staleTime: 5 * 60 * 1000,
    })
}

// Get personal info prefill data
export const usePersonalInfoPrefill = () => {
    return useQuery({
        queryKey: ['host', 'personal-info-prefill'],
        queryFn: hostService.getPersonalInfoPrefill,
        staleTime: 10 * 60 * 1000, // 10 minutes (user data doesn't change often)
    })
}

// Create host application
export const useCreateHostApplication = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: hostService.createHostApplication,
        onSuccess: (data) => {
            // Update cache with new application
            queryClient.setQueryData(['host', 'my-application'], data)
            queryClient.setQueryData(['host', 'application', data.id], data)
        },
    })
}

// Update host application
export const useUpdateHostApplication = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ applicationId, applicationData }) => 
            hostService.updateHostApplication(applicationId, applicationData),
        onSuccess: (data) => {
            // Update cache
            queryClient.setQueryData(['host', 'my-application'], data)
            queryClient.setQueryData(['host', 'application', data.id], data)
        },
    })
}

// Submit host application
export const useSubmitHostApplication = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: hostService.submitHostApplication,
        onSuccess: (data) => {
            // Update cache
            queryClient.setQueryData(['host', 'my-application'], data)
            queryClient.setQueryData(['host', 'application', data.id], data)
        },
    })
}

// Save application step (for auto-save)
export const useSaveApplicationStep = () => {
    return useMutation({
        mutationFn: hostService.saveApplicationStep,
        onSuccess: () => {
            // Silent success for auto-save
        },
        onError: (error) => {
            console.warn('Failed to auto-save step:', error)
            // Don't show error toast for auto-save failures
        },
    })
}

// Combined hook for form management
export const useHostApplicationForm = () => {
    const { data: existingApplication, isLoading: isLoadingApplication } = useMyHostApplication()
    const createApplication = useCreateHostApplication()
    const updateApplication = useUpdateHostApplication()

    const saveApplication = async (applicationData) => {
        if (existingApplication?.id) {
            // Update existing application
            return updateApplication.mutateAsync({
                applicationId: existingApplication.id,
                applicationData
            })
        } else {
            // Create new application
            return createApplication.mutateAsync(applicationData)
        }
    }

    return {
        existingApplication,
        isLoadingApplication,
        saveApplication,
        isSubmitting: createApplication.isLoading || updateApplication.isLoading,
        error: createApplication.error || updateApplication.error,
    }
}

// Export all hooks
export default {
    useMyHostApplication,
    useHostApplication,
    usePersonalInfoPrefill,
    useCreateHostApplication,
    useUpdateHostApplication,
    useSubmitHostApplication,
    useSaveApplicationStep,
    useHostApplicationForm,
}
