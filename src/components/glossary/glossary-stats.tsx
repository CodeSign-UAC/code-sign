import { Card, CardContent } from '@/components/ui/card'
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
    <Card>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 divide-y sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4 lg:divide-y-0">
          <div className="p-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium text-muted-foreground">
                Total de términos
              </h3>
            </div>
            <p className="mt-2 text-3xl font-semibold tracking-tight">
              {totalTerms}
            </p>
          </div>

          <div className="p-6">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium text-muted-foreground">
                Temas
              </h3>
            </div>
            <p className="mt-2 text-3xl font-semibold tracking-tight">
              {totalTopics}
            </p>
          </div>

          <div className="p-6">
            <div className="flex items-center space-x-2">
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium text-muted-foreground">
                Subtemas
              </h3>
            </div>
            <p className="mt-2 text-3xl font-semibold tracking-tight">
              {totalSubtopics}
            </p>
          </div>

          <div className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium text-muted-foreground">
                Promedio
              </h3>
            </div>
            <p className="mt-2 text-3xl font-semibold tracking-tight">
              {averageTerms}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Términos por tema
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}