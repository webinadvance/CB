<script>
  import { pageData } from '$lib/stores/pageStore'
  import { isEditable } from '$lib/stores/editorStore'
  import { setContext } from 'svelte'
  import { invalidateAll } from '$app/navigation'
  import { dndzone } from 'svelte-dnd-action'

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
          if (!acc[numericIndex]) {
            acc[numericIndex] = {
              id: `item-${numericIndex}`,
              index: numericIndex,
              props: {},
            }
          }
          acc[numericIndex].props[prop] = value
        }
        return acc
      }, [])

    items = Object.values(groupedItems).sort((a, b) => a.index - b.index)
  }

  function handleDndConsider(e) {
    items = [...e.detail.items]
  }

  async function handleDndFinalize(e) {
    items = [...e.detail.items]
    try {
      await fetch('/api/content/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageTitle: $pageData.pageTitle,
          key,
          updates: items.map((item, newIndex) => ({
            oldIndex: item.index,
            newIndex,
          })),
        }),
      })
    } catch (error) {
      console.error('Reorder error:', error)
    }
    await invalidateAll()
  }

  async function addNewItem() {
    const newIndex = items.length
    items = [...items, { id: `item-${newIndex}`, index: newIndex }]
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
    await invalidateAll()
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
    <div
      use:dndzone={{
        items,
        flipDurationMs: 200,
        dropTargetStyle: { outline: '2px dashed #4a5568' },
        dragDisabled: false,
      }}
      on:consider={handleDndConsider}
      on:finalize={handleDndFinalize}
      class="space-y-0"
    >
      {#each items as item (item.id)}
        <div class="cursor-move">
          <slot
            baseKey={key}
            index={item.index}
            onEvent={(e) => handleDelete(e)}
          />
        </div>
      {/each}
    </div>
    <button
      class="mt-4 opacity-80 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded flex-shrink-0"
      on:click={addNewItem}
    >
      Add New
    </button>
  </div>
{/if}
