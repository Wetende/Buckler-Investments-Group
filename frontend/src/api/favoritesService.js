import { axiosPrivate } from './axios'

export const listFavorites = async () => {
  const { data } = await axiosPrivate.get('/api/v1/shared/favorites')
  return data
}

export const addFavorite = async (itemId, itemType) => {
  const { data } = await axiosPrivate.post('/api/v1/shared/favorites', {
    item_id: itemId,
    item_type: itemType
  })
  return data
}

export const removeFavorite = async (itemId, itemType) => {
  const { data } = await axiosPrivate.get(`/api/v1/shared/favorites/${itemId}/${itemType}/delete`)
  return data
}

export default {
  listFavorites,
  addFavorite,
  removeFavorite,
}
