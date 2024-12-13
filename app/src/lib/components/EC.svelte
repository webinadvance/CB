<script>
  let {
    key,
    pg,
    tag = 'div',
    class: cssClass = '',
    placeholder = 'Content not found',
    p = null,
  } = $props()

  import { getPageData } from '$lib/stores/pageStore'

  const pageData = getPageData()
  let editableRef
  const rawContent = pg
    ? pageData.extraContent[pg]?.[key]
    : pageData.contentData?.[key]
  let content = p ? JSON.parse(rawContent || '{}')[p] : rawContent
  let text = $state(content || placeholder)

  async function save() {
    const newText = editableRef.textContent.trim()
    if (newText === text) return

    const value = p
      ? JSON.stringify({
          ...JSON.parse(rawContent || '{}'),
          [p]: newText,
        })
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
