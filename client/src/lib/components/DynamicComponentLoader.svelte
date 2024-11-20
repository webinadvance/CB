<script>
    /** @type {string} */
    export let componentName;

    import * as components from '$lib/components';

    $: Component = components[componentName];
</script>

{#if Component}
    <svelte:component this={Component}/>
{:else}
    <p>Component {componentName} not found</p>
{/if}