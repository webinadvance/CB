<script>
  import { pageData } from '$lib/stores/pageStore'
  import { createEventDispatcher } from 'svelte'

  export let key
  export let pg
  export let tag = 'div'
  export let cssClass = ''
  export let placeholder = 'Content not found'
  export let p = null
  export let isList = false

  const dispatch = createEventDispatcher()
  let editableRef

  $: content = pg
    ? $pageData.extraContent[pg]?.[key]
    : $pageData.contentData?.[key]

  $: items = isList
    ? Object.keys($pageData.contentData || {}).filter((k) =>
        k.startsWith(`${key}.`),
      ).length
      ? Array.from(
          new Set(
            Object.keys($pageData.contentData || {})
              .filter((k) => k.startsWith(`${key}.`))
              .map((k) => k.split('.')[1]),
          ),
        )
          .sort((a, b) => a - b)
          .map((index) => {
            const fields = Object.keys($pageData.contentData)
              .filter((k) => k.startsWith(`${key}.${index}.`))
              .reduce((acc, k) => {
                const prop = k.split('.').pop()
                acc[prop] = $pageData.contentData[k] || ''
                return acc
              }, {})
            return fields
          })
      : [{ title: placeholder, desc: placeholder }]
    : null

  async function save() {
    if (!isList) {
      const newText = editableRef.textContent.trim()
      if (newText === content) return

      await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageTitle: pg || $pageData.pageTitle,
          key,
          value: newText,
        }),
      })

      pageData.update((data) => ({
        ...data,
        contentData: {
          ...data.contentData,
          [key]: newText,
        },
      }))
    }
  }

  function addItem() {
    const newIndex = items.length
    pageData.update((data) => ({
      ...data,
      contentData: {
        ...data.contentData,
        [`${key}.${newIndex}.title`]: '',
        [`${key}.${newIndex}.desc`]: '',
      },
    }))
  }

  async function removeItem(index) {
    await fetch('/api/content', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pageTitle: pg || $pageData.pageTitle,
        key,
        index,
      }),
    })

    pageData.update((data) => {
      const contentData = {}
      let newIndex = 0

      Object.entries(data.contentData).forEach(([k, v]) => {
        if (!k.startsWith(`${key}.`)) {
          contentData[k] = v
          return
        }

        const [prefix, idx, field] = k.split('.')
        if (Number(idx) === index) return

        const adjustedIdx = Number(idx) > index ? Number(idx) - 1 : Number(idx)
        contentData[`${prefix}.${adjustedIdx}.${field}`] = v
      })

      return { ...data, contentData }
    })
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
