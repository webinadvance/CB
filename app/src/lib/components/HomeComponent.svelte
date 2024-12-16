<script>
  import ECList from '$lib/components/ECList.svelte'
  import ECText from '$lib/components/ECText.svelte'
  import ECImage from '$lib/components/ECImage.svelte'
</script>

<div>HomeComponent.svelte</div>

<!--<ECImage key={`NEWWWWWWWWWWWWW`} class="max-w-72" />-->
<!--<br />-->
<!--<br />-->
<!--<ECText key={`NEWTEXTXXXX`} />-->

<!--<ECList-->
<!--  key="myBaseKeyB"-->
<!--  class="flex items-center content-center h-80"-->
<!--  let:baseKey-->
<!--  let:index-->
<!--&gt;-->
<!--  <ECImage key={`${baseKey}.${index}`} class="max-w-72" />-->
<!--</ECList>-->

<br />
<br />
<br />

<ECList key="A3" let:baseKey let:index>
  TITLE<ECText key={`${baseKey}[title].${index}`} />
  DESC<ECText key={`${baseKey}[desc].${index}`} />
</ECList>
