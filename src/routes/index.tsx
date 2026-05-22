import { createFileRoute, Link } from "@tanstack/react-router";
import { Brain, FileDown, Sparkles } from "lucide-react";
import { Nav, Footer } from "@/components/Nav";
import { generateBlankQuestionnairePDF } from "@/lib/pdf-utils";
import { perfilQuestions, tecnicoQuestions } from "@/lib/questions";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Axioma IA · Mapeie sua jornada em Inteligência Artificial" },
      { name: "description", content: "Triagem inicial + prova de IA com correção por IA. Responda online ou baixe o PDF e envie para receber feedback personalizado." },
    ],
  }),
});

function Index() {
  function downloadBlank(tipo: "perfil" | "tecnico") {
    const doc =
      tipo === "perfil"
        ? generateBlankQuestionnairePDF(
            "Triagem de Conhecimento em IA",
            "Etapa 1 — Triagem Diagnóstica",
            perfilQuestions,
          )
        : generateBlankQuestionnairePDF(
            "Prova de IA",
            "Etapa 2 — Avaliação com Correção por IA",
            tecnicoQuestions,
          );
    doc.save(`questionario-${tipo}-axioma.pdf`);
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10">
      <Nav />
      <main className="max-w-6xl mx-auto px-6">
        {/* HERO */}
        <section className="py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center border-b border-border">
          <div className="lg:col-span-7 animate-in">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary mb-6 block font-medium">
              Diagnóstico Educacional · 2026
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-balance leading-[0.95] mb-8">
              Mapeie sua jornada na <span className="text-primary">Inteligência Artificial.</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-[50ch] text-pretty mb-10 leading-relaxed">
              Comece com uma <strong>triagem rápida</strong> para entender seu nível atual de conhecimento.
              Depois, faça a <strong>prova</strong> online ou baixe em PDF, responda offline e envie para
              receber correção e feedback gerados por IA.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/perfil"
                className="bg-primary text-primary-foreground px-8 py-4 rounded-lg font-bold text-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                Começar pela Triagem
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5 animate-in [animation-delay:150ms]">
            <div className="w-full aspect-[4/5] bg-foreground text-background rounded-2xl p-8 shadow-2xl flex flex-col justify-between">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-background/60">
                  Como funciona
                </span>
                <ol className="mt-6 space-y-5">
                  <li className="flex gap-4 items-start">
                    <span className="font-mono text-2xl font-bold text-primary">01</span>
                    <div>
                      <p className="font-bold">Triagem rápida (10 perguntas)</p>
                      <p className="text-xs text-background/60 mt-1">Mapeia seu nível atual de IA</p>
                    </div>
                  </li>
                  <li className="flex gap-4 items-start">
                    <span className="font-mono text-2xl font-bold text-primary">02</span>
                    <div>
                      <p className="font-bold">Prova de IA</p>
                      <p className="text-xs text-background/60 mt-1">Responda online ou baixe o PDF</p>
                    </div>
                  </li>
                  <li className="flex gap-4 items-start">
                    <span className="font-mono text-2xl font-bold text-primary">03</span>
                    <div>
                      <p className="font-bold">Correção + feedback da IA</p>
                      <p className="text-xs text-background/60 mt-1">Pontuação, lacunas e próximos passos</p>
                    </div>
                  </li>
                </ol>
              </div>
              <p className="text-xs text-background/40 italic border-t border-background/10 pt-4">
                "Mapeamos o ponto de partida para construir a jornada certa."
              </p>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
