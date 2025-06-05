import type { Snippet } from './Snippet';

export interface Folder {
  id: string
  name: string
  description?: string
  parentId?: string
  children?: Folder[]
  snippets?: Snippet[] // Only present in leaf folders
}
