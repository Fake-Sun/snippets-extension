<script setup lang="ts">
import { Button } from '@/components/ui/button'
import NewYorkH3 from '../../Typography/NewYorkH3.vue';

const emit = defineEmits<{ (e: 'toggle-add-snippet', value: boolean): void }>();

function onButtonClick() {
  // Emit event to update isAddSnippetActive.
  emit('toggle-add-snippet', true);
}

</script>

<template>
  <div class="contentWrapper">
    <div class="title">
      <NewYorkH3>No tienes snippets</NewYorkH3>
    </div>
    <div class="button">
      <Button @click="onButtonClick">Crear mi primer snippet</Button>
    </div>
  </div>
</template>

<style scoped>
.contentWrapper {
  display: grid;
  justify-content: center;
  align-items: center;
  min-width: 450px;
}

.title {
  padding: 5px;
  text-align: center;
}

.button {
  padding: 5px;
}
</style>