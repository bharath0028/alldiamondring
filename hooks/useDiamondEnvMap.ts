import { useState, useEffect } from "react";
import * as THREE from "three";
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader.js";

export const useDiamondEnvMap = (diamondEXR: string) => {
  const [diamondEnvMap, setDiamondEnvMap] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loader = new EXRLoader();
    let currentTexture: THREE.Texture | null = null;

    loader.load(
      diamondEXR,
      (tex) => {
        if (!isMounted) {
          tex.dispose();
          return;
        }
        tex.mapping = THREE.EquirectangularReflectionMapping;
        tex.needsUpdate = true;
        currentTexture = tex;
        setDiamondEnvMap(tex);
      },
      undefined,
      (err) => {
        if (isMounted) {
          console.warn("EXR load error:", err);
        }
      }
    );

    return () => {
      isMounted = false;
      if (currentTexture) {
        currentTexture.dispose();
      }
      // EXRLoader inherits from DataTextureLoader; dispose is available in three >=0.180
      if (typeof (loader as any).dispose === "function") {
        (loader as any).dispose();
      }
      setDiamondEnvMap(null);
    };
  }, [diamondEXR]);

  return diamondEnvMap;
};

