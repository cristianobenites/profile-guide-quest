import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/_authenticated/app/projects/$id")({
  component: ProjectWorkspacePage,
  head: () => ({
    meta: [
      { title: "Workspace · StraightCut" },
      { name: "description", content: "Edite takeaways e curadoria do projeto" },
    ],
  }),
});

function ProjectWorkspacePage() {
  const { id } = Route.useParams();

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-4xl">
        <Link to="/app/projects" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          Voltar para biblioteca
        </Link>
        <h1 className="text-3xl font-semibold text-foreground mb-2">Workspace</h1>
        <p className="text-muted-foreground mb-8">Projeto: {id}</p>

        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Workspace 3 colunas em construção.</p>
        </Card>
      </div>
    </div>
  );
}
