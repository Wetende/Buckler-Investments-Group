import { axiosPrivate } from './axios'

// Properties
export const listProperties = async (params = {}) => {
  const { data } = await axiosPrivate.get('/admin/properties', { params })
  return data
}

export const getProperty = async (id) => {
  const { data } = await axiosPrivate.get(`/admin/properties/${Number(id)}`)
  return data
}

export const saveProperty = async (payload) => {
  const { data } = await axiosPrivate.post('/admin/properties', payload)
  return data
}

export const deleteProperty = async (id) => {
  const { data } = await axiosPrivate.get(`/admin/properties/${Number(id)}/delete`)
  return data
}

// Inquiries & Analytics
export const listInquiries = async (params = {}) => {
  const { data } = await axiosPrivate.get('/admin/properties/inquiries', { params })
  return data
}

export const getAnalytics = async (params = {}) => {
  const { data } = await axiosPrivate.get('/admin/properties/analytics', { params })
  return data
}

export default {
  listProperties,
  getProperty,
  saveProperty,
  deleteProperty,
  listInquiries,
  getAnalytics,
}




