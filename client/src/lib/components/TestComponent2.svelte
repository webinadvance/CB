<script>
    /** @type {any} */
    export let pageData;

    $: params = pageData.routeParams || {};

    function getContent(key) {
        return pageData?.contentData?.[key]?.content || '';
    }
</script>

<div class="p-4">
    {#if pageData}
        <h2 class="text-xl font-semibold">{pageData.title}</h2>
        <div>Item: {params.item1}</div>
        <div>{@html getContent('main-content')}</div>
    {/if}
</div>