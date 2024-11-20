<script>
  /** @type {any} */
  export let pageData = {}
  import { getContent } from '$lib/actions/content.js'

  $: params = pageData?.routeParams || {}
  $: content = getContent()
</script>

<slot {pageData} {params} {content} />
