<script>
  import EC from '$lib/components/EC.svelte'
</script>

<div>HomeComponent.svelte</div>
<!--<EC tag="h1" key="main-content" class="inline-block max-w-xl" />-->
<!--<EC tag="div" key="main-content-not-found" class="" />-->
<EC key="footer" pg="Common" class="inline-block" />

<!-- Existing single EC components -->
<!--<EC key="data" p="title" />-->
<!--<EC key="data" p="desc" />-->

<!-- New list handling EC component -->
<EC key="dataList" isList class="list-container">
  <div slot="item" let:item let:index>
    <EC key={`dataList.${index}.title`} p="title" />
    <EC key={`dataList.${index}.desc`} p="desc" />
  </div>
</EC>
