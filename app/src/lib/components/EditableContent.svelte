<script>
  let { key, page, class: cssClass = '' } = $props()
  import { getPageData } from '$lib/actions/pageData'

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
  <div
    bind:this={editableRef}
    contenteditable="true"
    on:blur={save}
    class="{cssClass} outline-dashed outline-1 outline-red-500 hover:outline-red-500"
  >
    {text}
  </div>
{:else}
  <div class={cssClass}>{text}</div>
{/if}
