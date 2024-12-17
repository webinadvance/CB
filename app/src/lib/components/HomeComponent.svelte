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
<!--  let:key-->
<!--  let:index-->
<!--&gt;-->
<!--  <ECImage key={`${key}.${index}`} class="max-w-72" />-->
<!--</ECList>-->

<!--<br />-->
<!--<br />-->
<!--<br />-->

<!--<ECList key="A8" let:key let:index>-->
<!--  TITLE<ECText key={`${key}.${index}`} />-->
<!--  &lt;!&ndash;  DESC<ECText key={`${key}[desc].${index}`} />&ndash;&gt;-->
<!--</ECList>-->

<!--<ECList key="TEST1" let:key let:index class="max-w-sm m-auto">-->
<!--  A<ECText key={`${key}[A].${index}`} />-->
<!--  B<ECText key={`${key}[B].${index}`} />-->
<!--  <div class="mb-4"></div>-->
<!--</ECList>-->

<!--<br />-->
<!--<br />-->

<ECList key="A13" let:key let:index>
  TITLE:<ECText {key} {index} elementTag="title" tag="div" />
  DESC:<ECText {key} {index} elementTag="desc" tag="div" />
  <br />
  <br />
</ECList>

<!--<div>STANDALONE</div>-->
<!--<ECText key={`myKey`} />-->
