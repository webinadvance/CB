<script>
  import '../app.css'
  import { pageData } from '$lib/stores/pageStore'
  import Footer from '$lib/components/Footer.svelte'
  let { children } = $props()

  const data = $derived($pageData)

  $effect(() => {
    if ($pageData) console.log('Page Data:', $pageData)
  })
</script>

<div class="flex flex-col min-h-screen">
  <header class="p-4">
    <div class="w-full mx-auto flex justify-between items-center">
      <nav>
        <ul class="flex gap-4">
          <li><a href="/home" class="hover:underline">Home</a></li>
          <li><a href="/gallery" class="hover:underline">Gallery</a></li>
          <li><a href="/contact" class="hover:underline">Contact</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <main class="flex-1 w-full mx-auto p-4 text-center">
    {@render children()}
  </main>

  <footer class="p-4 shadow">
    <Footer />
  </footer>
</div>
