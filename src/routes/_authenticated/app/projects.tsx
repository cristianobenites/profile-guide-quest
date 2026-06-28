import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Loader2, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProjects } from "@/lib/projects.functions";
import type { ProjectStatus } from "@/types/takeaways";

export const Route = createFileRoute("/_authenticated/app/projects")({
  component: ProjectsPage,
  head: () => ({
    meta: [
      { title: "Biblioteca · StraightCut" },
      { name: "description", content: "Gerencie seus projetos de síntese executiva" },
    ],
  }),
});

function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "ALL">("ALL");
  const navigate = useNavigate();

  const { data: projects = [], isLoading: isLoadingProjects } = useQuery({
    queryKey: ["projects", statusFilter, searchQuery],
    queryFn: () => getProjects({ data: { status: statusFilter, q: searchQuery } }),
  });

  const [processingToasts, setProcessingToasts] = useState<Record<string, { name: string; done: boolean }>>({});
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const processingProjects = projects.filter((p) => p.status === "PROCESSING");
    if (processingProjects.length === 0) {
      if (pollingRef.current) clearInterval(pollingRef.current);
      return;
    }

    setProcessingToasts((prev) => {
      const next = { ...prev };
      processingProjects.forEach((p) => {
        if (!next[p.id]) next[p.id] = { name: p.name, done: false };
      });
      return next;
    });

    const poll = async () => {
      await Promise.all(
        processingProjects.map(async (p) => {
          // Polling placeholder — real status check via server function in next phase
          // For now just mark as done after 10s to simulate
          setTimeout(() => {
            setProcessingToasts((prev) => ({ ...prev, [p.id]: { name: p.name, done: true } }));
          }, 10000);
        })
      );
    };

    pollingRef.current = setInterval(() => void poll(), 4000);
    return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      if (statusFilter !== "ALL" && project.status !== statusFilter) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return project.name.toLowerCase().includes(query);
      }
      return true;
    });
  }, [projects, searchQuery, statusFilter]);

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">Biblioteca</h1>
            <p className="mt-1 text-muted-foreground">Gerencie seus projetos de síntese executiva</p>
          </div>
          <Link to="/app/projects/new">
            <Button size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Novo Projeto
            </Button>
          </Link>
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ProjectStatus | "ALL")}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filtrar status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos</SelectItem>
              <SelectItem value="DRAFT">Rascunho</SelectItem>
              <SelectItem value="PROCESSING">Processando</SelectItem>
              <SelectItem value="READY">Pronto</SelectItem>
              <SelectItem value="FAILED">Falhou</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoadingProjects ? (
          <Card className="border-dashed p-12 text-center" aria-live="polite">
            <div className="mx-auto flex max-w-md flex-col items-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">Carregando biblioteca</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Estamos buscando suas apresentações. Isso leva só alguns instantes.
              </p>
            </div>
          </Card>
        ) : filteredProjects.length === 0 ? (
          <Card className="border-dashed p-12 text-center">
            <div className="mx-auto max-w-md">
              <h3 className="text-lg font-semibold text-foreground">Nenhum projeto encontrado</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {searchQuery || statusFilter !== "ALL"
                  ? "Tente ajustar os filtros de busca"
                  : "Comece criando seu primeiro projeto"}
              </p>
              {!searchQuery && statusFilter === "ALL" && (
                <Link to="/app/projects/new">
                  <Button className="mt-4 gap-2">
                    <Plus className="h-4 w-4" />
                    Criar Novo Projeto
                  </Button>
                </Link>
              )}
            </div>
          </Card>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Link to="/app/projects/new" aria-label="Criar nova apresentação">
              <Card className="flex h-full min-h-[126px] items-center justify-center rounded-xl border-2 border-dashed border-border bg-background/40 p-4 text-center shadow-none transition-all hover:border-primary/40 hover:bg-primary/5">
                <div className="flex flex-col items-center">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Plus className="h-5 w-5" />
                  </span>
                  <h3 className="mt-3 text-base font-semibold text-foreground">Nova apresentação</h3>
                  <p className="mt-1.5 text-xs text-muted-foreground">Upload de PPTX ou PDF</p>
                </div>
              </Card>
            </Link>
            {filteredProjects.map((project) => (
              <Card
                key={project.id}
                className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md cursor-pointer"
                onClick={() => navigate({ to: "/app/projects/$id", params: { id: project.id } })}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-foreground">{project.name}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">Status: {project.status}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {Object.entries(processingToasts).length > 0 && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
          {Object.entries(processingToasts).map(([id, toast]) => (
            <div
              key={id}
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-lg shadow-black/10 backdrop-blur-sm transition-all ${
                toast.done
                  ? "border-green-300 bg-green-50 dark:bg-green-900/20"
                  : "border-border bg-card"
              }`}
            >
              {toast.done ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
              ) : (
                <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" />
              )}
              <p className="text-sm font-medium text-foreground">
                {toast.done ? `"${toast.name}" foi processado` : `"${toast.name}" está sendo processado`}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
