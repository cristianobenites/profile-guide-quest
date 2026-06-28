import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FileUp, Sparkles, Users, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  component: LandingPage,
  head: () => ({
    meta: [
      { title: "StraightCut · Síntese Executiva de Apresentações" },
      { name: "description", content: "Transforme apresentações longas em versões executivas com rastreabilidade total. Upload, takeaways, curadoria e PPT final editável." },
    ],
  }),
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground">StraightCut</span>
          </div>
          <Link to="/auth">
            <Button>Entrar</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-balance text-5xl font-bold leading-tight text-foreground sm:text-6xl">
            Sintetize apresentações executivas de forma eficiente
          </h1>
          <p className="mt-6 text-pretty text-xl leading-relaxed text-muted-foreground">
            Upload → Takeaways → Curadoria → PPT final editável com rastreabilidade total
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/auth">
              <Button size="lg" className="gap-2">
                Entrar
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border bg-card py-20">
        <div className="container mx-auto px-6">
          <h2 className="mb-12 text-center text-3xl font-semibold text-foreground">Como funciona</h2>
          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-border bg-background p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <FileUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">1. Upload de PPT/PDF</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Faça upload da sua apresentação em PowerPoint ou PDF. O sistema processa automaticamente.
              </p>
            </Card>

            <Card className="border-border bg-background p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                <Sparkles className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">2. Takeaways por slide</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                IA extrai os principais pontos de cada slide, consolidando insights com score e evidência.
              </p>
            </Card>

            <Card className="border-border bg-background p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10">
                <Users className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">3. Curadoria + narrativa</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Organize takeaways em grupos, ajuste a narrativa e use comandos conversacionais.
              </p>
            </Card>

            <Card className="border-border bg-background p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/10">
                <FileText className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">4. Export PPTX editável</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Baixe o deck final em PowerPoint totalmente editável, com todas as evidências rastreadas.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Confidencialidade:</strong> Não envie materiais sensíveis sem
            autorização prévia.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Contato: <span className="text-foreground">suporte@agentetakeaways.com</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
