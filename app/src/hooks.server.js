import { i18n } from '$lib/i18n'

export async function handle({ event, resolve }) {
  const lang = event.request.headers.get('cookie')?.match(/language=(\w+)/)?.[1] || 'en'
  i18n.language = lang
  
  const response = await resolve(event)
  
  if (!event.request.headers.get('cookie')?.includes('language=')) {
    response.headers.append('Set-Cookie', `language=${lang}; Path=/; HttpOnly`)
  }
  
  return response
}
