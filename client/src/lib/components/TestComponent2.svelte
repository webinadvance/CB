<script>
  import { BaseComponent } from '$lib/components'
</script>

<BaseComponent {...$$props} let:pageData let:params let:content>
  <div class="p-4">
    <h2 class="text-xl font-semibold">{pageData?.title || ''}</h2>
    <div>Item: {params?.item1 || ''}</div>
    <div>{@html content('main-content')}</div>
  </div>
</BaseComponent>
