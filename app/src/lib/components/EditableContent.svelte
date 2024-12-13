<script>
  let {
    key,
    page,
    tag = 'div',
    class: cssClass = '',
    placeholder = 'Content not found',
    propName = null,
  } = $props()

  import { getPageData } from '$lib/stores/pageStore'

  const pageData = getPageData()
  let editableRef
  const rawContent = page
    ? pageData.extraContent[page]?.[key]
    : pageData.contentData?.[key]
  let content = propName ? JSON.parse(rawContent || '{}')[propName] : rawContent
  let text = $state(content || placeholder)

  async function save() {
    const newText = editableRef.textContent.trim()
    if (newText === text) return

    const value = propName
      ? JSON.stringify({
          ...JSON.parse(rawContent || '{}'),
          [propName]: newText,
        })
      : newText

    await fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pageTitle: page || pageData.pageTitle,
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
