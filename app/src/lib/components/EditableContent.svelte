<script>
  import { getContent } from '$lib/actions/content.js'

  let { key, pageTitle, isEditing = false } = $props()
  const content = getContent()
  let { contentValue, initialValue } = $state({
    contentValue: '',
    initialValue: '',
  })
  let editableRef

  $effect(() => {
    if (!initialValue) {
      initialValue = pageTitle ? content(key, pageTitle) : content(key)
      contentValue = initialValue
    }
  })

  async function saveContent() {
    const newValue = editableRef.textContent.trim()
    if (newValue !== initialValue) {
      await fetch('/api/content', {
        method: 'POST',
        body: JSON.stringify({
          pageTitle,
          key,
          value: newValue,
        }),
        headers: { 'Content-Type': 'application/json' },
      })
      initialValue = newValue
    }
  }
</script>

{#if isEditing}
  <div
    bind:this={editableRef}
    contenteditable="true"
    oninput={() => (contentValue = editableRef.textContent)}
    onblur={saveContent}
    class=""
  >
    {contentValue}
  </div>
{:else}
  <div>{@html contentValue}</div>
{/if}
// // //

<style>
</style>
