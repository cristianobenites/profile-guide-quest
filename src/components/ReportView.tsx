import { Download, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import type { AnalyzeResult } from "@/lib/analyze.functions";
import { generateReportPDF } from "@/lib/pdf-utils";
import { Link } from "@tanstack/react-router";

export function ReportView({
  result,
  tipo,
  studentName,
}: {
  result: AnalyzeResult;
  tipo: "perfil" | "tecnico";
  studentName?: string;
}) {
  function handleDownload() {
    const doc = generateReportPDF(result, tipo, studentName);
    doc.save(`relatorio-${tipo}-${(studentName || "anonimo").replace(/\s+/g, "-").toLowerCase()}.pdf`);
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex flex-col md:flex-row gap-12">
        <div className="flex-1 animate-in">
          <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-[10px] font-mono font-bold uppercase rounded mb-4">
            Resultado Final
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-6">{result.profileTitle}</h1>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">{result.summary}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            <div className="p-6 bg-card border border-border rounded-xl shadow-sm">
              <span className="font-mono text-[10px] text-muted-foreground block mb-2 uppercase">
                {result.scoreLabel}
              </span>
              <div className="text-4xl font-bold tabular-nums text-primary">{result.scoreValue}</div>
            </div>
            <div className="p-6 bg-card border border-border rounded-xl shadow-sm">
              <span className="font-mono text-[10px] text-muted-foreground block mb-2 uppercase">Tipo</span>
              <div className="text-2xl font-bold capitalize">{tipo === "perfil" ? "Perfil Comportamental" : "Avaliação Técnica"}</div>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                <CheckCircle2 className="size-5 text-accent" /> Pontos Fortes
              </h4>
              <ul className="space-y-3">
                {result.strengths.map((s, i) => (
                  <li key={i} className="flex gap-3 items-start text-sm text-muted-foreground">
                    <span className="size-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                <AlertCircle className="size-5 text-primary" /> Pontos de Atenção
              </h4>
              <ul className="space-y-3">
                {result.gaps.map((g, i) => (
                  <li key={i} className="flex gap-3 items-start text-sm text-muted-foreground">
                    <span className="size-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    {g}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Sparkles className="size-5 text-primary" /> Recomendações Personalizadas
              </h4>
              <ul className="space-y-4">
                {result.recommendations.map((r, i) => (
                  <li key={i} className="flex gap-4 items-start">
                    <div className="size-6 rounded-full bg-accent/20 flex-shrink-0 mt-0.5 flex items-center justify-center text-xs text-accent font-bold">
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-bold mb-1">{r.title}</p>
                      <p className="text-sm text-muted-foreground">{r.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <div className="flex flex-wrap gap-3 pt-4">
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all"
              >
                <Download className="size-4" /> Baixar Relatório (PDF)
              </button>
              <Link
                to="/"
                className="flex items-center gap-2 border border-border bg-card px-6 py-3 rounded-lg font-bold hover:bg-muted transition-all"
              >
                Voltar ao Início
              </Link>
            </div>
          </div>
        </div>

        <aside className="w-full md:w-1/3 animate-in">
          <div className="sticky top-32 bg-foreground text-background p-8 rounded-2xl shadow-2xl">
            <h4 className="font-mono text-xs uppercase tracking-widest text-background/60 mb-8">
              Distribuição de Competências
            </h4>
            <div className="space-y-6">
              {result.competencies.map((c, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-2 font-mono uppercase">
                    <span>{c.label}</span>
                    <span>{c.value}%</span>
                  </div>
                  <div className="h-1 bg-background/10">
                    <div className="h-full bg-background transition-all duration-700" style={{ width: `${c.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-12 pt-8 border-t border-background/10 text-center">
              <p className="text-xs text-background/60 leading-relaxed italic">
                "A IA não substituirá humanos, mas humanos que usam IA substituirão aqueles que não usam."
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
