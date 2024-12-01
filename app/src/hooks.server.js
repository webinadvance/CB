/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  // If the request starts with /api, bypass SvelteKit
  if (event.url.pathname.startsWith('/api')) {
    return new Response('Not handled by SvelteKit', { status: 404 })
  }

  // Otherwise, let SvelteKit handle the request
  return resolve(event)
}
