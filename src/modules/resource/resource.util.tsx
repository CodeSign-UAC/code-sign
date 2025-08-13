import { FileTextIcon, GraduationCap, NotebookPen, Video } from 'lucide-react'

export const categoryValue: Record<number, string> = {
  [0]: 'Video',
  [1]: 'Documento',
  [2]: 'Asignación',
  [3]: 'Tutorial',
}

export const categoryIcon: Record<number, React.ReactNode> = {
  [0]: <Video />,
  [1]: <FileTextIcon />,
  [2]: <NotebookPen />,
  [3]: <GraduationCap />,
}
