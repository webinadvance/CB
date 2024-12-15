<script>
  import ECList from '$lib/components/ECList.svelte'
  import ECText from '$lib/components/ECText.svelte'
  import ECImage from '$lib/components/ECImage.svelte'
</script>

<div>HomeComponent.svelte</div>

<ECList
  key="images2111"
  class="flex items-center content-center h-80"
  let:baseKey
  let:index
>
  <ECImage key={`${baseKey}.${index}`} class="max-w-72" />
</ECList>

<br />
<br />
<br />

<ECList key="text3111" let:baseKey let:index>
  AAA<ECText key={`${baseKey}[title].${index}`} />
  BBB<ECText key={`${baseKey}[desc].${index}`} />
</ECList>
