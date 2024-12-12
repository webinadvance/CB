<script>
  import Loader from '$lib/components/Loader.svelte'
  import { getContent, setContent } from '$lib/actions/content.js'

  /** @type {import('./$types').PageData} */
  export let data

  $: content = setContent(data.page, (key, pageTitle) => {
    if (!pageTitle) return data.page?.contentData?.[key] || ''
    return data.page?.extraContent?.[pageTitle]?.[key] || ''
  })
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
//
