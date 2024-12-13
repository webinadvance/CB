<script>
  import { getPageData } from '$lib/stores/pageStore'
  import { createEventDispatcher } from 'svelte'

  export let key
  export let pg
  export let tag = 'div'
  export let cssClass = ''
  export let placeholder = 'Content not found'
  export let p = null
  export let isList = false

  const dispatch = createEventDispatcher()
  const pageData = getPageData()
  let editableRef

  $: content = pg
    ? pageData.extraContent[pg]?.[key]
    : pageData.contentData?.[key]

  $: items = isList
    ? Array.from(
        new Set(
          Object.keys(pageData.contentData || {})
            .filter((k) => k.startsWith(`${key}.`))
            .map((k) => k.split('.')[1]),
        ),
      ).map((index) => ({
        title: pageData.contentData[`${key}.${index}.title`],
        desc: pageData.contentData[`${key}.${index}.desc`],
      }))
    : null

  async function save() {
    if (!isList) {
      const newText = editableRef.textContent.trim()
      if (newText === content) return

      await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageTitle: pg || pageData.pageTitle,
          key,
          value: newText,
        }),
      })
      content = newText
    }
  }

  async function saveList() {
    const updates = items.flatMap((item, index) => [
      {
        pageTitle: pg || pageData.pageTitle,
        key: `${key}.${index}.title`,
        value: item.title,
      },
      {
        pageTitle: pg || pageData.pageTitle,
        key: `${key}.${index}.desc`,
        value: item.desc,
      },
    ])

    await Promise.all(
      updates.map((update) =>
        fetch('/api/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(update),
        }),
      ),
    )
  }

  function addItem() {
    items = [...items, { title: '', desc: '' }]
    saveList()
  }

  function removeItem(index) {
    items = items.filter((_, i) => i !== index)
    saveList()
  }
</script>

{#if isList}
  <div class={cssClass}>
    {#each items as item, index}
      <div class="item">
        <slot name="item" {item} {index} />
        <button on:click={() => removeItem(index)}>Remove</button>
      </div>
    {/each}
    <button on:click={addItem}>Add Item</button>
  </div>
{:else}
  <svelte:element
    this={tag}
    bind:this={editableRef}
    contenteditable={import.meta.env.DEV}
    on:blur={save}
    class={`${cssClass} ${import.meta.env.DEV ? 'outline-dashed outline-1 outline-red-500 hover:outline-red-500' : ''}`}
  >
    {content || placeholder}
  </svelte:element>
{/if}

<style>
  .item {
    @apply border border-gray-200 p-4 mb-4;
  }
  button {
    @apply mt-2;
  }
</style>
