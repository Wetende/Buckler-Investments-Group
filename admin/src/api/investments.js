import { axiosPrivate } from './axios'

// Products
export const listProducts = async (params = {}) => {
  const { data } = await axiosPrivate.get('/admin/investments/products', { params })
  return data
}

export const getProduct = async (id) => {
  const { data } = await axiosPrivate.get(`/admin/investments/products/${Number(id)}`)
  return data
}

export const saveProduct = async (payload) => {
  const { data } = await axiosPrivate.post('/admin/investments/products', payload)
  return data
}

export const deleteProduct = async (id) => {
  const { data } = await axiosPrivate.get(`/admin/investments/products/${Number(id)}/delete`)
  return data
}

// Orders
export const listOrders = async (params = {}) => {
  const { data } = await axiosPrivate.get('/admin/investments/orders', { params })
  return data
}

export const getOrder = async (id) => {
  const { data } = await axiosPrivate.get(`/admin/investments/orders/${Number(id)}`)
  return data
}

export const saveOrder = async (payload) => {
  const { data } = await axiosPrivate.post('/admin/investments/orders', payload)
  return data
}

export const cancelOrder = async (id) => {
  const { data } = await axiosPrivate.get(`/admin/investments/orders/${Number(id)}/delete`)
  return data
}

// Analytics
export const getAnalytics = async (params = {}) => {
  const { data } = await axiosPrivate.get('/admin/investments/analytics', { params })
  return data
}

export default {
  listProducts,
  getProduct,
  saveProduct,
  deleteProduct,
  listOrders,
  getOrder,
  saveOrder,
  cancelOrder,
  getAnalytics,
}




