<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardHeader,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import type { Snippet } from '@/types/Snippet';
import { Pencil } from 'lucide-vue-next'
import DeleteSnippetButton from '../DeleteSnippetButton/DeleteSnippetButton.vue';

const snippet = defineProps<Snippet>()

const emit = defineEmits<{
  (e: 'delete-snippet', identifier: string): void
  (e: 'edit-snippet', snippet: Snippet): void
}>()

function deleteSnippet() {
  emit('delete-snippet', snippet.id)
}

function editSnippet() {
  emit('edit-snippet', snippet)
}
</script>

<template>
  <Card class="overflow-hidden">
    <CardHeader class="gap-0 px-3.5 py-3">
      <div class="flex min-h-8 items-center justify-between gap-2">
        <Label for="cardDescription" class="line-clamp-1 flex-1 leading-5">{{ snippet.name }}</Label>
        <div class="flex shrink-0 items-center justify-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            class="h-8 w-8 text-muted-foreground hover:text-foreground"
            aria-label="Editar snippet"
            @click="editSnippet"
          >
            <Pencil :size="18" absoluteStrokeWidth />
          </Button>
          <DeleteSnippetButton
            :snippet-id="snippet.id"
            :snippet-name="snippet.name"
            @confirm-delete="deleteSnippet"
          />
          <Badge class="shortcut-badge text-sm">
            <span class="badge-text">
              {{ snippet.shortcut }}
            </span>
          </Badge>
        </div>
      </div>
      <CardDescription class="snippet-text">{{ snippet.text }}</CardDescription>
    </CardHeader>
  </Card>
</template>

<style scoped>
.shortcut-badge {
  box-sizing: border-box;
  max-width: 19ch;
}
.badge-text {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 12px;
  pointer-events: none;
}
.snippet-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 12px;
  pointer-events: none;
}
</style>
