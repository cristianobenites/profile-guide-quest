import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const AnswerSchema = z.object({
  questionId: z.string(),
  prompt: z.string(),
  type: z.enum(["choice", "open"]),
  answer: z.string(),
  optionLabel: z.string().optional(),
});

const InputSchema = z.object({
  tipo: z.enum(["perfil", "tecnico"]),
  studentName: z.string().max(120).optional(),
  technicalScore: z.object({ correct: z.number(), total: z.number() }).optional(),
  answers: z.array(AnswerSchema).min(1).max(50),
});

export type AnalyzeInput = z.infer<typeof InputSchema>;

export type AnalyzeResult = {
  profileTitle: string;
  summary: string;
  strengths: string[];
  gaps: string[];
  recommendations: { title: string; description: string }[];
  competencies: { label: string; value: number }[];
  scoreLabel: string;
  scoreValue: string;
};

function buildPrompt(input: AnalyzeInput) {
  const respostas = input.answers
    .map((a) => {
      if (a.type === "choice") {
        return `- [${a.questionId}] ${a.prompt}\n  Resposta: (${a.answer}) ${a.optionLabel ?? ""}`;
      }
      return `- [${a.questionId}] ${a.prompt}\n  Resposta aberta: ${a.answer}`;
    })
    .join("\n\n");

  const scoreInfo =
    input.tipo === "tecnico" && input.technicalScore
      ? `\nPontuação objetiva: ${input.technicalScore.correct}/${input.technicalScore.total} corretas.`
      : "";

  const tipoLabel = input.tipo === "perfil"
    ? "perfil comportamental sobre uso de Inteligência Artificial"
    : "avaliação técnica de conhecimento em Inteligência Artificial";

  return `Você é um especialista em educação em IA. Analise as respostas abaixo de um aluno em um questionário diagnóstico de ${tipoLabel} e gere um relatório personalizado em português brasileiro.

Aluno: ${input.studentName || "Anônimo"}${scoreInfo}

Respostas:
${respostas}

Retorne EXCLUSIVAMENTE um JSON válido (sem markdown, sem texto extra) no formato:
{
  "profileTitle": "Nome curto e marcante do perfil (2-4 palavras)",
  "summary": "Parágrafo de 3-4 linhas resumindo o perfil ou nível técnico do aluno",
  "strengths": ["3 pontos fortes específicos baseados nas respostas"],
  "gaps": ["3 lacunas ou pontos de atenção específicos"],
  "recommendations": [
    {"title": "Título curto", "description": "Recomendação concreta de aprendizado/próximo passo"},
    {"title": "...", "description": "..."},
    {"title": "...", "description": "..."}
  ],
  "competencies": [
    {"label": "Nome da competência", "value": 0-100},
    {"label": "...", "value": 0-100},
    {"label": "...", "value": 0-100},
    {"label": "...", "value": 0-100}
  ],
  "scoreLabel": "Rótulo do score principal (ex: 'Maturidade em IA' ou 'Score Técnico')",
  "scoreValue": "Valor do score (ex: '78/100' ou 'Intermediário')"
}`;
}

export const analyzeAnswers = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }): Promise<AnalyzeResult> => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY ausente");

    const prompt = buildPrompt(data);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "Você responde sempre em JSON puro, sem markdown." },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Falha na análise da IA (${response.status}): ${text.slice(0, 200)}`);
    }

    const json = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = json.choices?.[0]?.message?.content;
    if (!content) throw new Error("Resposta vazia da IA");

    try {
      const cleaned = content.replace(/```json\s*|\s*```/g, "").trim();
      const parsed = JSON.parse(cleaned) as AnalyzeResult;
      return parsed;
    } catch (e) {
      throw new Error("JSON inválido retornado pela IA");
    }
  });
