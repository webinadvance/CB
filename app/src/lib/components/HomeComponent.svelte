<script>
  import EC from '$lib/components/EC.svelte'
</script>

<div>HomeComponent.svelte</div>
<EC key="footer" pg="Common" class="inline-block" />

<EC key="dataList" isList class="list-container">
  <div slot="item" let:item let:index>
    <EC key={`dataList.${index}.title`} p="title" />
    <EC key={`dataList.${index}.desc`} p="desc" />
  </div>
</EC>
