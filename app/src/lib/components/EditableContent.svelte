<script>
  let { key } = $props()
  import { getPageData } from '$lib/actions/pageData'

  const pageData = getPageData()
  let editableRef
  let text = $state(pageData.contentData[key])

  async function save() {
    const newText = editableRef.textContent.trim()
    if (newText === text) return

    await fetch('/api/content', {
      method: 'POST',
      body: JSON.stringify({
        pageTitle: pageData.pageTitle,
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
