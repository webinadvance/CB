<script>
  import { BaseComponent, getMediaPreviewUrl } from '$lib'
  let src = getMediaPreviewUrl(1)
</script>

<BaseComponent {...$$props} let:pageData let:params let:content>
  <div class="p-4">
    <div>{JSON.stringify(params)}</div>
    <div>{content('main-content')}</div>
  </div>
</BaseComponent>
