<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-vue-next';

const emit = defineEmits<{
  (e: 'add-snippet', value: boolean): void;
}>();

const emitNewSnippet = () => {
  emit('add-snippet', true);
}

const { isAddSnippetActive } = defineProps<{
  isAddSnippetActive: boolean
}>();

</script>

<template>
  <header class="flex h-14 w-full items-center justify-between border-b bg-primary px-4 text-primary-foreground shadow-sm">
    <img src="../assets/SnipplyLogo.png" alt="Snipply Logo" class="bgElement h-auto w-28" />
    <Button
      v-if="!isAddSnippetActive"
      variant="outline"
      size="icon"
      class="h-8 w-8 border-primary-foreground/80 bg-primary text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
      aria-label="Crear snippet"
      @click="emitNewSnippet"
    >
      <Plus :size="20" absoluteStrokeWidth />
    </Button>
  </header>
</template>

<style scoped>
.bgElement {
  pointer-events: none;
  user-select: none;
}
</style>