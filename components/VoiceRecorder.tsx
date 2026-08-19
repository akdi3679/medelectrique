"use client";

import { useEffect, useRef, useState } from "react";
import {
  Mic,
  Square,
  Play,
  Pause,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n-context";

interface Props {
  onAudioReady: (
    blob: Blob | null,
    fileName: string,
    durationMs?: number
  ) => void;
  disabled?: boolean;
}

export default function VoiceRecorder({
  onAudioReady,
  disabled = false,
}: Props) {
  const { language } = useLanguage();
  const lang = language as "fr" | "en" | "ar";

  const strings = {
    fr: {
      record: "Enregistrer un message vocal",
      stop: "Arrêter",
      listening: "Écoute...",
      voiceMessage: "Message vocal",
      delete: "Supprimer",
      noMic: "Impossible d'accéder au micro. Vérifiez les permissions.",
      disabled: "Effacez le texte pour enregistrer un vocal",
    },
    en: {
      record: "Record voice message",
      stop: "Stop",
      listening: "Listening...",
      voiceMessage: "Voice message",
      delete: "Delete",
      noMic: "Cannot access microphone. Check your microphone permissions.",
      disabled: "Clear the text to record voice",
    },
    ar: {
      record: "تسجيل رسالة صوتية",
      stop: "إيقاف",
      listening: "جارٍ الاستماع...",
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

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const isRecordingRef = useRef(false);
  const durationRef = useRef(0);

  // --------------------------------------------------
  // Cleanup
  // --------------------------------------------------

  useEffect(() => {
    return () => {
      cleanupRecording();

      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const cleanupRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });

      streamRef.current = null;
    }

    isRecordingRef.current = false;
    setIsRecording(false);
  };

  // --------------------------------------------------
  // Find supported MIME type
  // --------------------------------------------------

  const getMimeType = () => {
    const types = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/ogg;codecs=opus",
      "audio/mp4",
    ];

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }

    return "";
  };

  // --------------------------------------------------
  // START
  // --------------------------------------------------

  const start = async () => {
    if (disabled || isRecordingRef.current) return;

    setError(false);

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Microphone API unavailable");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      streamRef.current = stream;

      const mimeType = getMimeType();

      console.log("MediaRecorder MIME:", mimeType);

      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      recorderRef.current = recorder;

      chunksRef.current = [];
      durationRef.current = 0;

      setDuration(0);
      setAudioBlob(null);

      // --------------------------------------------
      // DATA ARRIVES EVERY 250ms
      // --------------------------------------------

      recorder.ondataavailable = (event) => {
        console.log(
          "Audio chunk:",
          event.data.size,
          event.data.type
        );

        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      // --------------------------------------------
      // RECORDING STOPPED
      // --------------------------------------------

      recorder.onstop = () => {
        console.log("Recorder stopped");
        console.log("Chunks:", chunksRef.current.length);

        const finalMime =
          recorder.mimeType ||
          mimeType ||
          "audio/webm";

        const blob = new Blob(chunksRef.current, {
          type: finalMime,
        });

        console.log("FINAL AUDIO:", {
          type: blob.type,
          size: blob.size,
          duration: durationRef.current,
          chunks: chunksRef.current.length,
        });

        if (blob.size === 0) {
          console.error("❌ AUDIO BLOB IS EMPTY");

          cleanupRecording();
          setError(true);
          return;
        }

        const url = URL.createObjectURL(blob);

        setAudioBlob(blob);
        setAudioUrl(url);

        const extension =
          finalMime.includes("ogg")
            ? "ogg"
            : finalMime.includes("mp4")
            ? "mp4"
            : "webm";

        const filename = `voice-${Date.now()}.${extension}`;

        onAudioReady(
          blob,
          filename,
          durationRef.current * 1000
        );

        cleanupRecording();
      };

      recorder.onerror = (event) => {
        console.error("MediaRecorder error:", event);

        cleanupRecording();
        setError(true);
      };

      // --------------------------------------------
      // IMPORTANT:
      // Produce chunks every 250ms
      // --------------------------------------------

      recorder.start(250);

      isRecordingRef.current = true;
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        durationRef.current += 1;
        setDuration(durationRef.current);
      }, 1000);

      console.log("🎙️ Recording started");
    } catch (err) {
      console.error("Microphone error:", err);

      cleanupRecording();
      setError(true);
    }
  };

  // --------------------------------------------------
  // STOP
  // --------------------------------------------------

  const stop = () => {
    const recorder = recorderRef.current;

    if (!recorder || recorder.state === "inactive") {
      return;
    }

    console.log("Stopping recorder...");

    isRecordingRef.current = false;
    setIsRecording(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Force the last chunk to be emitted
    try {
      recorder.requestData();
    } catch {}

    // Give the final dataavailable event time to arrive
    setTimeout(() => {
      if (recorder.state !== "inactive") {
        recorder.stop();
      }
    }, 50);
  };

  // --------------------------------------------------
  // PLAY
  // --------------------------------------------------

  const togglePlay = () => {
    if (!audioUrl) return;

    if (!audioRef.current) {
      const audio = new Audio(audioUrl);

      audioRef.current = audio;

      audio.onended = () => {
        setIsPlaying(false);
      };

      audio.onerror = (err) => {
        console.error("Audio playback error:", err);
      };
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.error("Playback failed:", err);
        });
    }
  };

  // --------------------------------------------------
  // DELETE
  // --------------------------------------------------

  const remove = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }

    setAudioBlob(null);
    setAudioUrl(null);
    setDuration(0);
    durationRef.current = 0;
    setIsPlaying(false);

    onAudioReady(null, "", 0);
  };

  // --------------------------------------------------
  // FORMAT
  // --------------------------------------------------

  const fmt = (seconds: number) => {
    return `${Math.floor(seconds / 60)}:${(seconds % 60)
      .toString()
      .padStart(2, "0")}`;
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div>
      {error && (
        <div className="flex items-start gap-2 rounded-lg bg-red-500/10 p-3 mb-2">
          <AlertCircle
            size={18}
            className="text-red-500 mt-0.5 shrink-0"
          />

          <p className="text-sm text-red-500">
            {t.noMic}
          </p>
        </div>
      )}

      {!audioBlob ? (
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
          {isRecording ? (
            <Square size={18} />
          ) : (
            <Mic size={18} className="text-primary" />
          )}

          {isRecording
            ? `${t.stop} (${fmt(duration)})`
            : disabled
            ? t.disabled
            : t.record}
        </button>
      ) : (
        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
          <button
            type="button"
            onClick={togglePlay}
            className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-accent transition-colors"
          >
            {isPlaying ? (
              <Pause size={18} />
            ) : (
              <Play size={18} />
            )}
          </button>

          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">
              {t.voiceMessage}
            </p>

            <p className="text-xs text-foreground/60">
              {fmt(duration)}
            </p>

            <p className="text-[10px] text-foreground/40">
              {audioBlob.size} bytes
            </p>
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