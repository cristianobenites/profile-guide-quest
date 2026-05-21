import { createFileRoute } from "@tanstack/react-router";
import { Nav, Footer } from "@/components/Nav";
import { QuestionnaireFlow } from "@/components/QuestionnaireFlow";
import { tecnicoQuestions } from "@/lib/questions";

export const Route = createFileRoute("/tecnico")({
  component: TecnicoPage,
  head: () => ({
    meta: [
      { title: "Avaliação Técnica · Axioma IA" },
      { name: "description", content: "Avaliação técnica em IA: fundamentos, ML, Deep Learning, LLMs. Receba pontuação e relatório." },
    ],
  }),
});

function TecnicoPage() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <QuestionnaireFlow tipo="tecnico" title="Avaliação Técnica" questions={tecnicoQuestions} />
      <Footer />
    </div>
  );
}
