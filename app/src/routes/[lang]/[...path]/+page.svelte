<script>
  import * as components from '$lib'
  import { setPageData } from '$lib/stores/pageStore'
  export let data

  console.log('AAA', data.page)

  $: setPageData(data.page)
</script>

{#if data.page}
  <svelte:component this={components[data.page.componentName]} />
{/if}
