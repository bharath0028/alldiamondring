import { useState, useEffect } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader.js";

export const useDiamondEnvMap = (diamondEXR: string) => {
  const [diamondEnvMap, setDiamondEnvMap] = useState<THREE.Texture | null>(null);
  const { gl } = useThree();

  useEffect(() => {
    let isMounted = true;
    const loader = new EXRLoader();
    const pmremGenerator = new THREE.PMREMGenerator(gl);
    pmremGenerator.compileEquirectangularShader();
    let currentTexture: THREE.Texture | null = null;
    let pmremRenderTarget: THREE.WebGLRenderTarget | null = null;

    loader.load(
      diamondEXR,
      (tex) => {
        if (!isMounted) {
          tex.dispose();
          return;
        }
        tex.mapping = THREE.EquirectangularReflectionMapping;
        tex.needsUpdate = true;

        // Convert equirectangular EXR to PMREM cube texture
        // MeshRefractionMaterial requires a PMREM-processed envMap
        pmremRenderTarget = pmremGenerator.fromEquirectangular(tex);
        const pmremTexture = pmremRenderTarget.texture;

        currentTexture = tex;
        setDiamondEnvMap(pmremTexture);
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
      if (pmremRenderTarget) {
        pmremRenderTarget.dispose();
      }
      pmremGenerator.dispose();
      if (typeof (loader as any).dispose === "function") {
        (loader as any).dispose();
      }
      setDiamondEnvMap(null);
    };
  }, [diamondEXR, gl]);

  return diamondEnvMap;
};

