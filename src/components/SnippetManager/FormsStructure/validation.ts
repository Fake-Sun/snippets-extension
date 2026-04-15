import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import type { Snippet } from '../../../types/Snippet'
import type { SnippetValidationMessages } from '@/lib/i18n'

export function createSnippetFormSchema(snippets: Snippet[], snippetId: string | undefined, messages: SnippetValidationMessages) {
  return toTypedSchema(z.object({
    name: z.string({
      required_error: messages.nameRequired,
    }).min(3, messages.nameMin)
      .max(50, messages.nameMax)
      .transform(value => value.replace(/[\r\n]+/g, ' ')),

    shortcut: z.string({
      required_error: messages.shortcutRequired,
    })
      .min(3, messages.shortcutMin)
      .max(20, messages.shortcutMax)
      .startsWith('/', messages.shortcutSlash)
      .regex(/^\/\S*$/, messages.shortcutSpaces)
      .refine((value) => {
        return !snippets.some(snippet => snippet.shortcut === value && snippet.id !== snippetId)
      }, {
        message: messages.shortcutExists,
      })
      .transform(value => value.toLowerCase()),

    text: z.string({
      required_error: messages.textRequired,
    }).min(2, messages.textMin)
      .max(1000, messages.textMax),

    folderId: z.string().optional(),
  }))
}
