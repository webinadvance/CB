<script>
  import { pageData } from '$lib/stores/pageStore'
  import { isEditable } from '$lib/stores/editorStore'
  import { setContext } from 'svelte'
  import { invalidateAll } from '$app/navigation'
  import { dndzone } from 'svelte-dnd-action'

  export let key
  let items = []

  $: items = Object.values(
    Object.entries($pageData.contentData[key] || {}).reduce(
      (acc, [index, value]) => (
        (acc[Number(index)] = {
          id: `item-${index}`,
          index: Number(index),
          ...value,
        }),
        acc
      ),
      [],
    ),
  ).sort((a, b) => a.index - b.index)

  function handleDndConsider(e) {
    items = [...e.detail.items]
  }

  async function addNewItem() {
    items = [...items, { id: `item-${items.length}`, index: items.length }]
  }

  async function handleDndFinalize(e) {
    items = [...e.detail.items]
    await fetch('/api/content/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pageTitle: $pageData.pageTitle,
        key,
        startIndex: e.detail.items[0].index,
        endIndex: e.detail.items[1].index,
      }),
    })
    await invalidateAll()
  }

  setContext('parentEvent', () => {})
</script>

{#if !$isEditable}
  <div class={$$props.class}>
    {#each items as item}
      <slot {key} {...item} />
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
        dragSourceSelector: '[data-dnd-handle]',
      }}
      on:consider={handleDndConsider}
      on:finalize={handleDndFinalize}
      class="space-y-0"
    >
      {#each items as item (item.id)}
        <div class="hover:bg-gray-50 group drag-container">
          <div class="flex items-center gap-2">
            <div
              class="opacity-30 group-hover:opacity-100 p-1 cursor-move drag-handle"
              data-dnd-handle
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle cx="9" cy="7" r="1" />
                <circle cx="9" cy="12" r="1" />
                <circle cx="9" cy="17" r="1" />
                <circle cx="15" cy="7" r="1" />
                <circle cx="15" cy="12" r="1" />
                <circle cx="15" cy="17" r="1" />
              </svg>
            </div>
            <div class="flex-1">
              <slot canDelete={true} {key} index={item.index} />
            </div>
          </div>
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

<style>
  .drag-container {
    pointer-events: auto;
  }
  .drag-handle {
    pointer-events: auto;
  }
</style>
