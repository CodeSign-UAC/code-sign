import { Book, GraduationCap, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { MstResource } from "@/modules/resource/resource.model";

interface Props {
  resources: MstResource[] | undefined
  isLoading: boolean
}

export default function Stats({ resources = [], isLoading }: Props): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap size={32} />
          <h1 className="text-xl font-semibold">¡Bienvenido a CodeSign!</h1>
        </CardTitle>
        <CardDescription>Aquí hay un breve desglose de tu progreso y actividad reciente.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {isLoading ? (
            Array.from(({ length: 2 })).map((_, index: number): React.JSX.Element => (
              <div key={index} className="flex items-center space-x-4 p-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[50px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))
          ) : renderStats(resources)}
        </div>
      </CardContent>
    </Card>
  )
}

const renderStats = (resources: MstResource[]) => {
  const addedResources = resources.length;

  const completedResources = resources.filter(r => r.has_completed).length;

  const courseProgress =
    addedResources > 0
      ? Math.round((completedResources / addedResources) * 100)
      : 0;

  return (
    <>
      <div className="flex items-center bg-blue-100 p-4 rounded-lg gap-3">
        <Book size={32} className="text-blue-600" />
        <div>
          <h2 className="text-lg font-bold">{addedResources}</h2>
          <p className="text-base font-normal">Recursos asignados</p>
        </div>
      </div>

      <div className="flex items-center bg-green-100 p-4 rounded-lg gap-3">
        <GraduationCap size={32} className="text-green-600" />
        <div>
          <h2 className="text-lg font-bold">{completedResources}</h2>
          <p className="text-base font-normal">Recursos completados</p>
        </div>
      </div>

      <div className="flex items-center bg-purple-100 p-4 rounded-lg gap-3">
        <TrendingUp size={32} className="text-purple-600" />
        <div>
          <h2 className="text-lg font-bold">{courseProgress}%</h2>
          <p className="text-base font-normal">Progreso del curso</p>
        </div>
      </div>
    </>
  );
};