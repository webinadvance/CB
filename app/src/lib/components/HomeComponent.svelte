<script>
  import EC from '$lib/components/EC.svelte'
</script>

<div>HomeComponent.svelte</div>
<EC tag="h1" key="main-content" class="inline-block max-w-xl" />
<EC tag="div" key="main-content-not-found" class="" />
<EC key="footer" page="Common" class="inline-block" />

<EC key="data" propName="title" />
