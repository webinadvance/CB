<script>
  export let pageData = {}
  import { getContent, setContent } from '$lib/actions/content.js'
  $: {
    setContent(pageData?.contentData || {})
  }
  $: params = pageData?.routeParams || {}
  $: content = getContent()
</script>
<slot {pageData} {params} {content} />
