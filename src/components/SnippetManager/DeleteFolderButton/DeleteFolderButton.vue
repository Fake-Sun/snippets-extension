<script setup lang="ts">
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-vue-next'

const props = defineProps<{
  folderId: string
  folderName: string
}>()

const emit = defineEmits<{
  (e: 'confirm-delete', id: string): void
}>()

function confirmDelete() {
  emit('confirm-delete', props.folderId)
}
</script>

<template>
  <AlertDialog>
    <AlertDialogTrigger as-child>
      <Button
        variant="ghost"
        size="icon"
        class="h-8 w-8 text-muted-foreground hover:text-destructive"
        aria-label="Eliminar carpeta"
        title="Eliminar carpeta"
      >
        <Trash2 :size="16" absoluteStrokeWidth />
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogDescription>
          Eliminar la carpeta <strong>{{ folderName }}</strong>? Los snippets de esta carpeta quedarán sin carpeta.
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