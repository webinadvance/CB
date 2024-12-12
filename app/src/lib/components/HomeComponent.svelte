<script>
  import { BaseComponent, getMediaPreviewUrl } from '$lib'
  let src = getMediaPreviewUrl(1)

  // Test content data
  let testContent = {
    pageTitle: 'Home',
    key: 'test-key',
    value: 'Test Content EN',
  }

  let fetchedContent = null
  let updateStatus = null

  // Helper function for API calls
  const callApi = async (url, method, body = null) => {
    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : null,
      })
      return response.ok
        ? await response.json()
        : Promise.reject(await response.json())
    } catch (error) {
      console.error('API Error:', error)
    }
  }

  // Test: Add new content
  const addContent = async () => {
    const response = await callApi('/api/content', 'POST', testContent)
    console.log('Added Content:', response)
    return response
  }

  // Test: Get content by ID
  const getContent = async (id) => {
    const response = await callApi(`/api/content?id=${id}`, 'GET')
    fetchedContent = response
    console.log('Fetched Content:', response)
  }

  // Test: Update content
  const updateContent = async (id) => {
    const updatedValue = {
      en: fetchedContent.value.en,
      it: 'Contenuto IT',
    }

    const response = await callApi('/api/content', 'PUT', {
      id,
      value: updatedValue,
    })
    updateStatus = response
    console.log('Updated Content:', response)
  }

  // Run tests on mount
  const runTests = async () => {
    const added = await addContent()
    if (added?.id) {
      await getContent(added.id)
      await updateContent(added.id)
      await getContent(added.id) // Fetch again to confirm update
    }
  }

  runTests()
</script>

<BaseComponent {...$$props} let:pageData let:params let:content>
  <div>HomeComponent.svelte</div>
  <div>{content('main-content')}</div>
  <div>{content('footer', 'Common')}</div>
  <div>{src}</div>
  <div>
    <h3>Test Results:</h3>
    <p>Fetched Content: {JSON.stringify(fetchedContent)}</p>
    <p>Update Status: {updateStatus}</p>
  </div>
</BaseComponent>
