<script>
  import EC from '$lib/components/EC.svelte'
  import { buildPageUrl } from '$lib/utils/url.js'
</script>

<div>TestComponent2.svelte</div>
<EC key="footer" tag="span" pg="Common" class="bg-gray-700" />

<EC key="dataList" isList class="list-container">
  <div slot="item" let:item let:index>
    <EC key={`dataList.${index}.title`} class="bg-gray-700" />
    <EC key={`dataList.${index}.desc`} />
  </div>
</EC>

<div><a href={buildPageUrl('Home')}>GO TO HOME</a></div>
