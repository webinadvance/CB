<script>
  import { BaseComponent } from '$lib'
  import EditableContent from './EditableContent.svelte'
</script>

<BaseComponent {...$$props}>
  <EditableContent key="main-content" pageTitle="Home" isEditing={true} />
  <EditableContent key="main-content" isEditing={false} />
</BaseComponent>
