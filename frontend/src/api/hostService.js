import { axiosPrivate } from './axios'

// Host application API endpoints
export const getMyHostApplication = async () => {
    const { data } = await axiosPrivate.get('/api/v1/bnb/host/my-application')
    return data
}

export const createHostApplication = async (applicationData) => {
    const { data } = await axiosPrivate.post('/api/v1/bnb/host/', {
        id: 0, // Create new application
        ...applicationData
    })
    return data
}

export const updateHostApplication = async (applicationId, applicationData) => {
    const { data } = await axiosPrivate.post('/api/v1/bnb/host/', {
        id: applicationId, // Update existing application
        ...applicationData
    })
    return data
}

export const getHostApplication = async (applicationId) => {
    const { data } = await axiosPrivate.get(`/api/v1/bnb/host/${applicationId}`)
    return data
}

export const submitHostApplication = async (applicationId) => {
    const { data } = await axiosPrivate.get(`/api/v1/bnb/host/${applicationId}/submit`)
    return data
}

export const saveApplicationStep = async (stepData) => {
    const { data } = await axiosPrivate.post('/api/v1/bnb/host/step', stepData)
    return data
}

export const getPersonalInfoPrefill = async () => {
    const { data } = await axiosPrivate.get('/api/v1/bnb/host/steps/personal-info')
    return data
}

// Export default service object
export default {
    getMyHostApplication,
    createHostApplication,
    updateHostApplication,
    getHostApplication,
    submitHostApplication,
    saveApplicationStep,
    getPersonalInfoPrefill,
}
