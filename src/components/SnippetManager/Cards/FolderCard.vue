<script setup lang="ts">
import { Folder, ChevronRight } from 'lucide-vue-next'
import { Card, CardContent } from '@/components/ui/card'

defineProps<{
  name: string
}>()
</script>

<template>
  <Card class="cursor-pointer hover:bg-muted transition">
    <CardContent class="flex items-center justify-between p-4">
      <div class="flex items-center gap-3">
        <Folder class="text-primary" :size="20" />
        <span class="font-medium text-base truncate">{{ name }}</span>
      </div>
      <ChevronRight class="text-muted-foreground" :size="20" />
    </CardContent>
  </Card>
</template>