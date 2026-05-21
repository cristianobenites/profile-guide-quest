import { createFileRoute } from "@tanstack/react-router";
import { Nav, Footer } from "@/components/Nav";
import { QuestionnaireFlow } from "@/components/QuestionnaireFlow";
import { perfilQuestions } from "@/lib/questions";

export const Route = createFileRoute("/perfil")({
  component: PerfilPage,
  head: () => ({
    meta: [
      { title: "Perfil Comportamental · Axioma IA" },
      { name: "description", content: "Diagnóstico do seu perfil comportamental no uso de IA. 11 perguntas + análise personalizada." },
    ],
  }),
});

function PerfilPage() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <QuestionnaireFlow tipo="perfil" title="Perfil Comportamental" questions={perfilQuestions} />
      <Footer />
    </div>
  );
}
