<script>
  import ECList from '$lib/components/ECList.svelte'
  import ECText from '$lib/components/ECText.svelte'
</script>

<div>HomeComponent.svelte</div>

<!--<br />-->
<!--<br />-->

<!--<ECList key="A14" let:key let:index let:canDelete>-->
<!--  TITLE:<ECText {canDelete} {key} {index} elementTag="title" tag="div" />-->
<!--  DESC:<ECText {canDelete} {key} {index} elementTag="desc" tag="div" />-->
<!--  <br />-->
<!--  <br />-->
<!--</ECList>-->

<!--<br />-->
<!--<br />-->

<ECText key={`myKey`} />
