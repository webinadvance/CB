<script>
  import EC from '$lib/components/EC.svelte'
  import ECList from '$lib/components/ECList.svelte'
</script>

<div>HomeComponent.svelte</div>

<ECList key="images">
  <svelte:fragment slot="default" let:index let:parentKey>
    <EC key={`${parentKey}.${index}`} image class="w-32 h-32" />
  </svelte:fragment>
</ECList>
