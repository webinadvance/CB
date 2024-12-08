export function load({ locals, params }) {
  return {
    lang: locals.lang || params.lang || 'en',
  }
}
