<script>
    import DynamicComponentLoader from '$lib/components/DynamicComponentLoader.svelte';

    /** @type {import('./$types').PageData} */
    export let data;
</script>

<div class="p-4">
    {#if data.page}
        <h2 class="text-xl font-semibold">{data.page.title}</h2>

        {#if data.page.componentName}
            <DynamicComponentLoader
                    componentName={data.page.componentName}
                    pageData={{
  ...data.page,
  routeParams: data.routeParams,
  placeholdersDictionary: data.page.contentData
}}
            />
        {/if}

        {@html data.page.contentData['main-content']?.content}
    {/if}
</div>