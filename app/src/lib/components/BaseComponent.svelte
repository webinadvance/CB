<script>
  /** @type {any} */
  export let pageData = {}
  import { getContent } from '$lib/actions/content.js'

  $: params = pageData?.routeParams || {}
  $: content = getContent()
  //MM
</script>

<slot {pageData} {params} {content} />
<div>{JSON.stringify(params)}</div>
<div>{JSON.stringify(pageData)}</div>
<div>{JSON.stringify(content)}</div>
