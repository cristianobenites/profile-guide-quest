import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/seed")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json();
        const { email, password, name } = body;
        if (!email || !password) {
          return new Response("Missing email/password", { status: 400 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { name, role: "normann_admin" },
        });

        if (error) {
          return Response.json({ error: error.message }, { status: 500 });
        }

        return Response.json({ userId: data.user?.id });
      },
    },
  },
});
