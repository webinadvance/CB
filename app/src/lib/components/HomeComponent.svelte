<script>
  import ECImage from '$lib/components/ECImage.svelte'
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

<ECText class="max-w-xl m-auto" key={`myKey`} />

<br />
<br />

<!--<ECList key="MY-IMAGES" class="inline-block" let:key let:index>-->
<!--  <ECImage {key} {index} />-->
<!--</ECList>-->

<!--<ECList key="MY-IMAGES-WITH-TAG" class="inline-block" let:key let:index>-->
<!--  <ECImage class="w-72" {key} {index} tag="image1" />-->
<!--  <ECImage class="w-72" {key} {index} tag="image2" />-->
<!--  <ECText {key} {index} elementTag="title1" />-->
<!--</ECList>-->

<!--<ECImage class="max-w-xl m-auto" key={`MY-IMAGES-SINGLE`} />-->
