import { createFileRoute } from "@tanstack/react-router";
import { Nav, Footer } from "@/components/Nav";
import { QuestionnaireFlow } from "@/components/QuestionnaireFlow";
import { tecnicoQuestions } from "@/lib/questions";

export const Route = createFileRoute("/tecnico")({
  component: TecnicoPage,
  head: () => ({
    meta: [
      { title: "Prova de IA · Axioma IA" },
      { name: "description", content: "Prova de IA com 10 questões. Responda online ou baixe o PDF e envie depois para correção e feedback gerados por IA." },
    ],
  }),
});

function TecnicoPage() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <QuestionnaireFlow tipo="tecnico" title="Prova de IA" questions={tecnicoQuestions} />
      <Footer />
    </div>
  );
}
