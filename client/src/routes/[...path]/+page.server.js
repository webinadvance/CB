/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch, params }) {
  const pathParts = params.path.split("/");

  for (let i = pathParts.length; i > 0; i--) {
    const testPath = pathParts.slice(0, i).join("/");
    const response = await fetch(`http://localhost:3000/api/pages/${testPath}`);

    if (response.ok) {
      const page = await response.json();
      const paramValues = pathParts.slice(i);

      const routeParams = {};
      (page.paramSchema || []).forEach((name, index) => {
        routeParams[name] = paramValues[index];
      });

      return { page, routeParams };
    }
  }
  return { page: null };
}
