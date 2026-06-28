import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/app/profile")({
  component: ProfilePage,
  head: () => ({
    meta: [
      { title: "Perfil · StraightCut" },
      { name: "description", content: "Gerencie suas preferências de conta" },
    ],
  }),
});

function ProfilePage() {
  const { user } = Route.useRouteContext();
  const [profile, setProfile] = useState<{ name?: string | null; email?: string | null; role?: string; mfa_enabled?: boolean } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("name, email, role, mfa_enabled")
        .eq("id", user.id)
        .single();
      setProfile(data ?? { email: user.email, name: user.user_metadata?.name ?? user.email, role: "viewer", mfa_enabled: false });
    };
    void load();
  }, [user.id, user.email, user.user_metadata]);

  const handleSave = async () => {
    if (!profile) return;
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({ name: profile.name })
      .eq("id", user.id);
    setLoading(false);
    if (error) {
      toast.error("Erro ao salvar perfil");
    } else {
      toast.success("Perfil atualizado");
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-semibold text-foreground mb-2">Perfil</h1>
        <p className="text-muted-foreground mb-8">Gerencie suas preferências de conta</p>

        <Card className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={profile?.name ?? ""}
              onChange={(e) => setProfile((p) => ({ ...p!, name: e.target.value }))}
              placeholder="Seu nome"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={profile?.email ?? ""} disabled />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="mfa">Autenticação em dois fatores</Label>
              <p className="text-sm text-muted-foreground">{profile?.mfa_enabled ? "Ativada" : "Desativada"}</p>
            </div>
            <Switch id="mfa" checked={profile?.mfa_enabled ?? false} disabled />
          </div>

          <Button onClick={handleSave} disabled={loading} className="w-full">
            {loading ? "Salvando..." : "Salvar alterações"}
          </Button>
        </Card>
      </div>
    </div>
  );
}
