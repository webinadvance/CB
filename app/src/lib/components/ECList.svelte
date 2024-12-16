<script>
  import { pageData } from '$lib/stores/pageStore'
  import { isEditable } from '$lib/stores/editorStore'
  import { Trash2 } from 'lucide-svelte'
  import { langStore } from '$lib/stores/langStore'

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

    // console.log('items', items)
    // console.log('$pageData.contentData', $pageData.contentData)
  }

  function addNewItem() {
    const newIndex = items.length
    items = [...items, { index: newIndex }]
  }

  async function deleteItem(index) {
    // Call API
    await fetch('/api/content', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pageTitle: $pageData.pageTitle,
        key,
        index,
      }),
    })

    // Update store
    const entries = Object.entries($pageData.contentData).filter(
      ([k]) => k.startsWith(`${key}[`) && k.endsWith(`].${index}`),
    )

    const newContentData = { ...$pageData.contentData }
    entries.forEach(([k]) => delete newContentData[k])

    // Reindex
    Object.entries(newContentData)
      .filter(([k]) => k.startsWith(`${key}[`))
      .forEach(([oldKey, value]) => {
        const idx = Number(oldKey.match(/\.(\d+)$/)[1])
        if (idx > index) {
          const newKey = oldKey.replace(/\.\d+$/, `.${idx - 1}`)
          delete newContentData[oldKey]
          newContentData[newKey] = value
        }
      })

    $pageData.contentData = newContentData
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
      <button class="" on:click={() => deleteItem(item.index)}>
        <Trash2 class="w-5 h-5 text-red-500" />
      </button>
    {/each}
    <button
      class="opacity-80 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded flex-shrink-0"
      on:click={addNewItem}
    >
      Add New
    </button>
  </div>
{/if}
