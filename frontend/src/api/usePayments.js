import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
    initializePayment,
    verifyPayment,
    getPaymentMethods,
    processCardPayment,
    processMobilePayment,
    getPaymentHistory,
    refundPayment,
    createRentalPayment,
    completeRentalPayment,
} from './paymentService'

// Payment query hooks
export const usePaymentMethods = () => {
    return useQuery({
        queryKey: ['payments', 'methods'],
        queryFn: getPaymentMethods,
        staleTime: 30 * 60 * 1000, // 30 minutes - payment methods don't change often
        gcTime: 60 * 60 * 1000, // 1 hour
    })
}

export const usePaymentHistory = (filters = {}) => {
    return useQuery({
        queryKey: ['payments', 'history', filters],
        queryFn: () => getPaymentHistory(filters),
        staleTime: 2 * 60 * 1000, // 2 minutes
        gcTime: 5 * 60 * 1000, // 5 minutes
    })
}

export const usePaymentVerification = (paymentId) => {
    return useQuery({
        queryKey: ['payments', 'verify', paymentId],
        queryFn: () => verifyPayment(paymentId),
        enabled: !!paymentId,
        staleTime: 1 * 60 * 1000, // 1 minute
        gcTime: 2 * 60 * 1000, // 2 minutes
        refetchInterval: 5000, // Check every 5 seconds when active
        refetchIntervalInBackground: false,
    })
}

// Payment mutation hooks
export const useInitializePayment = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: initializePayment,
        onSuccess: () => {
            // Invalidate payment history to include new payment
            queryClient.invalidateQueries({ queryKey: ['payments', 'history'] })
        },
        onError: (error) => {
            console.error('Payment initialization failed:', error)
        }
    })
}

export const useProcessCardPayment = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: processCardPayment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payments', 'history'] })
        },
        onError: (error) => {
            console.error('Card payment failed:', error)
        }
    })
}

export const useProcessMobilePayment = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: processMobilePayment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payments', 'history'] })
        },
        onError: (error) => {
            console.error('Mobile payment failed:', error)
        }
    })
}

export const useRefundPayment = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ paymentId, reason }) => refundPayment(paymentId, reason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payments', 'history'] })
        },
        onError: (error) => {
            console.error('Payment refund failed:', error)
        }
    })
}

// Car rental specific payment hooks
export const useCreateRentalPayment = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: createRentalPayment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payments', 'history'] })
            queryClient.invalidateQueries({ queryKey: ['rentals'] })
        },
        onError: (error) => {
            console.error('Rental payment creation failed:', error)
        }
    })
}

export const useCompleteRentalPayment = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ paymentId, paymentDetails }) => completeRentalPayment(paymentId, paymentDetails),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payments', 'history'] })
            queryClient.invalidateQueries({ queryKey: ['rentals'] })
        },
        onError: (error) => {
            console.error('Rental payment completion failed:', error)
        }
    })
}

const paymentHooks = {
    usePaymentMethods,
    usePaymentHistory,
    usePaymentVerification,
    useInitializePayment,
    useProcessCardPayment,
    useProcessMobilePayment,
    useRefundPayment,
    useCreateRentalPayment,
    useCompleteRentalPayment,
}

export default paymentHooks
