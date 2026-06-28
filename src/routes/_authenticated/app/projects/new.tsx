import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/_authenticated/app/projects/new")({
  component: NewProjectPage,
  head: () => ({
    meta: [
      { title: "Novo Projeto · StraightCut" },
      { name: "description", content: "Crie um novo projeto de síntese executiva" },
    ],
  }),
});

function NewProjectPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-3xl">
        <Link to="/app/projects" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          Voltar para biblioteca
        </Link>
        <h1 className="text-3xl font-semibold text-foreground mb-2">Novo Projeto</h1>
        <p className="text-muted-foreground mb-8">Wizard de criação em construção.</p>

        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Aqui virá o wizard de 4 etapas (Upload → Contexto → Config → Rodar).</p>
        </Card>
      </div>
    </div>
  );
}
