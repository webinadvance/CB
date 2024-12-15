<script>
  import ECImage from '$lib/components/ECImage.svelte'
  import ECList from '$lib/components/ECList.svelte'
  import ECText from '$lib/components/ECText.svelte'
</script>

<div>HomeComponent.svelte</div>

<!--<ECList key="myimagelist13" let:itemKey>-->
<!--  <ECImage key={itemKey} class="max-w-72" />-->
<!--</ECList>-->

<!--<ECImage key={'aaa1'} class="max-w-72" />-->

<ECList key="myimagelist15" let:itemKey>
  <ECText key={itemKey} />
</ECList>
