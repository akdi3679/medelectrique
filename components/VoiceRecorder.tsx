// components/VoiceRecorder.tsx
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Mic, Square, Play, Pause, Trash2, AlertCircle, Volume2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n-context";

interface Props {
  onAudioReady: (
    blob: Blob | null,
    fileName: string,
    durationMs?: number
  ) => void;
  disabled?: boolean;
}

// ⭐ Constantes de détection de silence
const SILENCE_THRESHOLD = 0.015; // Niveau minimum considéré comme "parole"
const SILENCE_DURATION_MS = 3000; // 3 secondes de silence = auto-stop
const MAX_DURATION_MS = 120000; // Sécurité : 2 minutes max

export default function VoiceRecorder({ onAudioReady, disabled = false }: Props) {
  const { language } = useLanguage();
  const lang = language as "fr" | "en" | "ar";

  const strings = {
    fr: {
      record: "Enregistrer un message vocal",
      stop: "Arrêter",
      listening: "🎙️ Enregistrement en cours...",
      silenceWarning: "⚠️ Silence détecté — arrêt automatique imminent",
      voiceMessage: "Message vocal",
      delete: "Supprimer",
      noMic: "Impossible d'accéder au micro. Vérifiez les permissions.",
      disabled: "Effacez le texte pour enregistrer un vocal",
      stoppedBySilence: "Arrêt automatique (silence détecté)",
    },
    en: {
      record: "Record voice message",
      stop: "Stop",
      listening: "🎙️ Recording...",
      silenceWarning: "⚠️ Silence detected — auto-stop imminent",
      voiceMessage: "Voice message",
      delete: "Delete",
      noMic: "Cannot access microphone. Check permissions.",
      disabled: "Clear the text to record voice",
      stoppedBySilence: "Auto-stopped (silence detected)",
    },
    ar: {
      record: "تسجيل رسالة صوتية",
      stop: "إيقاف",
      listening: "🎙️ جارٍ التسجيل...",
      silenceWarning: "⚠️ تم اكتشاف صمت — إيقاف تلقائي وشيك",
      voiceMessage: "رسالة صوتية",
      delete: "حذف",
      noMic: "تعذر الوصول إلى الميكروفون. تحقق من الأذونات.",
      disabled: "امسح النص لتسجيل الصوت",
      stoppedBySilence: "إيقاف تلقائي (تم اكتشاف صمت)",
    },
  };

  const t = strings[lang];

  // ────────────────────────────────────────────
  // States UI
  // ────────────────────────────────────────────
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [displayDuration, setDisplayDuration] = useState(0); // en secondes
  const [error, setError] = useState<string | null>(null);
  const [silenceDetected, setSilenceDetected] = useState(false);
const gainNodeRef = useRef<GainNode | null>(null);

// ⭐ AJOUTER une constante pour le niveau d'amplification
const AUDIO_GAIN = 2.5; // 2.5x plus fort (augmente à 3.0 si encore trop faible)

  // ────────────────────────────────────────────
  // Refs (pas de re-render)
  // ────────────────────────────────────────────
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // ⭐ Timer basé sur timestamps (précis)
  const startTimeRef = useRef<number>(0);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  // ⭐ Détection de silence
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const silenceCheckIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastSoundTimeRef = useRef<number>(0);
  const silenceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // ⭐ Flag pour éviter les double-stops
  const isStoppingRef = useRef(false);

  // ────────────────────────────────────────────
  // Helpers
  // ────────────────────────────────────────────


// Dans VoiceRecorder.tsx

// ⭐ NOUVELLE VERSION : Force AAC (codec universel)
const getMimeType = useCallback((): string => {
  const types = [
    // AAC dans MP4 = standard mondial des messages vocaux
    { mime: "audio/mp4;codecs=mp4a.40.2", ext: "m4a" },
    { mime: "audio/mp4;codecs=aac", ext: "m4a" },
    { mime: "audio/aac", ext: "aac" },
    { mime: "audio/mp4", ext: "m4a" },
    // MP3 fallback
    { mime: "audio/mpeg", ext: "mp3" },
  ];

  for (const { mime } of types) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(mime)) {
      console.log('[VoiceRecorder] ✅ Selected MIME:', mime);
      return mime;
    }
  }

  console.warn('[VoiceRecorder] ⚠️ No preferred MIME supported');
  return "";
}, []);

// ⭐ NOUVELLE logique d'extension (dans recorder.onstop)

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // ────────────────────────────────────────────
  // ⭐ Cleanup centralisé (crucial)
  // ────────────────────────────────────────────

  const cleanupAll = useCallback(() => {
  if (timerIntervalRef.current) {
    clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = null;
  }

  if (silenceCheckIntervalRef.current) {
    clearInterval(silenceCheckIntervalRef.current);
    silenceCheckIntervalRef.current = null;
  }
  if (silenceTimeoutRef.current) {
    clearTimeout(silenceTimeoutRef.current);
    silenceTimeoutRef.current = null;
  }

  // ⭐ Disconnect le gainNode
  if (gainNodeRef.current) {
    gainNodeRef.current.disconnect();
    gainNodeRef.current = null;
  }

  if (audioContextRef.current) {
    audioContextRef.current.close().catch(() => {});
    audioContextRef.current = null;
    analyserRef.current = null;
  }

  if (streamRef.current) {
    streamRef.current.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }

  isStoppingRef.current = false;
  setIsRecording(false);
  setSilenceDetected(false);
}, []);

  // ────────────────────────────────────────────
  // Cleanup au démontage
  // ────────────────────────────────────────────

  useEffect(() => {
    return () => {
      cleanupAll();
      
      // Arrête le recorder si actif
      if (recorderRef.current && recorderRef.current.state !== "inactive") {
        recorderRef.current.stop();
      }
      recorderRef.current = null;
      
      // Revoke l'URL de l'audio
      setAudioUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      
      // Nettoie l'élément audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [cleanupAll]);

  // ────────────────────────────────────────────
  // ⭐ Détection de silence (logique principale)
  // ────────────────────────────────────────────

  const startSilenceDetection = useCallback(() => {
    if (!audioContextRef.current || !analyserRef.current) return;

    const analyser = analyserRef.current;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    lastSoundTimeRef.current = Date.now();

    const checkSilence = () => {
      if (!analyserRef.current) return;
      
      analyser.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      const normalizedVolume = average / 255;

      if (normalizedVolume >= SILENCE_THRESHOLD) {
        // ⭐ Son détecté → reset le timer de silence
        lastSoundTimeRef.current = Date.now();
        setSilenceDetected(false);
      }
    };

    // Vérifie le niveau sonore toutes les 200ms
    silenceCheckIntervalRef.current = setInterval(checkSilence, 200);

    // ⭐ Vérifie si silence trop long toutes les 500ms
    silenceTimeoutRef.current = setInterval(() => {
      const now = Date.now();
      const silenceDuration = now - lastSoundTimeRef.current;

      if (silenceDuration >= SILENCE_DURATION_MS) {
        setSilenceDetected(true);
        // Arrête l'enregistrement après 1s de warning visuel
        setTimeout(() => {
          stopRecording(true);
        }, 1000);
      }

      // ⭐ Sécurité : durée max
      const totalDuration = now - startTimeRef.current;
      if (totalDuration >= MAX_DURATION_MS) {
        stopRecording(false);
      }
    }, 500);
  }, []);

  // ────────────────────────────────────────────
  // ⭐ Timer précis (basé sur timestamps)
  // ────────────────────────────────────────────

  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now();
    setDisplayDuration(0);

    // ⭐ Met à jour l'affichage toutes les 250ms (précis)
    timerIntervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setDisplayDuration(elapsed);
    }, 250);
  }, []);

  // ────────────────────────────────────────────
  // START RECORDING
  // ────────────────────────────────────────────


// ────────────────────────────────────────────
// ⭐ startRecording avec amplification
// ────────────────────────────────────────────

const startRecording = useCallback(async () => {
  if (disabled || isRecording || isStoppingRef.current) return;

  setError(null);
  setSilenceDetected(false);

  try {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error("Microphone API unavailable");
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: false, // ⭐ Désactivé pour contrôler nous-mêmes le gain
      },
    });

    streamRef.current = stream;

    // ⭐ Setup AudioContext avec amplification
    audioContextRef.current = new AudioContext();
    const source = audioContextRef.current.createMediaStreamSource(stream);

    // ⭐ GainNode pour amplifier le signal (résout le volume faible)
    const gainNode = audioContextRef.current.createGain();
    gainNode.gain.value = AUDIO_GAIN; // 2.5x plus fort
    gainNodeRef.current = gainNode;

    // Pour détection de silence (sur le signal original)
    analyserRef.current = audioContextRef.current.createAnalyser();
    analyserRef.current.fftSize = 512;
    source.connect(analyserRef.current);

    // ⭐ Pour enregistrement : source → gain → destination (stream amplifié)
    const destination = audioContextRef.current.createMediaStreamDestination();
    source.connect(gainNode);
    gainNode.connect(destination);

    // ⭐ Le stream amplifié pour MediaRecorder
    const amplifiedStream = destination.stream;

    // Setup MediaRecorder sur le stream AMPLIFIÉ
    const mimeType = getMimeType();
    const recorder = mimeType
      ? new MediaRecorder(amplifiedStream, { mimeType })
      : new MediaRecorder(amplifiedStream);

    recorderRef.current = recorder;
    chunksRef.current = [];

    recorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

   recorder.onstop = () => {
  const finalMime = recorder.mimeType || mimeType || "audio/mp4";
  const blob = new Blob(chunksRef.current, { type: finalMime });

  console.log('[VoiceRecorder] Final blob:', {
    size: blob.size,
    type: blob.type,
    chunks: chunksRef.current.length,
    durationMs: Date.now() - startTimeRef.current,
    gain: AUDIO_GAIN,
  });

  if (blob.size === 0) {
    console.error('[VoiceRecorder] ❌ BLOB VIDE');
    setError(t.noMic);
    cleanupAll();
    return;
  }

  const url = URL.createObjectURL(blob);
  setAudioBlob(blob);
  setAudioUrl(url);
  setDisplayDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));

  // ⭐ Extension basée sur le MIME final
  let extension = "m4a";
  if (finalMime.includes("mpeg")) extension = "mp3";
  else if (finalMime.includes("aac")) extension = "aac";
  else if (finalMime.includes("opus")) {
    console.warn('[VoiceRecorder] ⚠️ Opus detected — may not play in FluffyChat');
    extension = "webm";
  }

  const filename = `voice-${Date.now()}.${extension}`;
  onAudioReady(blob, filename, Date.now() - startTimeRef.current);

  cleanupAll();
};

    recorder.onerror = () => {
      setError(t.noMic);
      cleanupAll();
    };

    recorder.start(250);
    setIsRecording(true);
    isStoppingRef.current = false;
    startTimer();
    startSilenceDetection();

  } catch (err) {
    console.error("Microphone error:", err);
    setError(t.noMic);
    cleanupAll();
  }
}, [disabled, isRecording, getMimeType, onAudioReady, startTimer, startSilenceDetection, cleanupAll, t.noMic]);
  // ────────────────────────────────────────────
  // ⭐ STOP RECORDING (manuel ou auto)
  // ────────────────────────────────────────────

  const stopRecording = useCallback((autoStopped = false) => {
    if (isStoppingRef.current) return;
    isStoppingRef.current = true;

    const recorder = recorderRef.current;
    if (!recorder || recorder.state === "inactive") {
      cleanupAll();
      return;
    }

    if (autoStopped) {
      setSilenceDetected(true);
      // Petit délai pour afficher le warning
      setTimeout(() => {
        try {
          recorder.requestData();
        } catch {}
        recorder.stop();
      }, 500);
    } else {
      try {
        recorder.requestData();
      } catch {}
      recorder.stop();
    }
  }, [cleanupAll]);

  // ────────────────────────────────────────────
  // PLAY / PAUSE
  // ────────────────────────────────────────────

  const togglePlay = useCallback(() => {
    if (!audioUrl) return;

    if (!audioRef.current) {
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => setIsPlaying(false);
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, [audioUrl, isPlaying]);

  // ────────────────────────────────────────────
  // DELETE
  // ────────────────────────────────────────────

  const remove = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    setAudioUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });

    setAudioBlob(null);
    setDisplayDuration(0);
    setIsPlaying(false);
    setError(null);

    onAudioReady(null, "", 0);
  }, [onAudioReady]);

  // ────────────────────────────────────────────
  // UI
  // ────────────────────────────────────────────

  return (
    <div>
      {/* Erreur */}
      {error && (
        <div className="flex items-start gap-2 rounded-lg bg-red-500/10 p-3 mb-3">
          <AlertCircle size={18} className="text-red-500 mt-0.5 shrink-0" />
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      {/* Warning silence détecté */}
      {silenceDetected && (
        <div className="flex items-center gap-2 rounded-lg bg-yellow-500/10 border border-yellow-500/30 p-3 mb-3">
          <Volume2 size={16} className="text-yellow-600" />
          <p className="text-sm text-yellow-700">{t.stoppedBySilence}</p>
        </div>
      )}

      {/* Pas d'audio enregistré */}
      {!audioBlob ? (
        <div className="space-y-2">
          <button
            type="button"
            onClick={isRecording ? () => stopRecording(false) : startRecording}
            disabled={disabled}
            aria-label={isRecording ? t.stop : t.record}
            className={`w-full flex items-center justify-center gap-3 px-5 py-3 rounded-lg font-semibold border transition-all ${
              disabled
                ? "bg-muted/50 text-foreground/40 border-border/50 cursor-not-allowed"
                : isRecording
                ? "bg-red-500/10 text-red-500 border-red-500/50 animate-pulse"
                : "bg-background text-foreground border-border hover:ring-2 hover:ring-primary"
            }`}
            title={disabled ? t.disabled : undefined}
          >
            {isRecording ? (
              <Square size={18} />
            ) : (
              <Mic size={18} className="text-primary" />
            )}

            {isRecording
              ? `${t.stop} (${formatDuration(displayDuration)})`
              : disabled
              ? t.disabled
              : t.record}
          </button>

          {/* Status pendant l'enregistrement */}
          {isRecording && (
            <div className="flex items-center justify-between px-4 py-2 rounded-lg bg-muted/50 text-xs">
              <span className="text-foreground/70 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                {t.listening}
              </span>
              <span className="text-foreground/50 font-mono">
                {formatDuration(displayDuration)} / 2:00
              </span>
            </div>
          )}
        </div>
      ) : (
        /* Audio enregistré */
        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-accent transition-colors shrink-0"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">{t.voiceMessage}</p>
            <p className="text-xs text-foreground/60 font-mono">
              {formatDuration(displayDuration)}
            </p>
          </div>

          <button
            type="button"
            onClick={remove}
            aria-label={t.delete}
            className="p-2 text-foreground/60 hover:text-red-500 transition-colors shrink-0"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )}
    </div>
  );
}