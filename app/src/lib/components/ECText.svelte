<script>
  import { pageData } from '$lib/stores/pageStore'
  import { langStore } from '$lib/stores/langStore'
  import { isEditable } from '$lib/stores/editorStore'

  export let key
  export let pg
  export let tag = 'div'
  export let placeholder = 'Content not found'

  let currentContent = ''

  $: currentContent = pg
    ? $pageData.extraContent[pg]?.[key]
    : $pageData.contentData?.[key] || ''

  async function save(event) {
    const newContent = event.target.textContent // Get changed content directly
    console.log('Save:', newContent)

    // Immediate save request
    try {
      await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageTitle: pg || $pageData.pageTitle,
          key,
          value: newContent,
          lang: $langStore,
        }),
      })

      // Update the store with new content
      // pageData.update((data) => ({
      //   ...data,
      //   contentData: {
      //     ...data.contentData,
      //     [key]: newContent,
      //   },
      // }))
    } catch (error) {
      console.error('Error saving content:', error)
    }
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
    on:input={save}
    class={`${$$props.class || ''} ${$isEditable ? 'outline-dashed outline-1 outline-red-500' : ''}`}
  >
    {currentContent || placeholder}
  </svelte:element>
{/if}
