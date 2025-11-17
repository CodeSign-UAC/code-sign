import { Book, GraduationCap, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { MstResource } from "@/modules/resource/resource.model";

interface Props {
  resources: MstResource[] | undefined
  isLoading: boolean
}

export default function Stats({
  resources = [],
  isLoading,
}: Props): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-semibold">
          <GraduationCap size={28} />
          <span>¡Bienvenido a CodeSign!</span>
        </CardTitle>
        <CardDescription>
          Aquí hay un breve desglose de tu progreso y actividad reciente.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {isLoading ? (
            <>
              <StatSkeleton />
              <StatSkeleton />
            </>
          ) : (
            renderStats(resources)
          )}
        </div>
      </CardContent>
    </Card>
  )
}

const renderStats = (resources: MstResource[]) => {
  const addedResources: number = resources.length || 0;
  const courseProgress: number = 0; {/* En base a has_completed */ }

  return (
    <>
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
          <Book size={24} />
        </div>
        <div>
          <div className="text-2xl font-bold">{addedResources}</div>
          <p className="text-sm text-muted-foreground">Recursos asignados</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
          <TrendingUp size={24} />
        </div>
        <div>
          <div className="text-2xl font-bold">{courseProgress}%</div>
          <p className="text-sm text-muted-foreground">Progreso del curso</p>
        </div>
      </div>
    </>
  )
}

const StatSkeleton = (): React.JSX.Element => (
  <div className="flex items-center gap-4">
    <Skeleton className="h-12 w-12 rounded-lg" />
    <div className="space-y-2">
      <Skeleton className="h-7 w-[50px]" />
      <Skeleton className="h-4 w-[150px]" />
    </div>
  </div>
)