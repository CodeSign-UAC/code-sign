import { createFileRoute } from '@tanstack/react-router'
import type { JSX } from 'react/jsx-runtime'
import type { Resource } from '@/core/models'
import { ResourceCategory } from '@/core/models/resource.model'
import ResourceSection from '@/modules/home/components/resources-section'
import WelcomeSection from '@/modules/home/components/welcome-section'

export const Route = createFileRoute('/app/_layout/home')({
  component: DashboardPage,
})

const resources: Array<Resource> = [
  {
    id: 1,
    title: 'Introducción a la Ciencia de la Computación',
    duration: '45:30',
    description:
      'Conceptos fundamentales de ciencias de la computación y programación',
    category: ResourceCategory.Tutorial,
    is_accesible: true,
    created_at: '2023-10-01',
    file_url: 'https://example.com/intro-to-cs.pdf',
  },
  {
    id: 2,
    title: 'Manual de Estructuras de Datos',
    category: ResourceCategory.Document,
    is_accesible: true,
    created_at: '2023-10-01',
    duration: '1:20:00',
    file_url: 'https://example.com/manual.pdf',
    description: 'Guía completa de estructuras de datos y algoritmos',
  },
  {
    id: 3,
    title: 'Tarea de Programación #3',
    description:
      'Conceptos e implementación de programación orientada a objetos',
    category: ResourceCategory.Tutorial,
    is_accesible: true,
    created_at: '2023-10-01',
    duration: '1:15:00',
    file_url: 'https://example.com/assignment3.pdf',
  },
  {
    id: 4,
    title: 'Principios de Diseño de Bases de Datos',
    duration: '32:15',
    description: 'Aprende sobre los principios de diseño de bases de datos.',
    category: ResourceCategory.Document,
    is_accesible: true,
    created_at: '2023-10-01',
    file_url: 'https://example.com/database-design.pdf',
  },
]

function DashboardPage(): JSX.Element {
  return (
    <div className="space-y-4">
      <WelcomeSection />
      <ResourceSection resources={resources} />
    </div>
  )
}
