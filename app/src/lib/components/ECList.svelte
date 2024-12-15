<script>
  import { pageData } from '$lib/stores/pageStore'
  import { isEditable } from '$lib/stores/editorStore'

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

    console.log('groupedItems', groupedItems)

    items = Object.values(groupedItems).sort((a, b) => a.index - b.index)
  }

  console.log('items', items)

  function addNewItem() {
    const newIndex = items.length
    items = [...items, { index: newIndex }]
  }
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
      <slot baseKey={key} index={item.index} />
    {/each}
    <button
      class="opacity-80 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded flex-shrink-0"
      on:click={addNewItem}
    >
      Add New
    </button>
  </div>
{/if}
