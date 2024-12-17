<script>
  import { pageData } from '$lib/stores/pageStore'
  import { langStore } from '$lib/stores/langStore'
  import { isEditable } from '$lib/stores/editorStore'
  export let key
  export let pg
  export let tag = 'div'
  export let index = null
  export let elementTag = null
  export let placeholder = 'Content not found'
  let currentContent = ''
  $: currentContent = pg
    ? $pageData.extraContent[pg]?.[key]
    : elementTag && typeof index === 'number'
      ? $pageData.contentData[key]?.[index]?.[elementTag] || ''
      : $pageData.contentData[key]
  import { getContext } from 'svelte'
  import { invalidateAll } from '$app/navigation'
  async function save(event) {
    const newContent = event.target.textContent
    try {
      await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageTitle: pg || $pageData.pageTitle,
          key,
          tag: elementTag,
          index,
          value: newContent,
        }),
      })
    } catch (error) {
      console.error('Error saving content:', error)
    }
  }
  // const parentEvent = getContext('parentEvent')
  async function deleteText() {
    await fetch('/api/content', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pageTitle: pg || $pageData.pageTitle,
        key,
        tag: elementTag,
        index,
        strict: !elementTag,
      }),
    })
    await invalidateAll()
    // parentEvent?.({ key, tag: elementTag, index })
  }
</script>

{#if !$isEditable}
  <svelte:element this={tag} class={$$props.class || ''}>
    {currentContent || placeholder}
  </svelte:element>
{:else}
  <div class="relative cursor-text">
    <svelte:element
      this={tag}
      contenteditable="true"
      on:input={save}
      class={`${$$props.class || ''} ${$isEditable ? 'outline-dashed outline-1 outline-red-500' : ''}`}
    >
      {currentContent || placeholder}
    </svelte:element>
    <button
      class="absolute top-0 right-0 bg-red-500 text-white rounded p-1 text-sm hover:bg-red-700"
      on:click={deleteText}
    >
      Delete
    </button>
  </div>
{/if}
