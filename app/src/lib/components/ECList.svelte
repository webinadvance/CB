<script>
  import { pageData } from '$lib/stores/pageStore'
  import { isEditable } from '$lib/stores/editorStore'

  export let key
  let items = []

  $: {
    const existingItems = Object.entries($pageData.contentData || {})
      .filter(([k, v]) => k.startsWith(`${key}.`) && v)
      .map(([k]) => Number(k.split('.')[1]))
      .sort((a, b) => a - b)

    items = existingItems.map((_, idx) => idx)

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
    items = [...items, items.length]
  }
</script>

{#if !$isEditable}
  <div class={$$props.class}>
    {#each items as index}
      <slot itemKey={`${key}.${index}`} timestamp={Date.now()} />
    {/each}
  </div>
{/if}
{#if $isEditable}
  <div class="relative {$$props.class}">
    {#each items as item, index}
      <slot itemKey={`${key}.${index}`} timestamp={Date.now()} />
      {#if index === items.length - 1}{/if}
    {/each}
    <button
      class="opacity-80 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded flex-shrink-0"
      on:click={addNewItem}
    >
      Add New
    </button>
  </div>
{/if}
