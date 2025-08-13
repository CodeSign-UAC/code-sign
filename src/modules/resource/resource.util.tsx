import { FileTextIcon, GraduationCap, NotebookPen, Video } from 'lucide-react'

export const categoryValue: Record<number, string> = {
  [1]: 'Video',
  [2]: 'Documento',
  [3]: 'Asignación',
  [4]: 'Tutorial',
}

export const categoryIcon: Record<number, React.ReactNode> = {
  [1]: <Video />,
  [2]: <FileTextIcon />,
  [3]: <NotebookPen />,
  [4]: <GraduationCap />,
}
