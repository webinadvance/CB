import { getContext, setContext } from 'svelte'

const PARAMS_KEY = Symbol()

export function setParams(params = {}) {
  setContext(PARAMS_KEY, params)
}

export function getParams() {
  const p = getContext(PARAMS_KEY)
  console.log('getParams called:', p)
  return p
}
