<script>
  import ECList from '$lib/components/ECList.svelte'
  import ECText from '$lib/components/ECText.svelte'
  import ECImage from '$lib/components/ECImage.svelte'
</script>

<div>HomeComponent.svelte</div>

<ECList
  key="myBaseKeyB"
  class="flex items-center content-center h-80"
  let:baseKey
  let:index
>
  <ECImage key={`${baseKey}.${index}`} class="max-w-72" />
</ECList>

<br />
<br />
<br />

<!--<ECList key="textError2" let:baseKey let:index>-->
<!--  TITLE<ECText key={`${baseKey}[title].${index}`} />-->
<!--  DESC<ECText key={`${baseKey}[desc].${index}`} />-->
<!--</ECList>-->
