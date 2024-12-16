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

  function handleEvent(event) {
    console.log('items', items)

    // Log the raw input event
    console.log('Event received:', event)

    // Log the key and the regular expression being used
    console.log('Key:', key)
    console.log(
      'Generated RegExp:',
      new RegExp(`^${key}\\[[^\\]]+\\]\\.(\\d+)$`),
    )

    // Attempt to match the event against the RegExp
    const match = event.match(new RegExp(`^${key}\\[[^\\]]+\\]\\.(\\d+)$`))
    console.log('Match result:', match)

    if (match) {
      // Parse the index to be removed from the match
      const indexToRemove = Number(match[1])
      console.log('Index to remove:', indexToRemove)

      // Log items before the filter operation
      console.log('Items before removal:', items)

      // Filter the items array to remove the one with the specified index
      items = items.filter((item) => item.index !== indexToRemove)

      // Log items after the filter operation
      console.log('Items after removal:', items)
    } else {
      // If no match, log that the event did not match
      console.log('No matching pattern found for the event')
    }
  }

  setContext('parentEvent', handleEvent)
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
      <slot baseKey={key} index={item.index} onEvent={(e) => handleEvent(e)} />
    {/each}
    <button
      class="opacity-80 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded flex-shrink-0"
      on:click={addNewItem}
    >
      Add New
    </button>
  </div>
{/if}
