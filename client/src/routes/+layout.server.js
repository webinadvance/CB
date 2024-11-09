export async function load({ fetch }) {
  const response = await fetch("/api/pages?publishedOnly=true");
  const pages = await response.json();

  const routingMap = new Map();

  pages.forEach((page) => {
    if (page.isRedirect && page.redirectUrl) {
      routingMap.set(page.slug, page.redirectUrl);
    }
  });

  return {
    navigation: pages,
    routingMap,
  };
}

export const ssr = true;
export const prerender = false;
