<script>
    import DynamicComponentLoader from '$lib/components/DynamicComponentLoader.svelte';
    import {setContent} from '$lib/actions/content.js';

    /** @type {import('./$types').PageData} */
    export let data;

    $: content = setContent(data.page);
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
    {/if}
</div>