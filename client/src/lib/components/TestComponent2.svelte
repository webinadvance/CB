<script>
  /** @type {any} */
  export let pageData
  import { getContent } from '$lib/actions/content.js'

  $: ({ routeParams: params = {} } = pageData)
</script>

<div class="p-4">
  <h2 class="text-xl font-semibold">{pageData.title}</h2>
  <div>Item: {params.item1}</div>
  <div>{@html getContent()('main-content')}</div>
</div>
