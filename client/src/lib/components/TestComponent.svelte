<script>
  let count = $state(0);

  function increment() {
    count++;
  }
</script>

<div>
  <h2>Test Component</h2>
  <p>Current count: {count}</p>
  <button on:click={increment}>Increment</button>
</div>
