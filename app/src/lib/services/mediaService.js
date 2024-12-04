import { Media } from '$lib/database/models/media.js'
import crypto from 'crypto'

export const getAllMedia = async (publicOnly = true) => {
  const where = publicOnly ? { isPublic: true } : {}
  return await Media.findAll({ where, raw: true })
}

export const getMediaById = async (id) => {
  return await Media.findByPk(id, { raw: true })
}

export const createMedia = async (mediaData) => {
  // Generate hash for the file content if not provided
  if (!mediaData.hash && mediaData.content) {
    const hash = crypto.createHash('sha256')
    hash.update(mediaData.content)
    mediaData.hash = hash.digest('hex')
  }

  return await Media.create(mediaData)
}

export const updateMedia = async (id, mediaData) => {
  const media = await Media.findByPk(id)
  if (!media) return null
  
  await media.update(mediaData)
  return media
}

export const deleteMedia = async (id) => {
  const media = await Media.findByPk(id)
  if (!media) return false
  
  await media.destroy()
  return true
}

export const getMediaByHash = async (hash) => {
  return await Media.findOne({ where: { hash }, raw: true })
}
