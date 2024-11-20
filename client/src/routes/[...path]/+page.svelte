<script>
  import DynamicComponentLoader from '$lib/components/DynamicComponentLoader.svelte'
  import { setContent } from '$lib/actions/content.js'

  /** @type {import('./$types').PageData} */
  export let data

  $: content = setContent(data.page)
</script>

<div class="p-4">
  {#if data.page}
    <DynamicComponentLoader
      componentName={data.page.componentName}
      pageData={{
        ...data.page,
        routeParams: data.routeParams,
        contentData: data.page.contentData,
      }}
    />
  {/if}
</div>
