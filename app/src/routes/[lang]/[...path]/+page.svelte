<script>
  import * as components from '$lib'
  import { setPageData } from '$lib/stores/pageStore'
  import { pageSlugs } from '$lib/stores/pageStore'
  export let data

  console.log('AAA data.page', data.page)
  console.log('AAA data.slugs', data.slugs)

  $: setPageData(data.page)
  $: pageSlugs.set(data.slugs)
</script>

{#if data.page}
  <svelte:component this={components[data.page.componentName]} />
{/if}