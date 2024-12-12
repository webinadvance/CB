<script>
  let { key, pageTitle, isEditing = false, content } = $props()
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
    on:input={() => (contentValue = editableRef.textContent)}
    on:blur={saveContent}
    class="border border-dashed p-2 min-h-[2rem] focus:border-blue-400 focus:shadow-sm outline-none"
  >
    {contentValue}
  </div>
{:else}
  <div>{@html contentValue}</div>
{/if}

<style>
</style>
