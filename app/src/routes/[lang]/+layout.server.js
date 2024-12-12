export function load({ locals, params, url }) {
  return {
    lang: locals.lang || params.lang || 'en',
  }
}
