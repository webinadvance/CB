/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
  const response = await fetch("http://localhost:3000/api/pages/about");
  const page = response.ok ? await response.json() : null;
  return { page };
}
