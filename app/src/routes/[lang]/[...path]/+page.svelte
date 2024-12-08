<script>
  import Loader from '$lib/components/Loader.svelte'
  import { setContent } from '$lib/actions/content.js'

  /** @type {import('./$types').PageData} */
  export let data

  $: getContent = (key, pageTitle = null) => {
    if (!pageTitle) return data.page?.contentData?.[key] || ''
    return data.extraContent[pageTitle]?.[key] || ''
  }

  $: content = setContent(data.page, getContent)
</script>

<div class="p-4">
  {#if data.page}
    <Loader
      componentName={data.page.componentName}
      pageData={{
        ...data.page,
        routeParams: data.routeParams,
        getExtraContent: getContent,
      }}
    />
  {/if}
</div>
