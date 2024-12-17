<script>
  import ECList from '$lib/components/ECList.svelte'
  import ECText from '$lib/components/ECText.svelte'
</script>

<div>HomeComponent.svelte</div>

<ECList key="A13" let:key let:index>
  TITLE:<ECText {key} {index} elementTag="title" tag="div" />
  DESC:<ECText {key} {index} elementTag="desc" tag="div" />
  <br />
  <br />
</ECList>

<!--<br />-->
<!--<br />-->

<!--<ECList key="A14" let:key let:index>-->
<!--  TITLE:<ECText {key} {index} elementTag="title" tag="div" />-->
<!--  DESC:<ECText {key} {index} elementTag="desc" tag="div" />-->
<!--  <br />-->
<!--  <br />-->
<!--</ECList>-->

<!--<br />-->
<!--<br />-->

<!--<ECText key={`myKey`} />-->
