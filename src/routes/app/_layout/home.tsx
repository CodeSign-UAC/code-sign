import { ResourceStatus, type Resource } from '@/core/models'
import ResourceSection from '@/modules/home/components/resources-section'
import WelcomeSection from '@/modules/home/components/welcome-section'
import { createFileRoute } from '@tanstack/react-router'
import type { JSX } from 'react/jsx-runtime'

export const Route = createFileRoute('/app/_layout/home')({
  component: DashboardPage,
})

const resources: Array<Resource> = [
  {
    id: 1,
    title: "Introducción a la Ciencia de la Computación",
    type: "video",
    duration: "45:30",
    category: "Tutorial",
    status: ResourceStatus.Available,
    description: "Conceptos fundamentales de ciencias de la computación y programación",
  },
  {
    id: 2,
    title: "Manual de Estructuras de Datos",
    type: "document",
    category: "Referencia",
    status: ResourceStatus.Completed,
    description: "Guía completa de estructuras de datos y algoritmos",
  },
  {
    id: 3,
    title: "Tarea de Programación #3",
    type: "document",
    category: "Asignación",
    status: ResourceStatus.DueSoon,
    description: "Conceptos e implementación de programación orientada a objetos",
  },
  {
    id: 4,
    title: "Principios de Diseño de Bases de Datos",
    type: "video",
    duration: "32:15",
    category: "Tutorial",
    status: ResourceStatus.Available,
    description: "Aprende sobre los principios de diseño de bases de datos.",
  },
]

function DashboardPage(): JSX.Element {
  return (
    <div className='space-y-4'>
      <WelcomeSection />
      <ResourceSection resources={resources} />
    </div>
  )
}
