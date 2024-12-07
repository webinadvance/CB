<script>
  import "../app.css"
  import { i18n } from "$lib/i18n"
  
  let language = $state(i18n.language)
  
  function toggleLang() {
    language = language === "en" ? "it" : "en"
    i18n.changeLanguage(language)
  }
</script>

<div class="app">
  <div class="flex gap-2 items-center p-2">
    <button onclick={toggleLang}>Toggle Language</button>
    <span>Current: {language.toUpperCase()}</span>
  </div>
  <main>
    <slot />
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
