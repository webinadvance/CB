<script>
  import { pageData } from '$lib/stores/pageStore'
  import { isEditable } from '$lib/stores/editorStore'

  export let key

  // Get existing items dynamically based on the key
  $: items = Array.from(
    new Set(
      Object.keys($pageData.contentData || {})
        .filter((k) => k.startsWith(`${key}.`))
        .map((k) => Number(k.split('.')[1])),
    ),
  ).sort((a, b) => a - b)

  function addNewItem() {
    const newIndex = items.length
    pageData.update((data) => ({
      ...data,
      contentData: { ...data.contentData, [`${key}.${newIndex}`]: '' },
    }))
  }

  console.log('ECList key', key)
</script>

<div>
  {#each items as index}
    <slot itemKey={`${key}.${index}`} timestamp={Date.now()} />
  {/each}
  {#if $isEditable}
    <slot itemKey={`${key}.${items.length}`} />
  {/if}
</div>
