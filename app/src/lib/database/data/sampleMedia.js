import fetch from 'node-fetch'

export const loadMediaFromUrl = async (url) => {
  const response = await fetch(url)
  const content = await response.buffer()
  return {
    filename: 'test.png',
    mimeType: 'image/png',
    size: content.length,
    content,
    uploadedBy: 'system',
  }
}
//MM
const sampleMedia = [
  await loadMediaFromUrl(
    'https://upload.wikimedia.org/wikipedia/commons/6/6a/PNG_Test.png',
  ),
]
export default sampleMedia
