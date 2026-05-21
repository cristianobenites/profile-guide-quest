import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav, Footer } from "@/components/Nav";
import { QuestionnaireFlow } from "@/components/QuestionnaireFlow";
import type { GenerateChallengeResult } from "@/lib/challenge.functions";

export const Route = createFileRoute("/desafio")({
  component: DesafioPage,
  head: () => ({
    meta: [
      { title: "Prova Personalizada · Axioma IA" },
      { name: "description", content: "Prova de IA personalizada gerada a partir da sua triagem." },
    ],
  }),
});

const STORAGE_KEY = "axioma:challenge";

function DesafioPage() {
  const [challenge, setChallenge] = useState<GenerateChallengeResult | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) setChallenge(JSON.parse(raw) as GenerateChallengeResult);
    } catch {}
    setReady(true);
  }, []);

  if (!ready) return null;

  if (!challenge) {
    return (
      <div className="min-h-screen bg-background">
        <Nav />
        <div className="max-w-2xl mx-auto px-6 py-32 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight mb-4">Prova ainda não gerada</h1>
          <p className="text-muted-foreground mb-8">
            Você precisa primeiro responder a triagem para que a IA gere uma prova personalizada para
            o seu nível.
          </p>
          <Link
            to="/perfil"
            className="inline-block bg-primary text-primary-foreground px-8 py-4 rounded-lg font-bold hover:shadow-xl transition-all"
          >
            Iniciar triagem
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <QuestionnaireFlow
        tipo="tecnico"
        title={challenge.title || "Prova Personalizada"}
        questions={challenge.questions}
        intro={challenge.introduction}
      />
      <Footer />
    </div>
  );
}
