/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch, params }) {
  const pathParts = params.path.split("/");

  // Try progressively shorter paths until we find a match
  for (let i = pathParts.length; i > 0; i--) {
    const testPath = pathParts.slice(0, i).join("/");
    const response = await fetch(`http://localhost:3000/api/pages/${testPath}`);

    if (response.ok) {
      const page = await response.json();
      return {
        page,
        routeParams: pathParts.slice(i),
      };
    }
  }

  return { page: null };
}
