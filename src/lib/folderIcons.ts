import type { Component } from 'vue'
import {
  Archive,
  BookOpen,
  Bookmark,
  Briefcase,
  Calendar,
  Code2,
  FileText,
  Folder,
  Inbox,
  Lightbulb,
  MessageSquare,
  Rocket,
  Settings,
  Sparkles,
  Star,
  Tag,
  Terminal,
  Wrench,
} from 'lucide-vue-next'

export type FolderIconName =
  | 'folder'
  | 'inbox'
  | 'code'
  | 'briefcase'
  | 'book'
  | 'star'
  | 'archive'
  | 'bookmark'
  | 'calendar'
  | 'file'
  | 'idea'
  | 'message'
  | 'rocket'
  | 'settings'
  | 'sparkles'
  | 'tag'
  | 'terminal'
  | 'tools'

export interface FolderIconOption {
  name: FolderIconName
  label: string
  icon: Component
}

export const folderIconOptions: FolderIconOption[] = [
  { name: 'folder', label: 'Carpeta', icon: Folder },
  { name: 'inbox', label: 'Bandeja', icon: Inbox },
  { name: 'code', label: 'Código', icon: Code2 },
  { name: 'briefcase', label: 'Trabajo', icon: Briefcase },
  { name: 'book', label: 'Notas', icon: BookOpen },
  { name: 'star', label: 'Favoritos', icon: Star },
  { name: 'archive', label: 'Archivo', icon: Archive },
  { name: 'bookmark', label: 'Marcador', icon: Bookmark },
  { name: 'calendar', label: 'Calendario', icon: Calendar },
  { name: 'file', label: 'Documento', icon: FileText },
  { name: 'idea', label: 'Idea', icon: Lightbulb },
  { name: 'message', label: 'Mensajes', icon: MessageSquare },
  { name: 'rocket', label: 'Proyecto', icon: Rocket },
  { name: 'settings', label: 'Ajustes', icon: Settings },
  { name: 'sparkles', label: 'Especial', icon: Sparkles },
  { name: 'tag', label: 'Etiqueta', icon: Tag },
  { name: 'terminal', label: 'Terminal', icon: Terminal },
  { name: 'tools', label: 'Herramientas', icon: Wrench },
]

export function getFolderIcon(iconName?: FolderIconName): Component {
  return folderIconOptions.find(option => option.name === iconName)?.icon ?? Folder
}