<script>
  import ECList from '$lib/components/ECList.svelte'
  import ECText from '$lib/components/ECText.svelte'
  import ECImage from '$lib/components/ECImage.svelte'
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

<!--<ECText class="max-w-xl m-auto" key={`myKey`} />-->

<br />
<br />

<ECImage class="max-w-xl m-auto" key={`myImage`} />
