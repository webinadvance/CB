<script>
  let { key, page, tag = 'div', class: cssClass = '' } = $props()
  import { getPageData } from '$lib/stores/pageStore'

  const EDITABLE = true
  const pageData = getPageData()
  let editableRef
  let text = $state(
    page ? pageData.extraContent[page][key] : pageData.contentData[key],
  )

  async function save() {
    const newText = editableRef.textContent.trim()
    if (newText === text) return

    await fetch('/api/content', {
      method: 'POST',
      body: JSON.stringify({
        pageTitle: page || pageData.pageTitle,
        key,
        value: newText,
      }),
      headers: { 'Content-Type': 'application/json' },
    })
    text = newText
  }
</script>

{#if EDITABLE}
  <svelte:element
    this={tag}
    bind:this={editableRef}
    contenteditable="true"
    onblur={save}
    class="{cssClass} outline-dashed outline-1 outline-red-500 hover:outline-red-500"
  >
    {text}
  </svelte:element>
{:else}
  <svelte:element this={tag} class={cssClass}>
    {text}
  </svelte:element>
{/if}
