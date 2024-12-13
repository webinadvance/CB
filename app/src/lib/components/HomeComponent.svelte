<script>
  import EditableContent from '$lib/components/EditableContent.svelte'
</script>

<div>HomeComponent.svelte</div>
<EditableContent tag="h1" key="main-content" class="inline-block max-w-xl" />
<EditableContent tag="div" key="main-content-not-found" class="" />
<EditableContent key="footer" page="Common" class="inline-block" />

<EditableContent key="data" propName="title" />
