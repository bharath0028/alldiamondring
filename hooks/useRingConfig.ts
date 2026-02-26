import { useState, useEffect } from "react";
import { loadRingConfig, RingConfig, RingConfigData } from "../utils/ringConfig";
import { useGLTF } from "@react-three/drei";

export const useRingConfig = (ringModel: string) => {
  const [ringConfig, setRingConfig] = useState<RingConfig | null>(null);
  const [diamondEXR, setDiamondEXR] = useState<string>("/assets/diamond/gem.exr");

  useEffect(() => {
    loadRingConfig().then((config: RingConfigData) => {
      const selectedRing = config.rings[ringModel] || config.rings["ring"];
      if (selectedRing) {
        setRingConfig(selectedRing);
        // Preload all heads for this ring (only if heads exist)
        if (selectedRing.heads) {
          Object.values(selectedRing.heads).forEach((url) => useGLTF.preload(url));
        }
        useGLTF.preload(selectedRing.baseRing);
      }
      setDiamondEXR(config.diamondEXR);
    });
  }, [ringModel]);

  return { ringConfig, diamondEXR };
};

