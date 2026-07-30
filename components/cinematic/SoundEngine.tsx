"use client";

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

interface SoundContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playClick: () => void;
  playHover: () => void;
  playWhoosh: () => void;
}

const SoundContext = createContext<SoundContextType>({
  isMuted: true,
  toggleMute: () => {},
  playClick: () => {},
  playHover: () => {},
  playWhoosh: () => {},
});

export const useSound = () => useContext(SoundContext);

// ─── Synthetic Sound Generation ───
// Creates cinematic click/hover/whoosh sounds via Web Audio API oscillators
// No external audio files needed — pure synthesis

function createClickSound(audioCtx: AudioContext) {
  const now = audioCtx.currentTime;

  // Main click transient - short burst
  const osc1 = audioCtx.createOscillator();
  const gain1 = audioCtx.createGain();
  const filter1 = audioCtx.createBiquadFilter();

  osc1.type = "sine";
  osc1.frequency.setValueAtTime(1800, now);
  osc1.frequency.exponentialRampToValueAtTime(400, now + 0.08);

  filter1.type = "highpass";
  filter1.frequency.setValueAtTime(200, now);

  gain1.gain.setValueAtTime(0, now);
  gain1.gain.linearRampToValueAtTime(0.15, now + 0.003);
  gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

  osc1.connect(filter1);
  filter1.connect(gain1);
  gain1.connect(audioCtx.destination);

  osc1.start(now);
  osc1.stop(now + 0.12);

  // Sub-bass thump
  const osc2 = audioCtx.createOscillator();
  const gain2 = audioCtx.createGain();

  osc2.type = "sine";
  osc2.frequency.setValueAtTime(150, now);
  osc2.frequency.exponentialRampToValueAtTime(50, now + 0.1);

  gain2.gain.setValueAtTime(0, now);
  gain2.gain.linearRampToValueAtTime(0.08, now + 0.005);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

  osc2.connect(gain2);
  gain2.connect(audioCtx.destination);

  osc2.start(now);
  osc2.stop(now + 0.1);

  // Metallic click (noise burst)
  const bufferSize = audioCtx.sampleRate * 0.05;
  const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.1));
  }

  const noise = audioCtx.createBufferSource();
  const noiseGain = audioCtx.createGain();
  const noiseFilter = audioCtx.createBiquadFilter();

  noise.buffer = noiseBuffer;
  noiseFilter.type = "bandpass";
  noiseFilter.frequency.setValueAtTime(3000, now);
  noiseFilter.Q.setValueAtTime(2, now);

  noiseGain.gain.setValueAtTime(0.06, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(audioCtx.destination);

  noise.start(now);
  noise.stop(now + 0.05);
}

function createHoverSound(audioCtx: AudioContext) {
  const now = audioCtx.currentTime;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(2200, now);
  osc.frequency.exponentialRampToValueAtTime(2800, now + 0.06);

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.03, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(now);
  osc.stop(now + 0.08);
}

function createWhooshSound(audioCtx: AudioContext) {
  const now = audioCtx.currentTime;

  const bufferSize = audioCtx.sampleRate * 0.3;
  const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    const t = i / bufferSize;
    data[i] = (Math.random() * 2 - 1) * Math.sin(t * Math.PI) * 0.5;
  }

  const noise = audioCtx.createBufferSource();
  const gain = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();

  noise.buffer = noiseBuffer;

  filter.type = "bandpass";
  filter.frequency.setValueAtTime(800, now);
  filter.frequency.exponentialRampToValueAtTime(2000, now + 0.15);
  filter.frequency.exponentialRampToValueAtTime(400, now + 0.3);
  filter.Q.setValueAtTime(1, now);

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.04, now + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);

  noise.start(now);
  noise.stop(now + 0.3);
}

export function SoundProvider({ children }: { children: ReactNode }) {
  const [isMuted, setIsMuted] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const initializedRef = useRef(false);

  const initAudio = useCallback(() => {
    if (audioCtxRef.current) return audioCtxRef.current;
    const ctx = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext)();
    audioCtxRef.current = ctx;
    return ctx;
  }, []);

  const toggleMute = useCallback(() => {
    if (!initializedRef.current) {
      initAudio();
      initializedRef.current = true;
    }
    setIsMuted((prev) => !prev);
  }, [initAudio]);

  // Auto-initialize audio context on first user interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!initializedRef.current) {
        initAudio();
        initializedRef.current = true;
      }
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
    document.addEventListener('click', handleFirstInteraction, { once: true });
    document.addEventListener('keydown', handleFirstInteraction, { once: true });
    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [initAudio]);

  const playClick = useCallback(() => {
    if (isMuted) return;
    const ctx = initAudio();
    if (ctx.state === "suspended") ctx.resume();
    createClickSound(ctx);
  }, [isMuted, initAudio]);

  const playHover = useCallback(() => {
    if (isMuted) return;
    const ctx = initAudio();
    if (ctx.state === "suspended") ctx.resume();
    createHoverSound(ctx);
  }, [isMuted, initAudio]);

  const playWhoosh = useCallback(() => {
    if (isMuted) return;
    const ctx = initAudio();
    if (ctx.state === "suspended") ctx.resume();
    createWhooshSound(ctx);
  }, [isMuted, initAudio]);

  // Global click sound on all interactive elements via event delegation
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (isMuted) return;
      const target = e.target as HTMLElement;
      const interactive = target.closest(
        "a, button, [role='button'], [data-sound-click]"
      );
      if (interactive) {
        playClick();
      }
    };

    const handleHoverIn = (e: MouseEvent) => {
      if (isMuted) return;
      const target = e.target as HTMLElement;
      const interactive = target.closest(
        "a, button, [role='button'], [data-sound-hover]"
      );
      if (interactive) {
        playHover();
      }
    };

    document.addEventListener("click", handleClick, true);
    document.addEventListener("mouseenter", handleHoverIn, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("mouseenter", handleHoverIn, true);
    };
  }, [isMuted, playClick, playHover]);

  return (
    <SoundContext.Provider
      value={{ isMuted, toggleMute, playClick, playHover, playWhoosh }}
    >
      {children}
    </SoundContext.Provider>
  );
}
