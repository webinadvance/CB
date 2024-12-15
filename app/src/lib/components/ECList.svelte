<script>
  import { pageData } from '$lib/stores/pageStore'
  import { isEditable } from '$lib/stores/editorStore'
  import { listStore } from '$lib/stores/listStore'

  export let key
  let items = []

  $: items = Array.from(
    new Set(
      Object.keys($pageData.contentData || {})
        .filter((k) => k.startsWith(`${key}.`))
        .map((k) => Number(k.split('.')[1])),
    ),
  ).sort((a, b) => a - b)

  $: if ($listStore.deleteItem?.listKey === key) {
    const [_, indexToRemove] = $listStore.deleteItem.key.split('.')
    items = items
      .filter((i) => i !== Number(indexToRemove))
      .map((_, index) => index)
    listStore.set({ deleteItem: { key: '', listKey: '' } })
  }
</script>

<div>
  {#each items as index}
    <slot itemKey={`${key}.${index}`} timestamp={Date.now()} />
  {/each}
  {#if $isEditable && items.every((i) => $pageData.contentData[`${key}.${i}`])}
    <slot itemKey={`${key}.${items.length}`} />
  {/if}
</div>
