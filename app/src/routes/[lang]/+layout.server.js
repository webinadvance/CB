export async function load({ locals, params }) {
  return {
    lang: locals.lang || params.lang || 'en',
    // session: await locals.auth(),
  }
}
