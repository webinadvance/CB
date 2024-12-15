<script>
  import ECImage from '$lib/components/ECImage.svelte'
  import ECList from '$lib/components/ECList.svelte'
  import ECText from '$lib/components/ECText.svelte'
</script>

<div>HomeComponent.svelte</div>

<ECList key="images" class="flex items-center content-center h-80" let:itemKey>
  <ECImage key={itemKey} class="max-w-72" />
</ECList>

<ECList key="text" let:itemKey>
  <ECText key={itemKey} />
</ECList>
