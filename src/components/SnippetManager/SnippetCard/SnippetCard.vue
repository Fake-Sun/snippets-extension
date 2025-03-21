<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardDescription,
  CardHeader,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Pencil, Trash2 } from 'lucide-vue-next'

interface Props {
  name: string,
  text: string,
  shortcut: string
}

const { name, text, shortcut } = defineProps<Props>()

const emit = defineEmits<{
  (e: 'delete-snippet', identifier: string): void
}>()

function deleteSnippet() {
  emit('delete-snippet', shortcut)
}
</script>

<template>
<div>
  <Card>
  <CardHeader class="gap-0">
    <div class="header-content">
      <Label for="cardDescription" class="nameLabel">{{ name }}</Label>
      <div class="iconsContainer">
        <Pencil :size="20" absoluteStrokeWidth />
        <Trash2 :size="20" absoluteStrokeWidth @click="deleteSnippet"/>
        <Badge class="shortcut-badge text-sm">
            <span class="badge-text">
              {{ shortcut }}
            </span>
        </Badge>
      </div>
    </div>
    <CardDescription class="snippet-text">{{ text }}</CardDescription>
  </CardHeader>
</Card>
</div>
</template>

<style scoped>
.iconsContainer svg {
  cursor: pointer;
  transition: transform 0.2s;
}

.iconsContainer svg:hover {
  transform: scale(1.1);
}

.nameLabel {
  display: inline-block;
  width: 20ch;
  overflow: hidden;       /* Optional: Hide overflowing text */
  text-overflow: ellipsis; /* Optional: Show ellipsis if needed */
  white-space: nowrap;     /* Optional: Prevent wrapping */
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
