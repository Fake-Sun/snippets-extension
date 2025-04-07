export interface Snippet {
  name: string
  text: string
  shortcut: string
  folderPath?: string[] // e.g., ['Home', 'Frontend', 'Vue']
}