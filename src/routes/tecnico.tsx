import { createFileRoute } from "@tanstack/react-router";
import { Nav, Footer } from "@/components/Nav";
import { QuestionnaireFlow } from "@/components/QuestionnaireFlow";
import { tecnicoQuestions } from "@/lib/questions";

export const Route = createFileRoute("/tecnico")({
  validateSearch: (search: Record<string, unknown>) => ({
    start: search.start === "1",
  }),
  component: TecnicoPage,
  head: () => ({
    meta: [
      { title: "Prova de IA · Axioma IA" },
      { name: "description", content: "Prova de IA com 10 questões. Responda online e receba correção e feedback gerados por IA." },
    ],
  }),
});

function TecnicoPage() {
  const { start } = Route.useSearch();

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <QuestionnaireFlow
        tipo="tecnico"
        title="Prova de IA"
        questions={tecnicoQuestions}
        initialStarted={start}
        startHref="/tecnico?start=1"
      />
      <Footer />
    </div>
  );
}
