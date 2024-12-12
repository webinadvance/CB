<script>
  import { BaseComponent, getMediaPreviewUrl } from '$lib'
  let src = getMediaPreviewUrl(1)
</script>

<BaseComponent {...$$props} let:pageData let:params let:content>
  <div>HomeComponent.svelte</div>
  <div>{content('main-content')}</div>
  <div>{content('footer', 'Common')}</div>
</BaseComponent>
