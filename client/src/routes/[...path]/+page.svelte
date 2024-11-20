<script>
    import DynamicComponentLoader from '$lib/components/DynamicComponentLoader.svelte';

    /** @type {import('./$types').PageData} */
    export let data;
</script>

<div class="p-4">
    {#if data.page}
        <div class="mb-6">
            <h2 class="text-xl font-semibold">{data.page.title}</h2>

            <!-- Load the component specified in the page data -->
            {#if data.page.componentName}
                <DynamicComponentLoader
                        componentName={data.page.componentName}
                        pageData={data.page}
                />
            {/if}

            <!-- Render page content -->
            {@html data.page.placeholdersDictionary['main-content']?.content}
        </div>
    {/if}
</div>