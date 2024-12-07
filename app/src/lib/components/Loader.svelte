<script>
  /** @type {string} */
  export let componentName
  /** @type {any} */
  export let pageData

  import * as components from '$lib'
  $: Component = components[componentName]
</script>

{#if Component}
  <svelte:component this={Component} {pageData} />
{/if}
