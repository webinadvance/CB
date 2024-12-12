<script>
  export let pageData = {}

  $: params = pageData?.routeParams || {}
  $: content = (key, pageTitle = null) => {
    if (pageTitle && pageData?.extraContent?.[pageTitle]?.contentData) {
      return pageData.extraContent[pageTitle].contentData[key] || ''
    }
    return pageData?.contentData?.[key] || ''
  }
</script>

<slot {pageData} {params} {content} />
