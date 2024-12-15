<script>
  import { pageData } from '$lib/stores/pageStore'
  import { isEditable } from '$lib/stores/editorStore'

  export let key
  let items = []

  // Recalculate items based on $pageData updates
  $: {
    const existingItems = Object.entries($pageData.contentData || {})
      .filter(([k, v]) => k.startsWith(`${key}.`) && v)
      .map(([k]) => Number(k.split('.')[1]))
      .sort((a, b) => a - b)

    // Reindex to fill gaps
    items = existingItems.map((_, idx) => idx)

    // Update store with reindexed items if needed
    existingItems.forEach((oldIndex, newIndex) => {
      if (oldIndex !== newIndex) {
        const oldKey = `${key}.${oldIndex}`
        const newKey = `${key}.${newIndex}`
        const value = $pageData.contentData[oldKey]

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

  function addNewItem() {
    // Add a new item at the next available index
    items = [...items, items.length]
  }
</script>

<div>
  {#each items as index}
    <slot itemKey={`${key}.${index}`} timestamp={Date.now()} />
  {/each}
  <!--{#if $isEditable && items.every((i) => $pageData.contentData[`${key}.${i}`])}-->
  <!--  <slot itemKey={`${key}.${items.length}`} />-->
  <!--{/if}-->

  {#if $isEditable}
    <!-- Add Item Button -->
    <button
      class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
      on:click={addNewItem}
    >
      Add Item
    </button>
  {/if}
</div>
