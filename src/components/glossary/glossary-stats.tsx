import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, FileText, FolderOpen, TrendingUp } from 'lucide-react'

interface GlossaryStatsProps {
  totalTerms: number
  totalTopics: number
  totalSubtopics: number
  averageTerms: number
}

export default function GlossaryStats({
  totalTerms,
  totalTopics,
  totalSubtopics,
  averageTerms
}: GlossaryStatsProps): React.JSX.Element {
  return (
    <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
      <Card className="border-blue-200 py-4 gap-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de términos</CardTitle>
          <FileText className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalTerms}</div>
          <p className="text-xs text-muted-foreground">Términos registrados</p>
        </CardContent>
      </Card>

      <Card className="border-green-200 py-4 gap-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Temas</CardTitle>
          <BookOpen className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalTopics}</div>
          <p className="text-xs text-muted-foreground">Categorías principales</p>
        </CardContent>
      </Card>

      <Card className="border-purple-200 py-4 gap-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Subtemas</CardTitle>
          <FolderOpen className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalSubtopics}</div>
          <p className="text-xs text-muted-foreground">Subcategorías</p>
        </CardContent>
      </Card>

      <Card className="border-amber-200 py-4 gap-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Promedio</CardTitle>
          <TrendingUp className="h-4 w-4 text-amber-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageTerms}</div>
          <p className="text-xs text-muted-foreground">Términos por tema</p>
        </CardContent>
      </Card>
    </div>
  )
}