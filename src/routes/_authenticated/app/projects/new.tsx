import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, UploadIcon, FileText, Loader2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { createProject } from "@/lib/projects.functions";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { OutputMode, StylePreset, Aggressiveness, ModelProvider } from "@/types/takeaways";

export const Route = createFileRoute("/_authenticated/app/projects/new")({
  component: NewProjectPage,
  head: () => ({
    meta: [
      { title: "Novo Projeto · StraightCut" },
      { name: "description", content: "Crie um novo projeto de síntese executiva" },
    ],
  }),
});

type WizardStep = "upload" | "context" | "run";

function NewProjectPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<WizardStep>("upload");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isConfidential, setIsConfidential] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectContext, setProjectContext] = useState("");

  const outputMode: OutputMode = "PPT_EDITABLE";
  const stylePreset: StylePreset = "CLEAN";
  const aggressiveness: Aggressiveness = "EXECUTIVE";
  const modelProvider: ModelProvider = "GEMINI";
  const skipEvidenceCatalog = false;

  const steps = [
    { id: "upload" as WizardStep, label: "Upload", icon: UploadIcon },
    { id: "context" as WizardStep, label: "Contexto", icon: FileText },
    { id: "run" as WizardStep, label: "Gerar", icon: Play },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);
  const canGoNext = () => {
    if (currentStep === "upload") return selectedFile !== null;
    if (currentStep === "context") return projectName.trim().length > 0;
    return true;
  };

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id);
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleCreate = async () => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      if (!userId) throw new Error("Usuário não autenticado");

      const fileMeta = selectedFile
        ? {
            fileName: selectedFile.name,
            fileSize: selectedFile.size,
            fileType: selectedFile.type,
          }
        : null;

      const project = await createProject({
        data: {
          name: projectName,
          context: {
            userContext: projectContext.trim(),
            skipEvidenceCatalog,
            fileMeta,
          },
          confidential: isConfidential,
          output_mode: outputMode,
          style_preset: outputMode === "PPT_EDITABLE_STYLED_BETA" ? stylePreset : null,
          aggressiveness,
          model_provider: modelProvider,
        },
      });

      // Upload to Supabase Storage in background
      if (selectedFile) {
        const filePath = `${userId}/${project.id}/${selectedFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from("presentations")
          .upload(filePath, selectedFile, {
            cacheControl: "3600",
            upsert: false,
          });
        if (uploadError) {
          console.error("[create project] upload error", uploadError);
          toast.error("Projeto criado, mas falha no upload do arquivo");
        }
      }

      toast.success("Projeto criado com sucesso");
      navigate({ to: "/app/projects/$id/processing", params: { id: project.id }, replace: true });
    } catch (e: any) {
      console.error("[create project] erro inesperado", e);
      setSubmitError(`Erro inesperado: ${e?.message ?? "erro desconhecido"}.`);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mx-auto mb-8 max-w-2xl">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStepIndex === index;
              const isCompleted = currentStepIndex > index;

              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "flex h-11 w-11 items-center justify-center rounded-full border-2 transition-colors",
                        isActive && "border-primary bg-primary text-primary-foreground",
                        isCompleted && "border-green-500 bg-green-500 text-white",
                        !isActive && !isCompleted && "border-border bg-card text-muted-foreground",
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span
                      className={cn(
                        "mt-2 text-xs font-medium",
                        isActive ? "text-primary" : isCompleted ? "text-green-600" : "text-muted-foreground",
                      )}
                    >
                      {step.label}
                    </span>
                  </div>

                  {index < steps.length - 1 && (
                    <div
                      className={cn("mx-8 mt-[22px] h-px w-32 self-start transition-colors", isCompleted ? "bg-green-500" : "bg-border")}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <Card className="border-border p-8">
          {currentStep === "upload" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">Upload do Arquivo</h2>
                <p className="mt-1 text-muted-foreground">Selecione o arquivo PPT ou PDF para análise</p>
              </div>

              <div className="space-y-4">
                {!selectedFile ? (
                  <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 p-12 text-center">
                    <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <UploadIcon className="h-8 w-8" />
                    </span>
                    <div className="mb-4">
                      <p className="text-sm font-medium text-foreground">Arraste e solte ou clique para selecionar</p>
                      <p className="mt-1 text-xs text-muted-foreground">PPTX ou PDF, até 50MB</p>
                    </div>
                    <Label htmlFor="file-upload" className="cursor-pointer">
                      <Button type="button" variant="outline" asChild>
                        <span>Selecionar arquivo</span>
                      </Button>
                    </Label>
                  </div>
                ) : null}
                <Input id="file-upload" type="file" accept=".pptx,.pdf" onChange={handleFileSelect} className="hidden" />

                {selectedFile && (
                  <Card className="border-green-500/20 bg-green-500/5 p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-medium text-foreground">{selectedFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • {selectedFile.type || "application/pdf"}
                        </p>
                      </div>
                      <Label htmlFor="file-upload" className="cursor-pointer">
                        <Button type="button" variant="outline" asChild>
                          <span>Trocar apresentação</span>
                        </Button>
                      </Label>
                    </div>
                  </Card>
                )}

                <div className="flex items-center gap-3">
                  <Switch id="confidential" checked={isConfidential} onCheckedChange={setIsConfidential} />
                  <Label htmlFor="confidential" className="text-sm text-muted-foreground">
                    Arquivo é confidencial (limita logs e mascara trechos em auditoria)
                  </Label>
                </div>
              </div>
            </div>
          )}

          {currentStep === "context" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">Contexto do projeto</h2>
                <p className="mt-1 text-muted-foreground">
                  Dê um nome e adicione informações que ajudem a IA a entender o objetivo da apresentação.
                </p>
              </div>

              <div className="space-y-7">
                <div>
                  <Label htmlFor="name">Nome do Projeto *</Label>
                  <Input
                    id="name"
                    placeholder="Ex: Apresentação Executiva Q4"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="project-context">Contexto do Projeto</Label>
                  <Textarea
                    id="project-context"
                    placeholder="Ex: apresentação para diretoria, foco em resultados do trimestre, decisões necessárias, público-alvo, pontos que devem ser preservados..."
                    value={projectContext}
                    onChange={(e) => setProjectContext(e.target.value)}
                    className="mt-2 min-h-36 resize-y"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === "run" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">Pronto para Gerar</h2>
                <p className="mt-1 text-muted-foreground">Revise as informações e inicie o processamento</p>
              </div>

              <Card className="border-border bg-muted/30 p-6">
                <h3 className="mb-4 font-semibold text-foreground">Resumo</h3>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Arquivo:</dt>
                    <dd className="font-medium text-foreground">{selectedFile?.name}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Projeto:</dt>
                    <dd className="font-medium text-foreground">{projectName}</dd>
                  </div>
                  {projectContext.trim().length > 0 && (
                    <div className="gap-4 sm:flex sm:justify-between">
                      <dt className="text-muted-foreground">Contexto:</dt>
                      <dd className="mt-1 max-w-md text-left font-medium text-foreground sm:mt-0 sm:text-right">
                        {projectContext}
                      </dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Verificação/evidências:</dt>
                    <dd className="font-medium text-foreground">Extrair</dd>
                  </div>
                </dl>
              </Card>

              {submitError && <p className="text-sm text-destructive">{submitError}</p>}
              <Button size="lg" className="w-full gap-2" onClick={handleCreate} disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Play className="h-5 w-5" />}
                {isSubmitting ? "Criando projeto..." : "Gerar Takeaways"}
              </Button>
            </div>
          )}
        </Card>

        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStepIndex === 0}
            className="gap-2 bg-transparent"
            asChild
          >
            <Link to="/app/projects">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Link>
          </Button>

          {currentStep !== "run" && (
            <Button onClick={handleNext} disabled={!canGoNext()} className="gap-2">
              Continuar
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
