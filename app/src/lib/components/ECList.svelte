<script>
  import { pageData } from '$lib/stores/pageStore'
  import { isEditable } from '$lib/stores/editorStore'
  import { listStore } from '$lib/stores/listStore'
  import { listRefreshStore } from '$lib/stores/listRefreshStore'
  import { onMount } from 'svelte'

  let mounted = false

  let refreshTrigger = 0
  export let key
  let items = []

  onMount(() => {
    mounted = true
    refreshItemsFromServer()
  })

  async function refreshItemsFromServer() {
    if (!mounted) return

    console.log('Refreshing items for key:', key)
    const res = await fetch(
      `/api/content?key=${key}&pageTitle=${$pageData.pageTitle}`,
    )
    const data = await res.json()
    console.log('Server response:', data)
    items = data.items.map((item) => Number(item.key.split('.')[1]))
    console.log('Updated items:', items)
  }

  $: if ($listStore.deleteItem.listKey === key && mounted) {
    refreshItemsFromServer()
    listStore.set({ deleteItem: { key: '', listKey: '' } })
  }

  $: if (mounted) {
    refreshItemsFromServer()
  }

  function addNewItem() {
    const newIndex = items.length
    pageData.update((data) => ({
      ...data,
      contentData: { ...data.contentData, [`${key}.${newIndex}`]: '' },
    }))
  }

  let timestamp = $listRefreshStore[key] || 0
</script>

<div>
  {#key timestamp}
    {#each items as index}
      <slot itemKey={`${key}.${index}`} timestamp={Date.now()} />
    {/each}
    {#if $isEditable && items.every((i) => $pageData.contentData[`${key}.${i}`])}
      <slot itemKey={`${key}.${items.length}`} />
    {/if}
  {/key}
</div>
