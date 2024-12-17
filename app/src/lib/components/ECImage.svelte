<script>
  import { pageData } from '$lib/stores/pageStore'
  import { langStore } from '$lib/stores/langStore'
  import { isEditable } from '$lib/stores/editorStore'
  import { ImageIcon } from 'lucide-svelte'
  import { Edit2, Trash2 } from 'lucide-svelte'
  import { invalidateAll } from '$app/navigation'

  export let key
  export let index = null
  export let tag = null
  let fileInput

  $: content =
    index !== null
      ? tag
        ? $pageData.contentData?.[key]?.[index]?.[tag]
        : $pageData.contentData?.[key]?.[index]?.value
      : $pageData.contentData?.[key]

  async function handleImageUpload(e) {
    try {
      const file = e.target.files[0]
      if (!file) return

      const formData = new FormData()
      formData.append('file', file)
      formData.append('lang', $langStore)
      formData.append('key', key)
      formData.append('tag', tag)
      formData.append('pageTitle', $pageData.pageTitle)
      if (index !== null) formData.append('index', index)

      const { id } = await (
        await fetch('/api/media', {
          method: 'POST',
          body: formData,
        })
      ).json()

      // Direct content saving without going through media endpoint
      await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageTitle: $pageData.pageTitle,
          key,
          tag,
          index,
          value: id.toString(),
          lang: $langStore,
        }),
      })

      await invalidateAll()
    } catch (err) {
      console.error('Upload error:', err)
    }
  }

  async function deleteImage() {
    try {
      await fetch(`/api/media/${content}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageTitle: $pageData.pageTitle,
          key,
          tag,
          lang: $langStore,
          index,
        }),
      })
      await invalidateAll()
    } catch (err) {
      console.error('Delete error:', err)
    }
  }

  $: imgSrc = content ? `/api/media/serve/${content}?t=${Date.now()}` : ''
</script>

{#if $isEditable}
  <div
    class="relative group outline-dashed outline-1 outline-red-500 hover:outline-red-500 {$$props.class}"
  >
    {#if content}
      <img src={imgSrc} class={$$props.class} alt={key} />
    {/if}
    <input
      type="file"
      accept="image/*"
      bind:this={fileInput}
      on:change={handleImageUpload}
      class="hidden"
    />
    <div
      class={content
        ? 'absolute opacity-0 transition-opacity bg-black/30 group-hover:opacity-100 inset-0 flex items-center justify-center gap-4'
        : ''}
    >
      {#if content}
        <button
          class="p-2 hover:bg-black/20 rounded-full"
          on:click={() => fileInput.click()}
        >
          <Edit2 class="text-white" />
        </button>
        <button
          class="p-2 hover:bg-black/20 rounded-full"
          on:click={deleteImage}
        >
          <Trash2 class="text-white" />
        </button>
      {:else}
        <div
          class="h-36 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors w-full h-full"
          on:click={() => fileInput?.click()}
        >
          <ImageIcon class="w-12 h-12 text-gray-400 mb-2" />
          <p class="text-sm text-gray-500">Click to upload image</p>
        </div>
      {/if}
    </div>
  </div>
{:else if content}
  <img src={imgSrc} class={$$props.class} alt={key} />
{/if}
