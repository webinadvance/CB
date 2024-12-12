<script>
  let { key, page } = $props()
  import { getPageData } from '$lib/actions/pageData'

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

<div bind:this={editableRef} contenteditable="true" onblur={save}>
  {text}
</div>
