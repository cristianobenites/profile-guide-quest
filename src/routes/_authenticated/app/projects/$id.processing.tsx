import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/app/projects/$id/processing")({
  component: ProcessingPage,
  head: () => ({
    meta: [
      { title: "Processando · StraightCut" },
      { name: "description", content: "Processamento de projeto em andamento" },
    ],
  }),
});

function ProcessingPage() {
  const { id } = Route.useParams();

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-2xl">
        <Card className="p-12 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <h2 className="mt-4 text-xl font-semibold text-foreground">Processando apresentação</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Aguarde enquanto extraímos os slides, takeaways e evidências. Não feche esta aba.
          </p>
          <p className="mt-4 text-xs text-muted-foreground">Projeto: {id}</p>
          <Button asChild className="mt-6">
            <Link to="/app/projects">Voltar para biblioteca</Link>
          </Button>
        </Card>
      </div>
    </div>
  );
}
