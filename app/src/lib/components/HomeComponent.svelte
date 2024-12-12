<script>
  import { BaseComponent, getMediaPreviewUrl } from '$lib'
  let src = getMediaPreviewUrl(1)

  let testContent = {
    pageTitle: 'Home',
    key: 'test-key',
    value: 'Test Content EN',
  }

  let fetchedContent = null
  let updateStatus = null

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

  const addContent = async () => {
    const response = await callApi('/api/content', 'POST', testContent)
    console.log('Added Content:', response)
    return response
  }

  const updateContent = async (id) => {
    const response = await callApi('/api/content', 'PUT', {
      id,
      value: 'Updated Content IT',
    })
    updateStatus = response
    console.log('Updated Content:', response)
  }

  const runTests = async () => {
    const added = await addContent()
    if (added?.id) {
      await updateContent(added.id)
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
