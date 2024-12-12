<script>
  export let pageData = {}
  $: params = pageData?.routeParams || {}

  import { setContent } from '$lib/actions/content'
  $: setContent(pageData, (key, pageTitle) => {
    if (pageTitle && pageData?.extraContent?.[pageTitle]) {
      return pageData.extraContent[pageTitle][key] || ''
    }
    return pageData?.contentData?.[key] || ''
  })
</script>

<slot {pageData} {params} />
