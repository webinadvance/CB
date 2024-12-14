<script>
  import { pageData } from '$lib/stores/pageStore'
  import { langStore } from '$lib/stores/langStore'
  import { isEditable } from '$lib/stores/editorStore'
  import { createEventDispatcher } from 'svelte'
  import { ImageIcon } from 'lucide-svelte'
  import { Edit2 } from 'lucide-svelte'

  export let key
  export let pg
  export let tag = 'div'
  export let placeholder = 'Content not found'
  export let isList = false
  export let image = false

  let fileInput

  const dispatch = createEventDispatcher()
  let editableRef

  $: content = pg
    ? $pageData.extraContent[pg]?.[key]
    : $pageData.contentData?.[key]

  console.log('AAA pageData', $pageData)

  $: items = isList
    ? Object.keys($pageData.contentData || {}).filter((k) =>
        k.startsWith(`${key}.`),
      ).length
      ? Array.from(
          new Set(
            Object.keys($pageData.contentData || {})
              .filter((k) => k.startsWith(`${key}.`))
              .map((k) => k.split('.')[1]),
          ),
        )
          .sort((a, b) => a - b)
          .map((index) => {
            const fields = Object.keys($pageData.contentData)
              .filter((k) => k.startsWith(`${key}.${index}.`))
              .reduce((acc, k) => {
                const prop = k.split('.').pop()
                acc[prop] = $pageData.contentData[k] || ''
                return acc
              }, {})
            return fields
          })
      : [{ title: placeholder, desc: placeholder }]
    : null

  async function handleImageUpload(e) {
    try {
      const file = e.target.files[0]
      if (!file) return

      const formData = new FormData()
      formData.append('file', file)
      formData.append('lang', $langStore)
      formData.append('key', key)
      formData.append('pageTitle', pg || $pageData.pageTitle)

      const response = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      })

      const { id } = await response.json()

      // Update store to trigger reactive refresh
      pageData.update((data) => ({
        ...data,
        contentData: {
          ...data.contentData,
          [key]: id.toString(),
        },
      }))
    } catch (err) {
      console.error('Upload error:', err)
    }
  }

  async function save() {
    if (!isList) {
      const newText = editableRef.textContent.trim()
      if (newText === content) return

      await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageTitle: pg || $pageData.pageTitle,
          key,
          value: newText,
          lang: $langStore,
        }),
      })

      pageData.update((data) => ({
        ...data,
        contentData: {
          ...data.contentData,
          [key]: newText,
        },
      }))
    }
  }

  function addItem() {
    const newIndex = items.length
    pageData.update((data) => ({
      ...data,
      contentData: {
        ...data.contentData,
        [`${key}.${newIndex}.title`]: '',
        [`${key}.${newIndex}.desc`]: '',
      },
    }))
  }

  async function removeItem(index) {
    await fetch('/api/content', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pageTitle: pg || $pageData.pageTitle,
        key,
        index,
        lang: $langStore,
      }),
    })

    pageData.update((data) => {
      const contentData = {}
      Object.entries(data.contentData).forEach(([k, v]) => {
        if (!k.startsWith(`${key}.`)) {
          contentData[k] = v
          return
        }
        const [prefix, idx, field] = k.split('.')
        if (Number(idx) === index) return
        const adjustedIdx = Number(idx) > index ? Number(idx) - 1 : Number(idx)
        contentData[`${prefix}.${adjustedIdx}.${field}`] = v
      })
      return { ...data, contentData }
    })
  }
</script>

{#if image}
  <input
    type="file"
    accept="image/*"
    bind:this={fileInput}
    on:change={handleImageUpload}
    class="hidden"
  />

  {#if content}
    <div
      class={`outline-dashed outline-1 outline-red-500 hover:outline-red-500 relative group ${$$props.class || ''}`}
    >
      <img
        src={`/api/media/serve/${content}`}
        alt={key}
        class="w-full h-full object-cover"
      />
      {#if $isEditable}
        <div
          class="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          on:click={() => fileInput.click()}
        >
          <Edit2 class="text-white" />
        </div>
      {/if}
    </div>
  {:else}
    <div
      class={`${$$props.class || ''} bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg 
      flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors
      ${!$isEditable ? 'pointer-events-none opacity-50' : ''}`}
      on:click={() => {
        console.log('clicked', $isEditable)
        if ($isEditable) fileInput?.click()
      }}
    >
      <ImageIcon class="w-12 h-12 text-gray-400 mb-2" />
      <p class="text-sm text-gray-500">Click to upload image</p>
      <p class="text-xs text-gray-400 mt-1">{key}</p>
    </div>
  {/if}
{:else if isList}
  <div class={$$props.class || ''}>
    {#each items as item, index}
      <div class="mb-4">
        <slot name="item" {item} {index} />
        {#if $isEditable}
          <button class="mt-2 text-red-500" on:click={() => removeItem(index)}
            >Remove</button
          >
        {/if}
      </div>
    {/each}
    {#if $isEditable}
      <button class="text-blue-500" on:click={addItem}>Add Item</button>
    {/if}
  </div>
{:else if !$isEditable}
  <svelte:element this={tag} class={$$props.class || ''}>
    {content || placeholder}
  </svelte:element>
{:else}
  <svelte:element
    this={tag}
    bind:this={editableRef}
    contenteditable={$isEditable}
    on:blur={save}
    class={`${$$props.class || ''} ${$isEditable ? 'outline-dashed outline-1 outline-red-500 hover:outline-red-500' : ''}`}
  >
    {content || placeholder}
  </svelte:element>
{/if}
