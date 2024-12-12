// src/routes/[lang]/+layout.server.js
export function load({ locals, params, url }) {
  console.log('Layout URL:', url.pathname)
  console.log('Layout params:', params)

  return {
    lang: locals.lang || params.lang || 'en',
  }
}
//
