import { Link } from "@tanstack/react-router";

export function Nav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md px-6 py-4 flex justify-between items-center">
      <Link to="/" className="flex items-center gap-2 group">
        <div className="size-8 bg-primary rounded-sm flex items-center justify-center text-primary-foreground font-mono font-bold group-hover:bg-accent transition-colors">
          A
        </div>
        <span className="font-extrabold tracking-tighter text-xl uppercase">Axioma IA</span>
      </Link>
      <div className="hidden md:flex items-center gap-6 text-sm font-medium uppercase tracking-wider">
        <Link to="/perfil" className="hover:text-primary transition-colors" activeProps={{ className: "text-primary" }}>
          Perfil
        </Link>
        <Link to="/tecnico" className="hover:text-primary transition-colors" activeProps={{ className: "text-primary" }}>
          Técnico
        </Link>
        <Link
          to="/upload"
          className="bg-foreground text-background px-5 py-2 rounded-full hover:bg-primary transition-colors"
        >
          Enviar PDF
        </Link>
      </div>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="py-12 border-t border-border bg-card mt-24 text-center">
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        Axioma IA Educacional · {new Date().getFullYear()} · Protocolo de Diagnóstico
      </p>
    </footer>
  );
}
