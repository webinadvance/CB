<script>
  import { pageData } from '$lib/stores/pageStore'
  import { langStore } from '$lib/stores/langStore'
  import { isEditable } from '$lib/stores/editorStore'

  export let key

  $: items = Object.keys($pageData.contentData || {})
    .filter((k) => k.startsWith(`${key}.`))
    .reduce((acc, k) => {
      const [_, index] = k.split('.')
      if (!acc[index]) acc[index] = {}
      return acc
    }, []) || [{}]

  async function removeItem(index) {
    await fetch('/api/content', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pageTitle: $pageData.pageTitle,
        key,
        index,
        lang: $langStore,
      }),
    })

    pageData.update((data) => {
      const contentData = {}
      Object.entries(data.contentData).forEach(([k, v]) => {
        if (!k.startsWith(`${key}.`)) {
          contentData[k] = v
          return
        }
        const [prefix, idx] = k.split('.')
        if (Number(idx) === index) return
        const adjustedIdx = Number(idx) > index ? Number(idx) - 1 : Number(idx)
        contentData[`${prefix}.${adjustedIdx}`] = v
      })
      return { ...data, contentData }
    })
  }

  function addItem() {
    const newIndex = items.length
    pageData.update((data) => ({
      ...data,
      contentData: {
        ...data.contentData,
        [`${key}.${newIndex}`]: '',
      },
    }))
  }
</script>

// ECList.svelte
<div class={$$props.class || ''}>
  {#each items as _, index}
    <div class="mb-4">
      <slot {index} parentKey={key} />
      {#if $isEditable}
        <button class="mt-2 text-red-500" on:click={() => removeItem(index)}>
          Remove
        </button>
      {/if}
    </div>
  {/each}
  {#if $isEditable}
    <button class="text-blue-500" on:click={addItem}> Add Item </button>
  {/if}
</div>
