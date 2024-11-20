<script>
    /** @type {any} */
    export let pageData;

    $: params = pageData.routeParams || {};
</script>

<div class="p-4">
    {#if pageData}
        <h2 class="text-xl font-semibold">{pageData.title}</h2>

        <!-- Direct param access -->
        <div>Item: {params.item1}</div>

        <div>{@html pageData.placeholdersDictionary['main-content']?.content}</div>
    {/if}
</div>