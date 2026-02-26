import { useGLTF } from "@react-three/drei";

export interface RingConfig {
  name: string;
  baseRing: string;
  heads?: Record<string, string>;
  visible?: boolean;
}

export interface RingConfigData {
  rings: Record<string, RingConfig>;
  diamondEXR: string;
}

// Load ring configuration
let ringConfigData: RingConfigData | null = null;
let configLoadPromise: Promise<RingConfigData> | null = null;

export const loadRingConfig = async (): Promise<RingConfigData> => {
  if (ringConfigData) return ringConfigData;
  if (configLoadPromise) return configLoadPromise;

  configLoadPromise = fetch("/assets/ring-config.json")
    .then((res) => res.json())
    .then((data) => {
      ringConfigData = data;
      return data;
    });

  return configLoadPromise;
};

// Preload default ring
loadRingConfig().then((config) => {
  const defaultRing = config.rings["ring"];
  if (defaultRing && defaultRing.heads) {
    Object.values(defaultRing.heads).forEach((url) => useGLTF.preload(url));
    useGLTF.preload(defaultRing.baseRing);
  }
});

