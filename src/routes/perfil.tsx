import { createFileRoute } from "@tanstack/react-router";
import { Nav, Footer } from "@/components/Nav";
import { QuestionnaireFlow } from "@/components/QuestionnaireFlow";
import { perfilQuestions } from "@/lib/questions";

export const Route = createFileRoute("/perfil")({
  validateSearch: (search: Record<string, unknown>) => ({
    start: search.start === true || search.start === "true" || search.start === "1" || search.start === 1,
  }),
  component: PerfilPage,
  head: () => ({
    meta: [
      { title: "Triagem de Conhecimento · Axioma IA" },
      { name: "description", content: "Triagem rápida com 10 perguntas para mapear seu nível atual de conhecimento em IA." },
    ],
  }),
});

function PerfilPage() {
  const { start } = Route.useSearch();

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <QuestionnaireFlow
        tipo="perfil"
        title="Triagem de Conhecimento"
        questions={perfilQuestions}
        initialStarted={start}
        startHref="/perfil?start=true"
      />
      <Footer />
    </div>
  );
}
