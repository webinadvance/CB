<script>
  import '../app.css'
  import { pageData } from '$lib/stores/pageStore'
  import Footer from '$lib/components/Footer.svelte'
  import { isEditable } from '$lib/stores/editorStore'
  import { PenSquare } from 'lucide-svelte'

  let { children } = $props()

  const data = $derived($pageData)
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

  <button
    class="fixed bottom-4 right-4 p-3 bg-slate-700 hover:bg-slate-800 rounded-full text-white shadow-lg transition-colors"
    onclick={() => {
      $isEditable = !$isEditable
    }}
  >
    <PenSquare size={20} class={$isEditable ? 'text-green-400' : ''} />
  </button>

  <footer class="p-4 shadow">
    <Footer />
  </footer>
</div>
