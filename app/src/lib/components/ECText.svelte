<script>
  import { pageData } from '$lib/stores/pageStore'
  import { isEditable } from '$lib/stores/editorStore'
  import { invalidateAll } from '$app/navigation'
  export let key
  export let pg
  export let tag = 'div'
  export let index = null
  export let elementTag = null
  export let placeholder = 'Oops, this is empty!'
  export let canDelete = false
  export let canClear = true
  let currentContent = ''

  function sanitizeHTML(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    doc.body
      .querySelectorAll('*')
      .forEach((el) => el.style.removeProperty('font-family'))
    ;(function removeComments(node) {
      for (let i = node.childNodes.length - 1; i >= 0; i--) {
        const child = node.childNodes[i]
        child.nodeType === 8
          ? node.removeChild(child)
          : child.nodeType === 1 && removeComments(child)
      }
    })(doc.body)
    return doc.body.innerHTML
  }

  $: currentContent = pg
    ? $pageData.extraContent[pg]?.[key]
    : elementTag && typeof index === 'number'
      ? $pageData.contentData[key]?.[index]?.[elementTag] || ''
      : $pageData.contentData[key]

  async function save(event) {
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
  }

  async function deleteText() {
    await fetch('/api/content', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pageTitle: pg || $pageData.pageTitle,
        key,
        tag: elementTag,
        index,
        strict: !!elementTag,
      }),
    })
    await invalidateAll()
  }

  async function clearContent() {
    await save({ target: { innerHTML: '' } })
    await invalidateAll()
  }
</script>

{#if !$isEditable}
  <svelte:element this={tag} class={$$props.class || ''}>
    {@html currentContent}
  </svelte:element>
{:else}
  <div class="relative cursor-text">
    <svelte:element
      this={tag}
      contenteditable="true"
      on:input={save}
      class={`${$$props.class || ''} outline-dashed outline-1 outline-red-500`}
      data-placeholder={placeholder}
    >
      {@html currentContent}
    </svelte:element>
    {#if canDelete}
      <button
        class="absolute top-0 right-0 bg-red-500 text-white rounded p-1 text-sm hover:bg-red-700"
        on:click={deleteText}
      >
        Delete
      </button>
    {/if}
    {#if canClear}
      <button
        class="absolute top-0 right-12 bg-gray-500 text-white rounded p-1 text-sm hover:bg-gray-700"
        on:click={clearContent}
      >
        Clear
      </button>
    {/if}
  </div>
{/if}
//

<style>
  [contenteditable='true']:empty::before {
    content: attr(data-placeholder);
    color: gray;
    font-style: italic;
    opacity: 0.5;
    pointer-events: none;
  }
</style>
