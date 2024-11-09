/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
  const response = await fetch('/api/pages/about');
  const page = response.ok ? await response.json() : null;
  return { page };
}
