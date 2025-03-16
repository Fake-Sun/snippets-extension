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
</script>

<template>
<div>
  <Card>
  <CardHeader class="gap-0">
    <div class="header-content">
      <Label for="cardDescription" class="nameLabel">{{ name }}</Label>
      <div class="iconsContainer">
        <Pencil :size="20" absoluteStrokeWidth />
        <Trash2 :size="20" absoluteStrokeWidth />
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
  width: 19ch; /* overall badge width */
}

.badge-text {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.snippet-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
