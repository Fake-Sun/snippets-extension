<script setup lang="ts">
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-vue-next'
import { useI18n } from '@/lib/i18n'

const { t } = useI18n()

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
  <AlertDialog>
    <AlertDialogTrigger as-child>
      <Button
        variant="ghost"
        size="icon"
        class="h-8 w-8 text-muted-foreground hover:text-destructive"
        :aria-label="t('deleteSnippet')"
      >
        <Trash2 :size="18" absoluteStrokeWidth />
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogDescription>
          {{ t('deleteSnippetConfirm', { name: snippetName }) }}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>{{ t('cancel') }}</AlertDialogCancel>
        <AlertDialogAction @click="confirmDelete">{{ t('delete') }}</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
