import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Props = {
  onTranscript: (text: string) => void;
};

// Usa Web Speech API (reconhecimento nativo do navegador, sem custo de servidor)
export function AudioAnswerButton({ onTranscript }: Props) {
  const [recording, setRecording] = useState(false);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setSupported(false);
      return;
    }
    const rec = new SR();
    rec.lang = "pt-BR";
    rec.continuous = true;
    rec.interimResults = false;
    rec.onresult = (event: any) => {
      let finalText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) finalText += event.results[i][0].transcript + " ";
      }
      if (finalText.trim()) onTranscript(finalText.trim());
    };
    rec.onerror = (e: any) => {
      toast.error(`Erro no áudio: ${e.error ?? "desconhecido"}`);
      setRecording(false);
    };
    rec.onend = () => setRecording(false);
    recognitionRef.current = rec;
    return () => {
      try {
        rec.stop();
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggle() {
    const rec = recognitionRef.current;
    if (!rec) return;
    if (recording) {
      rec.stop();
      setRecording(false);
    } else {
      try {
        rec.start();
        setRecording(true);
      } catch (e: any) {
        toast.error("Não foi possível iniciar a gravação");
      }
    }
  }

  if (!supported) {
    return (
      <button
        type="button"
        disabled
        className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground/50 px-3 py-2 rounded-lg border border-border"
        title="Seu navegador não suporta entrada por voz"
      >
        <MicOff className="size-3.5" /> Áudio indisponível
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={`inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest px-3 py-2 rounded-lg border transition-all ${
        recording
          ? "bg-primary text-primary-foreground border-primary animate-pulse"
          : "bg-card border-border hover:border-primary text-foreground"
      }`}
    >
      {recording ? (
        <>
          <Loader2 className="size-3.5 animate-spin" /> Gravando... clique para parar
        </>
      ) : (
        <>
          <Mic className="size-3.5" /> Responder por áudio
        </>
      )}
    </button>
  );
}
