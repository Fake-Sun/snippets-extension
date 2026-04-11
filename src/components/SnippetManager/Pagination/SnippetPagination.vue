<script setup lang="ts">
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps<{
  page: number
  total: number
  itemsPerPage: number
}>()

const emit = defineEmits<{
  (e: 'update:page', page: number): void
}>()

const pageCount = computed(() => Math.max(1, Math.ceil(props.total / props.itemsPerPage)))
const pages = computed(() => Array.from({ length: pageCount.value }, (_, index) => index + 1))

function goToPage(page: number) {
  const nextPage = Math.min(Math.max(page, 1), pageCount.value)
  emit('update:page', nextPage)
}
</script>

<template>
  <nav class="flex items-center justify-center gap-2" aria-label="Paginación de snippets">
    <Button
      v-if="props.page > 1"
      variant="outline"
      size="icon"
      class="h-7 w-7"
      aria-label="Página anterior"
      @click="goToPage(props.page - 1)"
    >
      <ChevronLeft :size="15" absoluteStrokeWidth />
    </Button>

    <div class="flex items-center gap-1">
      <Button
        v-for="pageNumber in pages"
        :key="pageNumber"
        class="h-7 w-7 p-0 text-xs"
        :variant="pageNumber === props.page ? 'default' : 'outline'"
        :aria-label="`Página ${pageNumber}`"
        @click="goToPage(pageNumber)"
      >
        {{ pageNumber }}
      </Button>
    </div>

    <Button
      v-if="props.page < pageCount"
      variant="outline"
      size="icon"
      class="h-7 w-7"
      aria-label="Página siguiente"
      @click="goToPage(props.page + 1)"
    >
      <ChevronRight :size="15" absoluteStrokeWidth />
    </Button>
  </nav>
</template>