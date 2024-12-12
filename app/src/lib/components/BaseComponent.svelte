<script>
  export let pageData = {}

  $: params = pageData?.routeParams || {}
  $: content = (key, pageTitle = null) => {
    if (pageTitle && pageData?.extraContent?.[pageTitle]) {
      return pageData.extraContent[pageTitle][key] || ''
    }
    return pageData?.contentData?.[key] || ''
  }
</script>

<slot {pageData} {params} {content} />
