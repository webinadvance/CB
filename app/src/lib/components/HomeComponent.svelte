<script>
  import ECImage from '$lib/components/ECImage.svelte'
  import ECList from '$lib/components/ECList.svelte'
</script>

<div>HomeComponent.svelte</div>

<!--<ECImage key="myimage" class="max-w-72" />-->

<ECList key="myimagelist4" let:itemKey>
  <ECImage key={itemKey} class="max-w-72" />
</ECList>
//
