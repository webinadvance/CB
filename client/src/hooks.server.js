﻿/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  return resolve(event);
}
