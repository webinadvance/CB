<script>
  import { BaseComponent, getMediaPreviewUrl } from '$lib'
  import Footer from '$lib/components/Footer.svelte'
  let src = getMediaPreviewUrl(1)
</script>

<BaseComponent {...$$props} let:pageData let:params let:content>
  <div>{content('main-content')}</div>
  <Footer content={content('footer', 'Common')} />
</BaseComponent>
