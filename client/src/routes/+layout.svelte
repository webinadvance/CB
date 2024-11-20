<script>
  import '../app.css'

  /** @type {import('./$types').LayoutData} */
  let { children } = $props() // Destructure 'children' from props
</script>

<div class="app">
  <main>
    {@render children()}
  </main>
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
  }
</style>
