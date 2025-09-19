import { axiosPrivate } from './axios'

// Vehicles
export const listVehicles = async (params = {}) => {
  const { data } = await axiosPrivate.get('/cars', { params })
  return data
}

export const getVehicle = async (id) => {
  const { data } = await axiosPrivate.get(`/cars/${Number(id)}`)
  return data
}

export const createVehicle = async (payload) => {
  // Ensure id=0 for creation
  const { data } = await axiosPrivate.post('/cars', { id: 0, ...payload })
  return data
}

export const updateVehicle = async (id, payload) => {
  // Include actual id for update
  const { data } = await axiosPrivate.post('/cars', { id: Number(id), ...payload })
  return data
}

export const saveVehicle = async (payload) => {
  // Support both create and update based on id
  if (payload.id && payload.id > 0) {
    return updateVehicle(payload.id, payload)
  } else {
    return createVehicle(payload)
  }
}

export const deleteVehicle = async (id) => {
  const { data } = await axiosPrivate.get(`/cars/${Number(id)}/delete`)
  return data
}

export const searchVehicles = async (criteria) => {
  const { data } = await axiosPrivate.post('/cars/search', criteria)
  return data
}

export const checkAvailability = async (availabilityRequest) => {
  const { data } = await axiosPrivate.post('/cars/availability', availabilityRequest)
  return data
}

// Rentals
export const listRentals = async (params = {}) => {
  const { data } = await axiosPrivate.get('/cars/rentals', { params })
  return data
}

export const getRental = async (id) => {
  const { data } = await axiosPrivate.get(`/cars/rentals/${Number(id)}`)
  return data
}

export const createRental = async (payload) => {
  const { data } = await axiosPrivate.post('/cars/rentals', payload)
  return data
}

export const saveRental = async (payload) => {
  return createRental(payload)
}

// Analytics/Earnings (placeholder for future implementation)
export const getEarnings = async (params = {}) => {
  // This will need to be implemented when analytics endpoints are created
  const { data } = await axiosPrivate.get('/cars/analytics/earnings', { params })
  return data
}

export default {
  listVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  saveVehicle,
  deleteVehicle,
  searchVehicles,
  checkAvailability,
  listRentals,
  getRental,
  createRental,
  saveRental,
  getEarnings,
}




