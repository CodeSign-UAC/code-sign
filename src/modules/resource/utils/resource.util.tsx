import { Binoculars, FileTextIcon } from "lucide-react";

// export const statusTag: Record<ResourceStatus, React.JSX.Element> = {
//   [ResourceStatus.Available]: (
//     <span className="text-green-600 text-sm font-medium bg-green-50 px-2 rounded-lg">
//       Disponible
//     </span>
//   ),
//   [ResourceStatus.DueSoon]: (
//     <span className="text-yellow-600 text-sm font-medium bg-yellow-50 px-2 rounded-lg">
//       Próximo a vencer
//     </span>
//   ),
//   [ResourceStatus.Completed]: (
//     <span className="text-blue-600 text-sm font-medium bg-blue-50 px-2 rounded-lg">
//       Completado
//     </span>
//   )
// }

export const categoryValue: Record<number, string> = {
  [0]: 'Video',
  [1]: 'Documento',
  [2]: 'Asignación',
  [3]: 'Tutorial'
}

export const categoryIcon: Record<number, React.ReactNode> = {
  [0]: <FileTextIcon />,
  [1]: <Binoculars />
}