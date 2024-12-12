<script>
  import { BaseComponent, getMediaPreviewUrl } from '$lib'
  let src = getMediaPreviewUrl(1)
</script>

<BaseComponent {...$$props} let:pageData let:params let:content>
  <div>TestComponent2.svelte</div>
  <div>{content('main-content')}</div>
  <div>{content('main-content', 'Test')}</div>
  <div class="p-4">
    <h2 class="text-xl font-semibold">{pageData?.pageTitle || ''}</h2>
    <div>Item: {params?.item1 || ''}</div>
    <div>Item: {params?.item2 || ''}</div>
    <div>{@html content('main-content')}</div>
    <img {src} alt="Media content" class="max-w-full h-auto" />
  </div>
</BaseComponent>
