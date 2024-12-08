<script>
  import '../app.css'
  let { children } = $props()
</script>

<div class="flex flex-col min-h-screen">
  <header class="p-4">
    <div class="w-full mx-auto flex justify-between items-center">
      <img src="/logo.png" alt="Logo" class="h-12" />
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
    <div class="text-center">© 2024 Palazzo Odescalchi</div>
  </footer>
</div>
