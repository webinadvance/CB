<script>
  import { BaseComponent, getMediaPreviewUrl } from '$lib'
  import EditableContent from '$lib/components/EditableContent.svelte'
  let src = getMediaPreviewUrl(1)
  let isEditing = true // Toggle based on authentication
</script>

<BaseComponent {...$$props} let:pageData let:params let:content>
  <EditableContent
    key="main-content"
    pageTitle="Home"
    isEditing={true}
    {content}
  />
  <EditableContent key="main-content" isEditing={false} {content} />
</BaseComponent>
