<script>
  import '../../app.css'
  import { pageData } from '$lib/stores/pageStore'
  import Footer from '$lib/components/Footer.svelte'
  import { isEditable } from '$lib/stores/editorStore'
  import { PenSquare, CloudDownload } from 'lucide-svelte'
  import { page } from '$app/stores'
  import { invalidateAll } from '$app/navigation'

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

  <main class="flex-1 max-w-lg mx-auto">
    {@render children()}
  </main>

  {#if $page.data.session}
    <div class="fixed bottom-4 right-4 flex gap-2">
      <button
        class="p-3 bg-slate-700 hover:bg-slate-800 rounded-full text-white shadow-lg"
        onclick={() => invalidateAll()}
      >
        <CloudDownload size={20} />
      </button>
      <button
        class="p-3 bg-slate-700 hover:bg-slate-800 rounded-full text-white shadow-lg"
        onclick={async () => {
          $isEditable = !$isEditable
          await invalidateAll()
        }}
      >
        <PenSquare size={20} class={$isEditable ? 'text-green-400' : ''} />
      </button>
    </div>
  {/if}

  <footer class="p-4 shadow">
    <Footer />

    {#if $page.data.session}
      <p>Welcome, {$page.data.session.user?.name}!</p>
      <form method="post" action="/auth/signout">
        <button type="submit">Sign out</button>
      </form>
    {:else}
      <p>Please sign in to access this content.</p>
      <form method="post" action="/auth/signin">
        <button type="submit">Sign in</button>
      </form>
    {/if}
  </footer>
</div>
