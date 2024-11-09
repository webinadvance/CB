/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  const response = await fetch(
    "http://localhost:3000/api/pages?publishedOnly=true",
  );
  const pages = await response.json();

  // Find matching redirect
  const redirect = pages.find(
    (page) => page.redirectUrl && event.url.pathname === "/" + page.slug,
  );

  if (redirect) {
    return Response.redirect(new URL(redirect.redirectUrl, event.url.origin));
  }

  return resolve(event);
}
