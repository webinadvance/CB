<script>
  import { pageData } from '$lib/stores/pageStore'
  import { isEditable } from '$lib/stores/editorStore'

  export let key
  let items = []

  $: {
    console.log('ECList: Processing items', {
      contentData: $pageData.contentData,
    })

    const existingItems = Object.entries($pageData.contentData || {})
      .filter(([k, v]) => k.startsWith(`${key}.`) && v)
      .map(([k]) => Number(k.split('.')[1]))
      .sort((a, b) => a - b)

    console.log('ECList: Existing items', { existingItems })

    // Reindex to fill gaps
    items = existingItems.map((_, idx) => idx)

    // Update store with reindexed items if needed
    existingItems.forEach((oldIndex, newIndex) => {
      if (oldIndex !== newIndex) {
        const oldKey = `${key}.${oldIndex}`
        const newKey = `${key}.${newIndex}`
        const value = $pageData.contentData[oldKey]

        console.log('ECList: Reindexing', { oldKey, newKey, value })

        pageData.update((data) => ({
          ...data,
          contentData: {
            ...data.contentData,
            [newKey]: value,
            [oldKey]: undefined,
          },
        }))
      }
    })
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
