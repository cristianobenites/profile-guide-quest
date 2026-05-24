import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import type { Question } from "@/lib/questions";
import { analyzeAnswers, type AnalyzeResult } from "@/lib/analyze.functions";
import { ReportView } from "./ReportView";
import { AudioAnswerButton } from "./AudioAnswerButton";

type Props = {
  tipo: "perfil" | "tecnico";
  title: string;
  questions: (Question & { correct?: string })[];
  intro?: string;
  initialStarted?: boolean;
  startHref?: string;
};

function shouldStartFromUrl() {
  if (typeof window === "undefined") return false;
  return window.location.hash === "#pergunta-1" || window.location.search.includes("start=1");
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function QuestionnaireFlow({ tipo, title, questions: rawQuestions, intro, initialStarted = false, startHref }: Props) {
  // Embaralha alternativas a cada carregamento, remapeando o "correct" para a nova letra
  const questions = useMemo(() => {
    const LETTERS = ["A", "B", "C", "D", "E", "F"];
    return rawQuestions.map((q) => {
      if (q.type !== "choice") return q;
      const shuffled = shuffle(q.options);
      const newOptions = shuffled.map((o, i) => ({ key: LETTERS[i], label: o.label }));
      let newCorrect = q.correct;
      if (q.correct) {
        const idx = shuffled.findIndex((o) => o.key === q.correct);
        if (idx >= 0) newCorrect = LETTERS[idx];
      }
      return { ...q, options: newOptions, correct: newCorrect };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawQuestions]);

  const [studentName, setStudentName] = useState("");
  const [started, setStarted] = useState(() => initialStarted || shouldStartFromUrl());
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<AnalyzeResult | null>(null);
  const analyze = useServerFn(analyzeAnswers);

  useEffect(() => {
    if (initialStarted || shouldStartFromUrl()) setStarted(true);
  }, [initialStarted]);

  const total = questions.length;
  const q = questions[step];
  const progress = ((step + 1) / total) * 100;
  const currentAnswer = q ? answers[q.id] ?? "" : "";
  const canAdvance = currentAnswer.trim().length > 0;

  const score = useMemo(() => {
    if (tipo !== "tecnico") return undefined;
    let correct = 0;
    let totalScored = 0;
    questions.forEach((qq) => {
      if (qq.type === "choice" && qq.correct) {
        totalScored++;
        if (answers[qq.id] === qq.correct) correct++;
      }
    });
    return { correct, total: totalScored };
  }, [answers, questions, tipo]);

  async function handleSubmit() {
    setLoading(true);
    try {
      const payload = {
        tipo,
        studentName: studentName || undefined,
        technicalScore: score,
        answers: questions.map((qq) => {
          const a = answers[qq.id] ?? "";
          if (qq.type === "choice") {
            const opt = qq.options.find((o) => o.key === a);
            return {
              questionId: qq.id,
              prompt: qq.prompt,
              type: "choice" as const,
              answer: a,
              optionLabel: opt?.label,
            };
          }
          return {
            questionId: qq.id,
            prompt: qq.prompt,
            type: "open" as const,
            answer: a,
          };
        }),
      };
      const result = await analyze({ data: payload });
      setReport(result);
    } catch (e: any) {
      toast.error(e?.message ?? "Erro ao gerar relatório");
    } finally {
      setLoading(false);
    }
  }

  if (report) {
    return (
      <ReportView
        result={report}
        tipo={tipo}
        studentName={studentName}
        questions={questions}
        answers={answers}
      />
    );
  }

  if (!started) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 animate-in">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary mb-6 block font-medium">
          {tipo === "perfil" ? "Etapa 1 · Triagem de Conhecimento" : "Etapa 2 · Prova de IA"}
        </span>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-[0.95] mb-6">{title}</h1>
        <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
          {intro ??
            (tipo === "perfil"
              ? "10 perguntas rápidas para entender se você já tem (ou não) conhecimento sobre IA. Sem certo ou errado — responda com sinceridade para que a gente saiba por onde começar com você."
              : "Prova com 10 questões sobre fundamentos de IA. Você pode responder agora, online, ou baixar o PDF, responder offline e enviar depois para correção e feedback gerados por IA.")}
        </p>
        <div className="bg-card border border-border rounded-2xl p-6 mb-6">
          <label className="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">
            Seu nome (opcional)
          </label>
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value.slice(0, 120))}
            placeholder="Como podemos te chamar?"
            className="w-full p-3 bg-background border border-border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
          />
        </div>
        <a
          href={startHref ?? "#pergunta-1"}
          onClick={(event) => {
            event.preventDefault();
            setStarted(true);
            if (typeof window !== "undefined") {
              if (startHref) window.history.replaceState(null, "", startHref);
              window.scrollTo(0, 0);
            }
          }}
          className="inline-flex bg-primary text-primary-foreground px-8 py-4 rounded-lg font-bold text-lg hover:shadow-xl transition-shadow duration-150 active:scale-[0.98] cursor-pointer"
        >
          Começar — {total} {total === 1 ? "pergunta" : "perguntas"}
        </a>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-32 text-center animate-in">
        <Loader2 className="size-12 mx-auto text-primary animate-spin mb-6" />
        <h2 className="text-2xl font-bold mb-2">Gerando seu relatório...</h2>
        <p className="text-muted-foreground">A IA está analisando suas respostas. Isso leva alguns segundos.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      {/* Header progress */}
      <div className="flex justify-between items-end mb-12">
        <div>
          <span className="font-mono text-sm text-primary">
            Passo {String(step + 1).padStart(2, "0")} de {String(total).padStart(2, "0")}
          </span>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mt-2">{q.section}</h2>
        </div>
        <div className="w-32 md:w-48 h-1 bg-border rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all duration-200" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div key={q.id} className="space-y-8 animate-in">
        <h3 className="text-xl md:text-2xl font-semibold leading-snug text-pretty">{q.prompt}</h3>

        {q.type === "choice" ? (
          <div className="grid gap-3">
            {q.options.map((opt) => {
              const selected = currentAnswer === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={() => {
                    setAnswers((p) => ({ ...p, [q.id]: opt.key }));
                  }}
                  className={`group flex items-start gap-4 p-5 rounded-xl text-left transition-colors duration-100 cursor-pointer ${
                    selected
                      ? "bg-primary/5 border-2 border-primary"
                      : "bg-card border border-border hover:border-primary"
                  }`}
                >
                  <div
                    className={`size-6 rounded flex items-center justify-center flex-shrink-0 font-mono text-xs ${
                      selected ? "bg-primary text-primary-foreground" : "border border-border bg-background"
                    }`}
                  >
                    {opt.key}
                  </div>
                  <p className={`text-sm leading-relaxed ${selected ? "font-medium" : ""}`}>{opt.label}</p>
                </button>
              );
            })}
          </div>

        ) : (
          <div>
            <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
              <label className="block text-xs font-mono uppercase tracking-widest text-muted-foreground">
                Resposta (texto ou áudio)
              </label>
              <AudioAnswerButton
                onTranscript={(text) =>
                  setAnswers((p) => {
                    const prev = p[q.id] ?? "";
                    const next = (prev ? prev + " " : "") + text;
                    return { ...p, [q.id]: next.slice(0, 2000) };
                  })
                }
              />
            </div>
            <textarea
              value={currentAnswer}
              onChange={(e) => setAnswers((p) => ({ ...p, [q.id]: e.target.value.slice(0, 2000) }))}
              placeholder={q.placeholder ?? "Escreva sua resposta ou grave por áudio..."}
              className="w-full h-40 p-4 bg-card border border-border rounded-xl focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-muted-foreground/50 text-sm"
            />
            <p className="text-xs text-muted-foreground mt-2 font-mono">{currentAnswer.length}/2000</p>
          </div>

        )}

        <div className="flex justify-between pt-8 border-t border-border">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="text-muted-foreground font-bold hover:text-foreground flex items-center gap-2 disabled:opacity-30 cursor-pointer"
          >
            <ArrowLeft className="size-4" /> Anterior
          </button>
          {step === total - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={!canAdvance}
              className="bg-accent text-accent-foreground px-8 py-3 rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-30 flex items-center gap-2 cursor-pointer"
            >
              Gerar Relatório <ArrowRight className="size-4" />
            </button>
          ) : (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canAdvance}
              className="bg-foreground text-background px-8 py-3 rounded-lg font-bold hover:bg-primary transition-all disabled:opacity-30 flex items-center gap-2 cursor-pointer"
            >
              Próxima <ArrowRight className="size-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
