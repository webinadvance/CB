<script>
  import EC from '$lib/components/EC.svelte'
  import { buildPageUrl } from '$lib/utils/url.js'
</script>

<div>HomeComponent.svelte</div>

<EC key="hero10" image class="max-w-sm inline-block h-48" />

<EC key="footer" pg="Common" class="bg-gray-700" />

<EC key="dataList" isList class="list-container">
  <div slot="item" let:item let:index>
    <EC key={`dataList.${index}.title`} />
    <EC key={`dataList.${index}.desc`} />
  </div>
</EC>

<div><a href={buildPageUrl('Dynamic')}>GO TO TEST</a></div>
