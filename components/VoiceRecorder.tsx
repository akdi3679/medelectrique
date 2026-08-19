"use client";
import { useEffect, useRef, useState } from "react";
import { Mic, Square, Play, Pause, Trash2, AlertCircle } from "lucide-react";
import { useLanguage } from "@/lib/i18n-context";

interface Props {
  onAudioReady: (
    blob: Blob | null,
    fileName: string,
    durationMs?: number
  ) => void;

  disabled?: boolean;
}

export default function VoiceRecorder({ onAudioReady, disabled = false }: Props) {
  const { language } = useLanguage();
  
  const lang = language as "fr" | "en" | "ar";
const finishRecording = () => {
  streamRef.current
    ?.getTracks()
    .forEach((track) => track.stop());

  streamRef.current = null;

  if (audioContextRef.current) {
    audioContextRef.current.close();
    audioContextRef.current = null;
  }

  if (timerRef.current) {
    clearInterval(timerRef.current);
    timerRef.current = null;
  }

  setIsAnalyzing(false);
  setSilenceCountdown(null);
};
  const strings = {
    fr: {
      record: "Enregistrer un message vocal",
      stop: "Arrêter",
      listening: "Écoute...",
      silenceWarning: "Silence détecté — arrêt automatique dans",
      seconds: "secondes",
      voiceMessage: "Message vocal",
      delete: "Supprimer",
      noMic: "Impossible d'accéder au micro. Vérifiez les permissions.",
      disabled: "Effacez le texte pour enregistrer un vocal",
    },
    en: {
      record: "Record voice message",
      stop: "Stop",
      listening: "Listening...",
      silenceWarning: "Silence detected — auto-stop in",
      seconds: "seconds",
      voiceMessage: "Voice message",
      delete: "Delete",
      noMic: "Cannot access microphone. Check permissions.",
      disabled: "Clear text to record voice",
    },
    ar: {
      record: "تسجيل رسالة صوتية",
      stop: "إيقاف",
      listening: "جارٍ الاستماع...",
      silenceWarning: "تم اكتشاف صمت — إيقاف تلقائي خلال",
      seconds: "ثوانٍ",
      voiceMessage: "رسالة صوتية",
      delete: "حذف",
      noMic: "تعذر الوصول إلى الميكروفون. تحقق من الأذونات.",
      disabled: "امسح النص لتسجيل الصوت",
    },
  };

  const t = strings[lang];

  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(false);
  const [silenceCountdown, setSilenceCountdown] = useState<number | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const SILENCE_THRESHOLD = 0.01; // Volume minimum considéré comme "parole"
  const SILENCE_DURATION = 3000; // 3 secondes de silence = auto-stop
  const COUNTDOWN_SECONDS = 3;

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (audioContextRef.current) audioContextRef.current.close();
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    };
  }, [audioUrl]);

  const detectSilence = () => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
    const normalizedVolume = average / 255;

    if (normalizedVolume < SILENCE_THRESHOLD) {
      if (!silenceTimerRef.current) {
        silenceTimerRef.current = setTimeout(() => {
          // Lance le countdown
          setSilenceCountdown(COUNTDOWN_SECONDS);
          countdownRef.current = setInterval(() => {
            setSilenceCountdown((prev) => {
              if (prev === null || prev <= 1) {
                if (countdownRef.current) clearInterval(countdownRef.current);
                stop();
                return null;
              }
              return prev - 1;
            });
          }, 1000);
        }, SILENCE_DURATION);
      }
    } else {
      // Reset si du son est détecté
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
      setSilenceCountdown(null);
    }

    if (isRecording) {
      requestAnimationFrame(detectSilence);
    }
  };

  const start = async () => {
    if (disabled) return;
    setError(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const rec = new MediaRecorder(stream);
      recorderRef.current = rec;
      chunksRef.current = [];
      setDuration(0);

      // Setup audio analyzer pour détection de silence
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 512;
      source.connect(analyserRef.current);
      setIsAnalyzing(true);

     rec.ondataavailable = (e) => {
  if (e.data && e.data.size > 0) {
    chunksRef.current.push(e.data);
  }
};

rec.onstop = () => {
  const mimeType =
    rec.mimeType || "audio/webm";

  const blob = new Blob(
    chunksRef.current,
    { type: mimeType }
  );

  console.log("Recorded audio:", {
    mimeType,
    size: blob.size,
    chunks: chunksRef.current.length,
  });

  const url = URL.createObjectURL(blob);

  const audio = new Audio();

  audio.onloadedmetadata = () => {
    const actualDuration =
      Math.round(audio.duration * 1000);

    console.log("Audio duration:", actualDuration);

    setAudioBlob(blob);
    setAudioUrl(url);

    onAudioReady(
      blob,
      `voice-${Date.now()}.webm`,
      actualDuration
    );

    finishRecording();
  };

  audio.onerror = () => {
    console.error(
      "Cannot read recorded audio"
    );

    // Still return the blob if browser
    // cannot read metadata.
    setAudioBlob(blob);
    setAudioUrl(url);

    onAudioReady(
      blob,
      `voice-${Date.now()}.webm`,
      duration * 1000
    );

    finishRecording();
  };

  audio.src = url;
};

      rec.start();
      setIsRecording(true);
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
      detectSilence();
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
        <div className="flex items-start gap-2 rounded-lg bg-red-500/10 p-3 mb-2">
          <AlertCircle size={18} className="text-red-500 mt-0.5 shrink-0" />
          <p className="text-sm text-red-500">{t.noMic}</p>
        </div>
      )}

      {!audioBlob ? (
        <div>
          <button
            type="button"
            onClick={isRecording ? stop : start}
            disabled={disabled}
            className={`w-full flex items-center justify-center gap-3 px-5 py-3 rounded-lg font-semibold border transition-all ${
              disabled
                ? "bg-muted/50 text-foreground/40 border-border/50 cursor-not-allowed"
                : isRecording
                ? "bg-red-500/10 text-red-500 border-red-500/50 animate-pulse"
                : "bg-background text-foreground border-border hover:ring-2 hover:ring-primary"
            }`}
            title={disabled ? t.disabled : undefined}
          >
            {isRecording ? <Square size={18} /> : <Mic size={18} className="text-primary" />}
            {isRecording 
              ? `${t.stop} (${fmt(duration)})` 
              : disabled 
                ? t.disabled 
                : t.record}
          </button>
          
          {isAnalyzing && (
            <p className="text-xs text-foreground/60 mt-2 text-center">
              {isRecording && !silenceCountdown && `🎙️ ${t.listening}`}
            </p>
          )}

          {silenceCountdown !== null && (
            <div className="flex items-center gap-2 mt-2 p-2 bg-yellow-500/10 rounded-lg">
              <AlertCircle size={16} className="text-yellow-600" />
              <p className="text-sm text-yellow-700">
                {t.silenceWarning} <strong>{silenceCountdown}</strong> {t.seconds}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
          <button 
            type="button" 
            onClick={togglePlay}
            className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-accent transition-colors"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">{t.voiceMessage}</p>
            <p className="text-xs text-foreground/60">{fmt(duration)}</p>
          </div>
          <button 
            type="button" 
            onClick={remove} 
            className="p-2 text-foreground/60 hover:text-red-500 transition-colors"
            aria-label={t.delete}
          >
            <Trash2 size={18} />
          </button>
        </div>
      )}
    </div>
  );
}