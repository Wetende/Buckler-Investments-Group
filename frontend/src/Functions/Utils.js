export const formatKes = (value) => {
  const amount = Number(value || 0)
  return `KES ${amount.toLocaleString('en-KE')}`
}

export default {
  formatKes,
}
