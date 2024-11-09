<script>
  import TestComponent from '$lib/components/TestComponent.svelte';
  let { data } = $props();
</script>

<div class="p-4">
  <h1 class="text-2xl font-bold mb-4">Test Page</h1>

  {#if data.page}
    <div class="mb-6">
      <h2 class="text-xl font-semibold">{data.page.title}</h2>
      {@html data.page.placeholdersDictionary['main-content']?.content}
    </div>
  {/if}

  <TestComponent />

  <a class="text-blue-500 hover:underline mt-4" href="/">Back to Home</a>
</div>
