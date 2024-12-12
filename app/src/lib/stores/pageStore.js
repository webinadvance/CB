﻿import { writable } from 'svelte/store'

export const pageData = writable(null)

export function setPageData(data = {}) {
  pageData.set(data)
}

export function getPageData() {
  let value
  pageData.subscribe((data) => (value = data))()
  return value
}