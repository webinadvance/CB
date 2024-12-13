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

  $: rawContent = pg
    ? pageData.extraContent[pg]?.[key]
    : pageData.contentData?.[key]

  $: content = p ? JSON.parse(rawContent || '{}')[p] : rawContent

  // Load list items from DB
  $: items = isList
    ? Array.from(
        new Set(
          Object.keys(pageData.contentData || {})
            .filter((k) => k.startsWith(`${key}.`))
            .map((k) => k.split('.')[1]),
        ),
      ).map((index) => ({
        title: JSON.parse(pageData.contentData[`${key}.${index}.title`] || '{}')
          .title,
        desc: JSON.parse(pageData.contentData[`${key}.${index}.desc`] || '{}')
          .desc,
      }))
    : null

  async function save() {
    if (!isList) {
      const newText = editableRef.textContent.trim()
      if (newText === content) return

      const value = p
        ? JSON.stringify({ ...JSON.parse(rawContent || '{}'), [p]: newText })
        : newText

      await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageTitle: pg || pageData.pageTitle,
          key,
          value,
        }),
      })
      content = newText
    }
  }

  async function saveList() {
    await fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pageTitle: pg || pageData.pageTitle,
        key,
        value: JSON.stringify(items),
      }),
    })
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
