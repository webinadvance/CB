<script>
  import { pageData } from '$lib/stores/pageStore'
  import { isEditable } from '$lib/stores/editorStore'
  import { setContext } from 'svelte'

  export let key
  let items = []

  $: {
    const groupedItems = Object.entries($pageData.contentData || {})
      .filter(([k]) => k.startsWith(`${key}`))
      .reduce((acc, [fullKey, value]) => {
        const groupedMatch = fullKey.match(
          new RegExp(`^${key}\\[([a-zA-Z0-9_]+)\\]\\.([0-9]+)$`),
        )
        const ungroupedMatch = fullKey.match(new RegExp(`^${key}\\.([0-9]+)$`))

        if (groupedMatch) {
          const [, prop, index] = groupedMatch
          const numericIndex = Number(index)
          if (!acc[numericIndex]) acc[numericIndex] = { index: numericIndex }
          acc[numericIndex][prop] = value
        } else if (ungroupedMatch) {
          const [, index] = ungroupedMatch
          const numericIndex = Number(index)
          acc[numericIndex] = { index: numericIndex, value }
        }
        return acc
      }, [])

    items = Object.values(groupedItems).sort((a, b) => a.index - b.index)
  }

  function addNewItem() {
    const newIndex = items.length
    items = [...items, { index: newIndex }]
  }

  async function handleDelete(event) {
    await fetch(`/api/content`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pageTitle: $pageData.pageTitle,
        fullKey: event, // Changed from key to event
        lang: $pageData.lang || undefined,
      }),
    })
    const match = event.match(new RegExp(`^${key}\\[[^\\]]+\\]\\.(\\d+)$`))
    if (match) items = items.filter((item) => item.index !== +match[1])
  }

  setContext('parentEvent', handleDelete)
</script>

{#if !$isEditable}
  <div class={$$props.class}>
    {#each items as item}
      <slot baseKey={key} {...item} />
    {/each}
  </div>
{:else}
  <div class="relative {$$props.class}">
    {#each items as item}
      <slot baseKey={key} index={item.index} onEvent={(e) => handleDelete(e)} />
    {/each}
    <button
      class="opacity-80 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded flex-shrink-0"
      on:click={addNewItem}
    >
      Add New
    </button>
  </div>
{/if}
