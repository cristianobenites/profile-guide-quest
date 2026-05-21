import { createFileRoute, Link } from "@tanstack/react-router";
import { Brain, FileDown, Sparkles, Upload } from "lucide-react";
import { Nav, Footer } from "@/components/Nav";
import { generateBlankQuestionnairePDF } from "@/lib/pdf-utils";
import { perfilQuestions, tecnicoQuestions } from "@/lib/questions";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Axioma IA · Mapeie sua jornada em Inteligência Artificial" },
      { name: "description", content: "Diagnóstico comportamental e técnico em IA. Responda online ou baixe o PDF e receba um relatório personalizado gerado por IA." },
    ],
  }),
});

function Index() {
  function downloadBlank(tipo: "perfil" | "tecnico") {
    const doc =
      tipo === "perfil"
        ? generateBlankQuestionnairePDF(
            "Perfil e Comportamento com IA",
            "Questionário Diagnóstico — Parte 1",
            perfilQuestions,
          )
        : generateBlankQuestionnairePDF(
            "Avaliação Técnica em IA",
            "Questionário Diagnóstico — Parte 2",
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
              Um diagnóstico profundo para entender seu perfil comportamental e proficiência técnica.
              Receba um relatório personalizado gerado por IA com trilhas de aprendizado sugeridas.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/perfil"
                className="bg-primary text-primary-foreground px-8 py-4 rounded-lg font-bold text-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                Iniciar Diagnóstico Online
              </Link>
              <Link
                to="/upload"
                className="border border-border bg-card px-8 py-4 rounded-lg font-bold text-lg hover:bg-muted transition-all flex items-center gap-2"
              >
                <Upload className="size-5" /> Enviar PDF Respondido
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
                      <p className="font-bold">Responda os questionários</p>
                      <p className="text-xs text-background/60 mt-1">Perfil + Avaliação Técnica</p>
                    </div>
                  </li>
                  <li className="flex gap-4 items-start">
                    <span className="font-mono text-2xl font-bold text-primary">02</span>
                    <div>
                      <p className="font-bold">A IA analisa suas respostas</p>
                      <p className="text-xs text-background/60 mt-1">Identifica perfil, lacunas e forças</p>
                    </div>
                  </li>
                  <li className="flex gap-4 items-start">
                    <span className="font-mono text-2xl font-bold text-primary">03</span>
                    <div>
                      <p className="font-bold">Receba seu relatório</p>
                      <p className="text-xs text-background/60 mt-1">Trilha personalizada + download PDF</p>
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

        {/* OS DOIS QUESTIONÁRIOS */}
        <section className="py-24 border-b border-border">
          <div className="text-center mb-16">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary mb-4 block">
              Dois questionários
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Comece por onde preferir</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Perfil */}
            <div className="bg-card border border-border rounded-2xl p-8 hover:border-primary transition-all group">
              <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <Brain className="size-6 text-primary" />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Parte 1</span>
              <h3 className="text-2xl font-bold mt-2 mb-3">Perfil Comportamental</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed text-sm">
                11 perguntas sobre como você se relaciona com IA, seus hábitos, percepções éticas e
                expectativas. Inclui reflexões abertas analisadas pela IA.
              </p>
              <div className="flex flex-wrap gap-2">
                <Link
                  to="/perfil"
                  className="bg-foreground text-background px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-primary transition-all"
                >
                  Responder online
                </Link>
                <button
                  onClick={() => downloadBlank("perfil")}
                  className="border border-border px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-muted transition-all flex items-center gap-2"
                >
                  <FileDown className="size-4" /> Baixar PDF
                </button>
              </div>
            </div>

            {/* Técnico */}
            <div className="bg-card border border-border rounded-2xl p-8 hover:border-primary transition-all group">
              <div className="size-12 rounded-lg bg-accent/10 flex items-center justify-center mb-6">
                <Sparkles className="size-6 text-accent" />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Parte 2</span>
              <h3 className="text-2xl font-bold mt-2 mb-3">Avaliação Técnica</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed text-sm">
                15 perguntas sobre fundamentos de IA, Machine Learning, Deep Learning, LLMs e
                aplicações práticas. Com pontuação objetiva.
              </p>
              <div className="flex flex-wrap gap-2">
                <Link
                  to="/tecnico"
                  className="bg-foreground text-background px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-primary transition-all"
                >
                  Responder online
                </Link>
                <button
                  onClick={() => downloadBlank("tecnico")}
                  className="border border-border px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-muted transition-all flex items-center gap-2"
                >
                  <FileDown className="size-4" /> Baixar PDF
                </button>
              </div>
            </div>
          </div>

          <div className="mt-12 p-6 bg-foreground/5 border border-border rounded-xl text-center text-sm text-muted-foreground">
            Já respondeu um questionário em PDF?{" "}
            <Link to="/upload" className="text-primary font-bold hover:underline">
              Envie aqui para análise
            </Link>
            .
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
