import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, GraduationCap, TrendingUp } from "lucide-react";
import type { JSX } from "react";

export default function WelcomeSection(): JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap size={32} />
          <h1 className="text-xl font-semibold">¡Bienvenido a CodeSign!</h1>
        </CardTitle>
        <CardDescription>
          Aquí hay un breve desglose de tu progreso y actividad reciente.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="flex items-center bg-blue-100 p-4 rounded-lg gap-3">
            <Book size={32} className="text-blue-600" />
            <div>
              <h2 className="text-lg font-bold">12</h2>
              <p className="text-base text-muted-foreground">Recursos accedidos</p>
            </div>
          </div>
          <div className="flex items-center bg-purple-100 p-4 rounded-lg gap-3">
            <TrendingUp size={32} className="text-purple-600" />
            <div>
              <h2 className="text-lg font-bold">60%</h2>
              <p className="text-base text-muted-foreground">Progreso del curso</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}