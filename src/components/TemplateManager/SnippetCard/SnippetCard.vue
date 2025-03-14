<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardDescription,
  CardHeader,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'

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
    <CardHeader>
      <div class="header-content">
        <Label for="cardDescription">{{ name }}</Label>
        <Badge class="shortcut-badge text-sm">{{ "/" + shortcut }}</Badge>
      </div>
      <CardDescription class="snippet-text">{{ text }}</CardDescription>
    </CardHeader>
  </Card>
  </div>
</template>

<style scoped>
.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.shortcut-badge {
  margin-left: 1rem;
}

.snippet-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
