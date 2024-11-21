import adapter from '@sveltejs/adapter-node' // Change this line

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
  },
}

export default config
