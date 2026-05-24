import { createFileRoute } from "@tanstack/react-router";
import { Nav, Footer } from "@/components/Nav";
import { QuestionnaireFlow } from "@/components/QuestionnaireFlow";
import { perfilQuestions } from "@/lib/questions";

export const Route = createFileRoute("/perfil")({
  component: PerfilPage,
  head: () => ({
    meta: [
      { title: "Triagem de Conhecimento · Axioma IA" },
      { name: "description", content: "Triagem rápida com 10 perguntas para mapear seu nível atual de conhecimento em IA." },
    ],
  }),
});

function PerfilPage() {
  const initialStarted = typeof window !== "undefined" && window.location.hash === "#pergunta-1";

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <QuestionnaireFlow
        tipo="perfil"
        title="Triagem de Conhecimento"
        questions={perfilQuestions}
        initialStarted={initialStarted}
        startHref="/perfil#pergunta-1"
      />
      <Footer />
    </div>
  );
}
