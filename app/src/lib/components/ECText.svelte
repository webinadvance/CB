<script>
  import { pageData } from '$lib/stores/pageStore'
  import { langStore } from '$lib/stores/langStore'
  import { isEditable } from '$lib/stores/editorStore'

  export let key
  export let pg
  export let tag = 'div'
  export let placeholder = 'Content not found'

  let currentContent = ''
  let saveTimeout

  $: currentContent = pg
    ? $pageData.extraContent[pg]?.[key]
    : $pageData.contentData?.[key] || ''

  async function save() {
    clearTimeout(saveTimeout)
    saveTimeout = setTimeout(async () => {
      console.log('save', currentContent)
      await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageTitle: pg || $pageData.pageTitle,
          key,
          value: currentContent,
          lang: $langStore,
        }),
      })

      pageData.update((data) => ({
        ...data,
        contentData: {
          ...data.contentData,
          [key]: currentContent,
        },
      }))
    }, 500)
  }
</script>

{#if !$isEditable}
  <svelte:element this={tag} class={$$props.class || ''}>
    {currentContent || placeholder}
  </svelte:element>
{:else}
  <svelte:element
    this={tag}
    contenteditable="true"
    bind:textContent={currentContent}
    on:input={save}
    class={`${$$props.class || ''} ${$isEditable ? 'outline-dashed outline-1 outline-red-500' : ''}`}
  >
    {currentContent || placeholder}
  </svelte:element>
{/if}
