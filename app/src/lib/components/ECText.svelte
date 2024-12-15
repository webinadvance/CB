<script>
  import { pageData } from '$lib/stores/pageStore'
  import { langStore } from '$lib/stores/langStore'
  import { isEditable } from '$lib/stores/editorStore'
  export let uniqueKey

  export let key
  export let pg
  export let tag = 'div'
  export let placeholder = 'Content not found'

  let editableRef

  $: content = pg
    ? $pageData.extraContent[pg]?.[key]
    : $pageData.contentData?.[key] || ''

  async function save() {
    const newText = editableRef.textContent.trim()
    if (newText === content) return

    await fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pageTitle: pg || $pageData.pageTitle,
        key,
        value: newText,
        lang: $langStore,
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
</script>

{#if !$isEditable}
  <svelte:element this={tag} class={$$props.class || ''}>
    {content === null || content === undefined ? placeholder : content}
  </svelte:element>
{:else}
  <svelte:element
    this={tag}
    bind:this={editableRef}
    contenteditable={$isEditable}
    on:blur={save}
    class={`${$$props.class || ''} ${$isEditable ? 'outline-dashed outline-1 outline-red-500 hover:outline-red-500' : ''}`}
  >
    {content === null || content === undefined ? placeholder : content}
  </svelte:element>
{/if}
