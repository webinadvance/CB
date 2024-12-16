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

<!--<br />-->
<!--<br />-->
<!--<br />-->

<!--<ECList key="A8" let:baseKey let:index>-->
<!--  TITLE<ECText key={`${baseKey}.${index}`} />-->
<!--  &lt;!&ndash;  DESC<ECText key={`${baseKey}[desc].${index}`} />&ndash;&gt;-->
<!--</ECList>-->

<ECList key="TEST1" let:baseKey let:index>
  A<ECText key={`${baseKey}[A].${index}`} />
  B<ECText key={`${baseKey}[B].${index}`} />
  <div class="mb-4"></div>
</ECList>

<!--<br />-->
<!--<br />-->

<!--<ECList key="A13" let:baseKey let:index>-->
<!--  <ECText key={`${baseKey}[title].${index}`} />-->
<!--  <ECText key={`${baseKey}[sub].${index}`} />-->
<!--</ECList>-->

<!--<div>STANDALONE</div>-->
<!--<ECText key={`myKey`} />-->
