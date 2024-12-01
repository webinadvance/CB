import { config } from 'dotenv'
config()

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch, params }) {
  const { VITE_API_BASE_URL } = process.env
  const pathParts = params.path.split('/')

  for (let i = pathParts.length; i > 0; i--) {
    const testPath = pathParts.slice(0, i).join('/')
    const response = await fetch(`${VITE_API_BASE_URL}/api/pages/${testPath}`)
    if (response.ok) {
      const page = await response.json()
      const routeParams = Object.fromEntries(
        (page.paramSchema || []).map((name, index) => [
          name,
          pathParts.slice(i)[index],
        ]),
      )
      return { page, routeParams }
    }
  }

  return { page: null }
}
