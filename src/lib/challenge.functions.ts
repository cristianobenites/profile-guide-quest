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
  studentName: z.string().max(120).optional(),
  profileTitle: z.string().max(200).optional(),
  profileSummary: z.string().max(2000).optional(),
  triageAnswers: z.array(AnswerSchema).min(1).max(50),
});

export type GeneratedQuestion =
  | {
      id: string;
      type: "choice";
      section: string;
      prompt: string;
      options: { key: string; label: string }[];
      correct: string;
    }
  | {
      id: string;
      type: "open";
      section: string;
      prompt: string;
      placeholder?: string;
    };

export type GenerateChallengeResult = {
  title: string;
  introduction: string;
  level: string;
  questions: GeneratedQuestion[];
};

function buildPrompt(input: z.infer<typeof InputSchema>) {
  const respostas = input.triageAnswers
    .map(
      (a) =>
        `- [${a.questionId}] ${a.prompt}\n  Resposta: ${
          a.type === "choice" ? `(${a.answer}) ${a.optionLabel ?? ""}` : a.answer
        }`,
    )
    .join("\n\n");

  return `Você é um especialista em educação em IA. Com base nas respostas da TRIAGEM abaixo, gere uma PROVA DESAFIO totalmente personalizada e calibrada ao nível real da pessoa.

IMPORTANTE: Em enunciados, introdução e qualquer texto voltado à pessoa, fale SEMPRE em SEGUNDA PESSOA ("você", "seu", "sua"). NUNCA use "o aluno" ou terceira pessoa.

Nome: ${input.studentName || "Anônimo"}
Perfil identificado: ${input.profileTitle ?? "n/d"}
Resumo do perfil: ${input.profileSummary ?? "n/d"}

Respostas da triagem:
${respostas}

REGRAS DA PROVA:
- Exatamente 10 questões.
- 7 questões de múltipla escolha (4 alternativas A-D, com UMA correta) + 3 questões abertas.
- Calibre a dificuldade ao nível da pessoa: iniciantes recebem fundamentos (o que é IA, prompt, alucinação); intermediários recebem ML/LLMs/uso prático; avançados recebem engenharia de prompt, limites técnicos, casos de uso reais.
- Cubra os tópicos onde a pessoa demonstrou MAIS LACUNAS na triagem.
- Português brasileiro, linguagem clara e direta, em SEGUNDA PESSOA ("você").
- Não copie literalmente perguntas da triagem.

Retorne EXCLUSIVAMENTE um JSON válido (sem markdown, sem texto extra) no formato:
{
  "title": "Título curto da prova personalizada",
  "introduction": "1-2 frases em segunda pessoa explicando por que essa prova foi calibrada para você",
  "level": "iniciante | intermediário | avançado",
  "questions": [
    {
      "id": "q1",
      "type": "choice",
      "section": "Nome do tema",
      "prompt": "Enunciado da pergunta",
      "options": [
        {"key": "A", "label": "..."},
        {"key": "B", "label": "..."},
        {"key": "C", "label": "..."},
        {"key": "D", "label": "..."}
      ],
      "correct": "A"
    },
    {
      "id": "q8",
      "type": "open",
      "section": "Nome do tema",
      "prompt": "Pergunta aberta",
      "placeholder": "Texto guia opcional"
    }
  ]
}

Gere os ids como q1..q10. As 7 primeiras devem ser type "choice" e as 3 últimas type "open".`;
}

export const generateChallenge = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }): Promise<GenerateChallengeResult> => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY ausente");

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
          { role: "user", content: buildPrompt(data) },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Falha ao gerar prova (${response.status}): ${text.slice(0, 200)}`);
    }

    const json = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = json.choices?.[0]?.message?.content;
    if (!content) throw new Error("Resposta vazia da IA");

    const cleaned = content.replace(/```json\s*|\s*```/g, "").trim();
    const parsed = JSON.parse(cleaned) as GenerateChallengeResult;

    if (!Array.isArray(parsed.questions) || parsed.questions.length === 0) {
      throw new Error("Prova retornada sem questões");
    }
    return parsed;
  });
