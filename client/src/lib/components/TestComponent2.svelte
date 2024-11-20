<script>
    /** @type {any} */
    export let pageData;

    $: routeParams = pageData.routeParams || [];
</script>

<div class="p-4">
    {#if pageData}
        <h2 class="text-xl font-semibold">{pageData.title}</h2>
        <div>{@html pageData.placeholdersDictionary['main-content']?.content}</div>

        <!-- Access route params -->
        {#if routeParams.length}
            <div class="mt-4">
                <h3>Route Params:</h3>
                <ul>
                    {#each routeParams as param, i}
                        <li>Param {i}: {param}</li>
                    {/each}
                </ul>
            </div>
        {/if}
    {/if}
</div>