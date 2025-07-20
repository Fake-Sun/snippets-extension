<script setup lang="ts">
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog'
import { Trash2 } from 'lucide-vue-next'

const props = defineProps<{
  snippetId: string
  snippetName: string
}>()

const emit = defineEmits<{
  (e: 'confirm-delete', id: string): void
}>()

function confirmDelete() {
  emit('confirm-delete', props.snippetId)
}
</script>

<template>
  <AlertDialog >
    <AlertDialogTrigger as-child>
      <Trash2 :size="20" absoluteStrokeWidth />
    </AlertDialogTrigger>
    <AlertDialogContent >
      <AlertDialogHeader >
        <AlertDialogDescription>
          Eliminar el snippet <strong>{{ snippetName }}</strong>?
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
        <AlertDialogAction @click="confirmDelete">
          Eliminar
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
