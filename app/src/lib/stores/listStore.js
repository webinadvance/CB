import { writable } from 'svelte/store'

export const listStore = writable({
  deleteItem: { key: '', listKey: '' },
})
