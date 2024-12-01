import { getContext, setContext } from "svelte";

const CONTENT_KEY = Symbol();

export function setContent(page) {
  const getContent = (key) => page?.contentData?.[key]?.content || "";
  setContext(CONTENT_KEY, getContent);
  return getContent;
}

export function getContent() {
  return getContext(CONTENT_KEY);
}
