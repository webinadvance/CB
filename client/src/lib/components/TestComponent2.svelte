<script>
    /** @type {any} */
    export let pageData;
</script>

<div class="p-4">
    {#if pageData}
        <h2 class="text-xl font-semibold">{pageData.title}</h2>
        <div>{@html pageData.placeholdersDictionary['main-content']?.content}</div>
    {/if}
</div>