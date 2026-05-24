import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Nav, Footer } from "@/components/Nav";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Axioma IA · Mapeie sua jornada em Inteligência Artificial" },
      { name: "description", content: "Triagem inicial + prova de IA online com correção e feedback gerados por IA." },
    ],
  }),
});

function Index() {


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
              Comece com uma <strong>triagem rápida</strong> para entender seu nível atual.
              Depois, faça a <strong>prova personalizada</strong> online e receba correção e
              feedback gerados por IA na hora.

            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="/perfil?start=1"
                className="group relative overflow-hidden bg-primary text-primary-foreground px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_30px_-5px_hsl(225_70%_45%/0.4)] dark:hover:shadow-[0_0_30px_-5px_hsl(225_70%_60%/0.4)] active:scale-[0.97] cursor-pointer"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Começar pela Triagem
                  <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </a>
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
                      <p className="text-xs text-background/60 mt-1">Personalizada e respondida online</p>
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
