<script>
  import { pageData } from '$lib/stores/pageStore'
  import { isEditable } from '$lib/stores/editorStore'
  import { invalidateAll } from '$app/navigation'
  export let key,
    pg,
    tag = 'div',
    index = null,
    elementTag = null,
    placeholder = 'Oops, this is empty!',
    canClear = true
  let currentContent = ''

  const sanitizeHTML = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    doc.body
      .querySelectorAll('*')
      .forEach((el) => el.style.removeProperty('font-family'))
    ;(function removeComments(node) {
      ;[...node.childNodes].forEach((child) =>
        child.nodeType === 8
          ? node.removeChild(child)
          : child.nodeType === 1 && removeComments(child),
      )
    })(doc.body)
    return doc.body.innerHTML
  }

  $: currentContent = pg
    ? $pageData.extraContent[pg]?.[key]?.[index]?.[elementTag] || ''
    : $pageData.contentData[key]?.[index]?.[elementTag] || ''

  const save = async (event) =>
    await fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pageTitle: pg || $pageData.pageTitle,
        key,
        tag: elementTag,
        index,
        value: sanitizeHTML(event.target.innerHTML),
      }),
    })
  const clearContent = async () => {
    await save({ target: { innerHTML: '' } })
    await invalidateAll()
  }
</script>

{#if !$isEditable}
  <svelte:element this={tag} class={$$props.class || ''}
    >{@html currentContent}</svelte:element
  >
{:else}
  <div class="relative group">
    <svelte:element
      this={tag}
      contenteditable="true"
      on:input={save}
      bind:innerHTML={currentContent}
      class={`${$$props.class || ''} outline-dashed outline-1 outline-red-500`}
      data-placeholder={placeholder}
    ></svelte:element>
    <div
      class="absolute -top-2.5 -right-2.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
    >
      {#if canClear}
        <button
          class="bg-gray-100 hover:bg-gray-200 text-gray-600 rounded w-5 h-5 flex items-center justify-center text-xs border shadow-sm transition-colors"
          on:click={clearContent}>↺</button
        >
      {/if}
    </div>
  </div>
{/if}

<style>
  [contenteditable='true']:empty::before {
    content: attr(data-placeholder);
    color: gray;
    font-style: italic;
    opacity: 0.5;
    pointer-events: none;
  }
</style>
