import type { TopicGlossariesDto } from "@/modules/glossary/glossary.model"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import CreateGlossary from "./create-glossary"
import { DialogClose } from "@radix-ui/react-dialog"

interface Props {
  glossary: TopicGlossariesDto
}

export default function GlossaryActions({ glossary }: Props): React.JSX.Element {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="mr-2">
          Añadir término
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="mb-2">
          <DialogTitle>
            Añadir término al glosario: <span className="text-blue-500">{glossary.topic}</span>
          </DialogTitle>
        </DialogHeader>
        <CreateGlossary id_topic={glossary.id_topic} />
        <DialogFooter>
          <Button type="submit" form="create-glossary-form">Añadir término</Button>
          <DialogClose asChild>
            <Button variant="outline">
              Cancelar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}