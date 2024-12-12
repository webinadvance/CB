<script>
  import EditableContent from '$lib/components/EditableContent.svelte'
  import { buildPageUrl } from '$lib/utils/url'
</script>

<div>HomeComponent.svelte</div>
<EditableContent tag="h1" key="main-content" class="inline-block max-w-xl" />
<EditableContent key="footer" page="Common" class="inline-block" />
