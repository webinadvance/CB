<script>
  import { getPageData } from '$lib/actions/pageData.js'
  import EditableContent from '$lib/components/EditableContent.svelte'
  const pageData = getPageData()
</script>

<div>HomeComponent.svelte</div>
<EditableContent key="main-content" />
