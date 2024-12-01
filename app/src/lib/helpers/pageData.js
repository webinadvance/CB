import { getContext, setContext } from "svelte";

const PAGE_DATA_KEY = Symbol();

export function setPageData(data) {
  return setContext(PAGE_DATA_KEY, data);
}

export function getPageContent(key) {
  const data = getContext(PAGE_DATA_KEY);
  return data?.contentData?.[key]?.content || "";
}
