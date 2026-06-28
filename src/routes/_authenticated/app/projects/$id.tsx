import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Loader2, CheckCircle2, AlertCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import {
  getProjectById,
  getProjectSlides,
  getProjectTakeaways,
  getProjectPipelineRun,
} from "@/lib/workspace.functions";
import type { Project, Slide, Takeaway, PipelineRun } from "@/types/takeaways";

export const Route = createFileRoute("/_authenticated/app/projects/$id")({
  component: ProjectWorkspacePage,
  head: () => ({
    meta: [
      { title: "Workspace · StraightCut" },
      { name: "description", content: "Edite takeaways e curadoria do projeto" },
    ],
  }),
});

const pipelineSteps = [
  "INGESTION",
  "EVIDENCE_CATALOG",
  "TAKEAWAYS",
  "GROUPING",
  "CURATION",
  "DECK_BUILD",
  "OUTLINE",
  "EXPORT_PPT",
];

function ProjectWorkspacePage() {
  const { id } = Route.useParams();
  const [selectedSlide, setSelectedSlide] = useState<Slide | null>(null);
  const [activeTab, setActiveTab] = useState("takeaways-by-slide");

  const { data: project, isLoading: loadingProject } = useQuery<Project>({
    queryKey: ["project", id],
    queryFn: () => getProjectById({ data: { projectId: id } }),
  });

  const { data: slides = [], isLoading: loadingSlides } = useQuery<Slide[]>({
    queryKey: ["slides", id],
    queryFn: () => getProjectSlides({ data: { projectId: id } }),
  });

  const { data: takeaways = [], isLoading: loadingTakeaways } = useQuery<Takeaway[]>({
    queryKey: ["takeaways", id],
    queryFn: () => getProjectTakeaways({ data: { projectId: id } }),
  });

  const { data: pipelineRun, isLoading: loadingPipeline } = useQuery<PipelineRun | null>({
    queryKey: ["pipeline", id],
    queryFn: () => getProjectPipelineRun({ data: { projectId: id } }),
  });

  useEffect(() => {
    if (slides.length > 0 && !selectedSlide) {
      setSelectedSlide(slides[0]);
    }
  }, [slides, selectedSlide]);

  const slideTakeaways = useMemo(() => {
    if (!selectedSlide) return [];
    return takeaways.filter((t) => t.slide_id === selectedSlide.id);
  }, [takeaways, selectedSlide]);

  const consolidatedTakeaways = useMemo(() => {
    return takeaways.filter((t) => t.slide_id !== null).sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  }, [takeaways]);

  const takeawayCountBySlideId = useMemo(() => {
    const m: Record<string, number> = {};
    for (const t of takeaways) {
      if (!t.slide_id) continue;
      m[t.slide_id] = (m[t.slide_id] ?? 0) + 1;
    }
    return m;
  }, [takeaways]);

  const isLoading = loadingProject || loadingSlides || loadingTakeaways || loadingPipeline;

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Projeto não encontrado</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Topbar */}
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center gap-4">
          <Link to="/app/projects" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-foreground">{project.name}</h1>
            <p className="text-xs text-muted-foreground">Status: {project.status}</p>
          </div>
        </div>
      </header>

      {/* 3-col workspace */}
      <div className="flex flex-1 min-h-0">
        {/* Left: slides */}
        <aside className="w-64 border-r border-border bg-card overflow-y-auto p-4 hidden md:block">
          <h2 className="mb-3 text-sm font-semibold text-foreground">Slides</h2>
          <div className="space-y-2">
            {slides.map((slide) => (
              <button
                key={slide.id}
                onClick={() => setSelectedSlide(slide)}
                className={`w-full text-left rounded-lg border p-2 transition-colors ${
                  selectedSlide?.id === slide.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-muted"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">#{slide.index + 1}</span>
                  {takeawayCountBySlideId[slide.id] > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {takeawayCountBySlideId[slide.id]}
                    </Badge>
                  )}
                </div>
                <p className="mt-1 text-sm text-foreground truncate">{slide.title_guess || `Slide ${slide.index + 1}`}</p>
              </button>
            ))}
          </div>
        </aside>

        {/* Center: canvas */}
        <main className="flex-1 min-w-0 overflow-y-auto p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="mb-4">
              <TabsTrigger value="takeaways-by-slide">Takeaways por Slide</TabsTrigger>
              <TabsTrigger value="consolidated">Consolidados</TabsTrigger>
              <TabsTrigger value="outline">Outline</TabsTrigger>
            </TabsList>

            <TabsContent value="takeaways-by-slide" className="h-full">
              {selectedSlide ? (
                <div className="space-y-6">
                  <Card className="overflow-hidden">
                    {selectedSlide.preview_image_url ? (
                      <img
                        src={selectedSlide.preview_image_url}
                        alt={`Slide ${selectedSlide.index + 1}`}
                        className="w-full h-64 object-contain bg-muted"
                      />
                    ) : (
                      <div className="w-full h-64 flex items-center justify-center bg-muted text-muted-foreground">
                        <FileText className="h-12 w-12" />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground">
                        {selectedSlide.title_guess || `Slide ${selectedSlide.index + 1}`}
                      </h3>
                      {selectedSlide.extracted_text && (
                        <p className="mt-2 text-sm text-muted-foreground">{selectedSlide.extracted_text}</p>
                      )}
                    </div>
                  </Card>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-foreground">Takeaways</h3>
                    {slideTakeaways.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Nenhum takeaway para este slide.</p>
                    ) : (
                      slideTakeaways.map((takeaway) => (
                        <Card key={takeaway.id} className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <p className="text-sm text-foreground">{takeaway.text}</p>
                            <Badge variant={takeaway.score >= 4 ? "default" : "secondary"} className="shrink-0">
                              {takeaway.score}
                            </Badge>
                          </div>
                        </Card>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">Selecione um slide</p>
              )}
            </TabsContent>

            <TabsContent value="consolidated">
              <div className="space-y-3">
                {consolidatedTakeaways.length === 0 ? (
                  <p className="text-muted-foreground">Nenhum takeaway consolidado.</p>
                ) : (
                  consolidatedTakeaways.map((takeaway) => (
                    <Card key={takeaway.id} className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <p className="text-sm text-foreground">{takeaway.text}</p>
                        <Badge variant={takeaway.score >= 4 ? "default" : "secondary"} className="shrink-0">
                          {takeaway.score}
                        </Badge>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="outline">
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">Outline do deck em construção.</p>
              </Card>
            </TabsContent>
          </Tabs>
        </main>

        {/* Right: pipeline */}
        <aside className="w-72 border-l border-border bg-card overflow-y-auto p-4 hidden lg:block">
          <h2 className="mb-4 text-sm font-semibold text-foreground">Pipeline</h2>
          {pipelineRun ? (
            <div className="space-y-3">
              {pipelineSteps.map((step, index) => {
                const stepIndex = pipelineSteps.indexOf(pipelineRun.current_step);
                const isCompleted = index < stepIndex || pipelineRun.status === "READY";
                const isActive = step === pipelineRun.current_step && pipelineRun.status === "PROCESSING";
                const isFailed = pipelineRun.status === "FAILED" && step === pipelineRun.current_step;

                return (
                  <div key={step} className="flex items-center gap-3">
                    <div
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs ${
                        isFailed
                          ? "bg-destructive text-destructive-foreground"
                          : isCompleted
                          ? "bg-green-500 text-white"
                          : isActive
                          ? "bg-primary text-primary-foreground animate-pulse"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isFailed ? <AlertCircle className="h-3 w-3" /> : isCompleted ? <CheckCircle2 className="h-3 w-3" /> : index + 1}
                    </div>
                    <span className={`text-sm ${isActive ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                      {step.replace("_", " ")}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Nenhuma execução de pipeline.</p>
          )}
        </aside>
      </div>
    </div>
  );
}
