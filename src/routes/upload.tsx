import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Upload, Loader2, FileText } from "lucide-react";
import { Nav, Footer } from "@/components/Nav";
import { extractPdfText } from "@/lib/pdf-utils";
import { analyzeAnswers, type AnalyzeResult } from "@/lib/analyze.functions";
import { ReportView } from "@/components/ReportView";

export const Route = createFileRoute("/upload")({
  component: UploadPage,
  head: () => ({
    meta: [
      { title: "Enviar PDF Respondido · Axioma IA" },
      { name: "description", content: "Envie o PDF do questionário já preenchido e receba análise automática por IA." },
    ],
  }),
});

function UploadPage() {
  const [tipo, setTipo] = useState<"perfil" | "tecnico">("perfil");
  const [studentName, setStudentName] = useState("");
  const [fileName, setFileName] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<AnalyzeResult | null>(null);
  const analyze = useServerFn(analyzeAnswers);

  async function handleFile(file: File) {
    if (file.type !== "application/pdf") {
      toast.error("Por favor envie um arquivo PDF.");
      return;
    }
    setFileName(file.name);
    setLoading(true);
    try {
      const text = await extractPdfText(file);
      setExtractedText(text);
      toast.success("PDF lido com sucesso. Revise e gere o relatório.");
    } catch (e: any) {
      toast.error("Erro ao ler PDF: " + (e?.message ?? ""));
    } finally {
      setLoading(false);
    }
  }

  async function handleAnalyze() {
    if (!extractedText.trim()) {
      toast.error("Nenhum texto extraído do PDF.");
      return;
    }
    setLoading(true);
    try {
      const result = await analyze({
        data: {
          tipo,
          studentName: studentName || undefined,
          answers: [
            {
              questionId: "pdf_full",
              prompt: `Conteúdo completo do questionário ${tipo === "perfil" ? "de perfil comportamental" : "técnico"} preenchido pelo aluno (extraído do PDF)`,
              type: "open" as const,
              answer: extractedText.slice(0, 12000),
            },
          ],
        },
      });
      setReport(result);
    } catch (e: any) {
      toast.error(e?.message ?? "Erro ao gerar relatório");
    } finally {
      setLoading(false);
    }
  }

  if (report) {
    return (
      <div className="min-h-screen bg-background">
        <Nav />
        <ReportView result={report} tipo={tipo} studentName={studentName} />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="max-w-3xl mx-auto px-6 py-20 animate-in">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary mb-6 block font-medium">
          Análise de PDF preenchido
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
          Envie o questionário respondido
        </h1>
        <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
          Se o aluno preencheu o PDF offline (impresso ou digital), envie aqui para a IA analisar e
          gerar um relatório automático.
        </p>

        <div className="space-y-6 bg-card border border-border rounded-2xl p-6 md:p-8">
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">
              Tipo do questionário
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(["perfil", "tecnico"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTipo(t)}
                  className={`p-4 rounded-lg border-2 text-sm font-bold transition-all ${
                    tipo === t
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border bg-background hover:border-primary/50"
                  }`}
                >
                  {t === "perfil" ? "Perfil Comportamental" : "Avaliação Técnica"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">
              Nome do aluno (opcional)
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value.slice(0, 120))}
              placeholder="Nome do aluno"
              className="w-full p-3 bg-background border border-border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">
              Arquivo PDF
            </label>
            <label className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-border rounded-xl hover:border-primary transition-all cursor-pointer bg-background">
              {fileName ? (
                <>
                  <FileText className="size-8 text-primary" />
                  <p className="font-bold">{fileName}</p>
                  <p className="text-xs text-muted-foreground">Clique para trocar</p>
                </>
              ) : (
                <>
                  <Upload className="size-8 text-muted-foreground" />
                  <p className="font-bold">Clique para enviar PDF</p>
                  <p className="text-xs text-muted-foreground">Máx. 20 MB</p>
                </>
              )}
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                }}
              />
            </label>
          </div>

          {extractedText && (
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">
                Texto extraído (revisar/editar antes de analisar)
              </label>
              <textarea
                value={extractedText}
                onChange={(e) => setExtractedText(e.target.value)}
                className="w-full h-48 p-4 bg-background border border-border rounded-lg text-xs font-mono outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={loading || !extractedText.trim()}
            className="w-full bg-primary text-primary-foreground py-4 rounded-lg font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="size-5 animate-spin" /> Processando...
              </>
            ) : (
              "Gerar Relatório com IA"
            )}
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
