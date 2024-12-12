<script>
  import { BaseComponent, getMediaPreviewUrl } from '$lib'
  let src = getMediaPreviewUrl(1)
</script>

<BaseComponent {...$$props} let:pageData let:params let:content>
  <div>HomeComponent.svelte</div>
  <div>{content('main-content')}</div>
  <div>
    {#if content('footer', 'Common')}
      {content('footer', 'Common')}
    {:else}
      <p>No footer content found for Common</p>
    {/if}
  </div>
</BaseComponent>
