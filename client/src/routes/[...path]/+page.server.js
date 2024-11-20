/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch, params }) {
  const response = await fetch(
    `http://localhost:3000/api/pages/${params.path}`,
  );
  const page = response.ok ? await response.json() : null;
  return { page };
}
