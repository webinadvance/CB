export const getMediaUrl = (id, width = null) => {
  const baseUrl = '/api/media/serve'
  return width ? `${baseUrl}/${id}/${width}` : `${baseUrl}/${id}`
}

export const getMediaPreviewUrl = (id, width = null) => {
  return getMediaUrl(id, width)
}
