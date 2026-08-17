"use client";
import { useEffect, useRef, useState } from "react";
import { Mic, Square, Play, Pause, Trash2 } from "lucide-react";

interface Props {
  onAudioReady: (blob: Blob | null, fileName: string) => void;
}

export default function VoiceRecorder({ onAudioReady }: Props) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(false);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
  }, [audioUrl]);

  const start = async () => {
    setError(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      recorderRef.current = rec;
      chunksRef.current = [];
      setDuration(0);

      rec.ondataavailable = (e) => e.data.size > 0 && chunksRef.current.push(e.data);
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        onAudioReady(blob, `voice-${Date.now()}.webm`);
        stream.getTracks().forEach((t) => t.stop());
      };

      rec.start();
      setIsRecording(true);
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
    } catch {
      setError(true);
    }
  };

  const stop = () => {
    if (recorderRef.current && isRecording) {
      recorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const togglePlay = () => {
    if (!audioUrl) return;
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => setIsPlaying(false);
    }
    isPlaying ? (audioRef.current.pause(), setIsPlaying(false))
              : (audioRef.current.play(), setIsPlaying(true));
  };

  const remove = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioBlob(null);
    setAudioUrl(null);
    setDuration(0);
    audioRef.current = null;
    onAudioReady(null, "");
  };

  const fmt = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div>
      {error && (
        <p className="text-sm text-red-400 mb-2">
          Impossible d'accéder au micro. Vérifiez les permissions.
        </p>
      )}

      {!audioBlob ? (
        <button
          type="button"
          onClick={isRecording ? stop : start}
          className={`w-full flex items-center justify-center gap-3 px-5 py-3 rounded-lg font-semibold border transition-all ${
            isRecording
              ? "bg-red-500/10 text-red-400 border-red-500/50 animate-pulse"
              : "bg-background text-foreground border-border hover:ring-2 hover:ring-primary"
          }`}
        >
          {isRecording ? <Square size={18} /> : <Mic size={18} className="text-primary" />}
          {isRecording ? `Arrêter (${fmt(duration)})` : "Enregistrer un message vocal (optionnel)"}
        </button>
      ) : (
        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
          <button type="button" onClick={togglePlay}
            className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-accent transition-colors">
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">Message vocal</p>
            <p className="text-xs text-foreground/60">{fmt(duration)}</p>
          </div>
          <button type="button" onClick={remove} className="p-2 text-foreground/60 hover:text-red-400">
            <Trash2 size={18} />
          </button>
        </div>
      )}
    </div>
  );
}