<script>
  let {
    key,
    page,
    tag = 'div',
    class: cssClass = '',
    placeholder = 'Content not found',
  } = $props()
  import { getPageData } from '$lib/stores/pageStore'

  const pageData = getPageData()
  let editableRef
  let text = $state(
    page
      ? pageData.extraContent[page]?.[key]
      : pageData.contentData?.[key] || placeholder,
  )

  async function save() {
    const newText = editableRef.textContent.trim()
    if (newText === text) return

    await fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pageTitle: page || pageData.pageTitle,
        key,
        value: newText,
      }),
    })
    text = newText
  }
</script>

<svelte:element
  this={tag}
  bind:this={editableRef}
  contenteditable={import.meta.env.DEV}
  on:blur={save}
  class={`${cssClass} ${import.meta.env.DEV ? 'outline-dashed outline-1 outline-red-500 hover:outline-red-500' : ''}`}
>
  {text}
</svelte:element>
