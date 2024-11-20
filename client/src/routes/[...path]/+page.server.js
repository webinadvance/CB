/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch, params }) {
  // Split path into base path and additional params
  const pathParts = params.path.split("/");
  const basePath = pathParts.slice(0, 2).join("/"); // "aaa/bbb"
  const additionalParams = pathParts.slice(2); // ["data1", "data2"]

  const response = await fetch(`http://localhost:3000/api/pages/${basePath}`);
  const page = response.ok ? await response.json() : null;

  return {
    page,
    routeParams: additionalParams,
  };
}
