<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardDescription,
  CardHeader,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import type { Snippet } from '@/types/Snippet';
import { Pencil, Trash2 } from 'lucide-vue-next'

const snippet = defineProps<Snippet>()

const emit = defineEmits<{
  (e: 'delete-snippet', identifier: string): void
  (e: 'edit-snippet', snippet: Snippet): void
}>()

function deleteSnippet() {
  emit('delete-snippet', snippet.shortcut)
}

function editSnippet() {
  emit('edit-snippet', snippet)
}
</script>

<template>
<Card>
  <CardHeader class="gap-0 p-4">
    <div class="header-content">
      <Label for="cardDescription" class="nameLabel">{{ snippet.name }}</Label>
      <div class="iconsContainer">
        <Pencil :size="20" absoluteStrokeWidth @click="editSnippet"/>
        <Trash2 :size="20" absoluteStrokeWidth @click="deleteSnippet"/>
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
.iconsContainer svg {
  cursor: pointer;
  transition: transform 0.15s;
}

.iconsContainer svg:hover {
  transform: scale(1.2);
}

.nameLabel {
  display: inline-block;
  width: 20ch;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.4;       /* Adjust line height as needed */
  padding-top: 2px;       /* Add some padding if letters are clipped */
  vertical-align: middle; /* Ensure it's aligned properly */
}
.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 32px;
  gap: 0px;
}
.iconsContainer {
  align-items: center;
  justify-content: center;
  display:flex;
  gap: 5px;
}
.shortcut-badge {
  box-sizing: border-box;
  max-width: 19ch; /* overall badge width */
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
