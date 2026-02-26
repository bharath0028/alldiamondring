import React, { useMemo } from "react";
import * as THREE from "three";
import { MeshRefractionMaterial } from "@react-three/drei";
import { GEM_CONFIG } from "../../types";

interface DiamondMeshProps {
  geometry: THREE.BufferGeometry;
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
  scale: THREE.Vector3;
  gem: string;
  envMap: THREE.Texture;
  opacity: number;
  minY?: number;
  height?: number;
  animProgress?: number;
  renderMode?: "performance" | "quality";
}

export const DiamondMesh: React.FC<DiamondMeshProps> = ({
  geometry,
  position,
  quaternion,
  scale,
  gem,
  envMap,
  opacity,
  minY,
  height,
  animProgress = 1,
  renderMode = "performance",
}) => {
  const isMacChrome =
    typeof navigator !== "undefined" &&
    /Mac/.test(navigator.userAgent) &&
    /Chrome/.test(navigator.userAgent);

  const materialProps = useMemo(() => {
    const isQuality = renderMode === "quality";
    const bounces = isQuality ? (isMacChrome ? 4 : 5) : isMacChrome ? 3 : 4;
    const fresnel = isQuality ? 0.93 : 0.9;
    // Dial back dispersion to reduce rainbow/prism look; keep a hint in quality mode.
    const aberrationStrength = isQuality
      ? isMacChrome
        ? 0.0025
        : 0.0045
      : isMacChrome
      ? 0.0015
      : 0.003;
    const fastChroma = renderMode === "performance"; // quality prioritizes fidelity

    return {
      bounces,
      fresnel,
      aberrationStrength,
      fastChroma,
    };
  }, [renderMode, isMacChrome]);

  // Hide the growth clipping plane once nearly finished to avoid visible cut lines.
  const effectiveAnim = Math.min(animProgress, 0.98);
  const clippingPlanes = useMemo(() => {
    if (effectiveAnim < 0.995 && minY !== undefined && height !== undefined) {
      return [
        new THREE.Plane(
          new THREE.Vector3(0, -1, 0),
          minY + height * effectiveAnim - 0.002 // slight bias to keep plane inside the mesh
        ),
      ];
    }
    return [];
  }, [effectiveAnim, minY, height]);

  return (
    <mesh
      geometry={geometry}
      position={position}
      quaternion={quaternion}
      scale={scale}
      castShadow
      receiveShadow
    >
      <MeshRefractionMaterial
        key={`${renderMode}-${gem}`}
        envMap={envMap}
        color={GEM_CONFIG[gem]?.color || "#ffffff"}
        ior={2.42}
        bounces={materialProps.bounces}
        fastChroma={materialProps.fastChroma}
        toneMapped={false}
        fresnel={materialProps.fresnel}
        aberrationStrength={materialProps.aberrationStrength}
        transparent
        opacity={opacity}
        clippingPlanes={clippingPlanes}
        clipIntersection={false}
      />
    </mesh>
  );
};
