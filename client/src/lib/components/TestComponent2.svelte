<script>
    /** @type {any} */
    export let pageData;
    import { getContent } from '$lib/actions/content.js';

    $: params = pageData.routeParams || {};
    const content = getContent();
</script>

<div class="p-4">
    {#if pageData}
        <h2 class="text-xl font-semibold">{pageData.title}</h2>
        <div>Item: {params.item1}</div>
        <div>{@html content('main-content')}</div>
    {/if}
</div>