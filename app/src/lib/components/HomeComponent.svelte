<script>
  import { BaseComponent, getMediaPreviewUrl } from '$lib'
  let src = getMediaPreviewUrl(1)
</script>

<BaseComponent {...$$props} let:pageData let:params let:content>
  <div>HOME</div>
</BaseComponent>
