import React, { useMemo, useEffect, useRef } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { useDiamondEnvMap } from "../../hooks/useDiamondEnvMap";
import { METAL_COLORS, GEM_CONFIG } from "../../types";

interface RingModelProps {
  metal: string;
  gem: string;
  diamondShape: string;
  ringModel?: string;
  envMapIntensity?: number;
  renderMode?: "performance" | "quality";
  onModelReady?: () => void;
}

export const RingModel: React.FC<RingModelProps> = ({
  metal,
  gem,
  diamondShape,
  ringModel = "ring",
  envMapIntensity = 1.5,
  renderMode = "performance",
  onModelReady,
}) => {
  const hasNotifiedRef = useRef(false);
  const groupRef = useRef<THREE.Group>(null);

  // Load environment map for diamond reflections
  const diamondEXR = "/assets/diamond/gem.exr";
  const diamondEnvMap = useDiamondEnvMap(diamondEXR);

  // Load the single ring.glb file that contains both diamond and ring body
  const ringUrl = "/assets/models/ring.glb";
  const { scene } = useGLTF(ringUrl);

  // Helper to detect diamond meshes by name or material properties
  const isDiamondMesh = (child: THREE.Mesh): boolean => {
    const name = child.name;
    const nameLower = name.toLowerCase();

    // Match by common diamond/gem naming
    if (
      nameLower.includes("diamond") ||
      nameLower.includes("gem") ||
      nameLower.includes("stone") ||
      nameLower.includes("crystal") ||
      nameLower.includes("glass") ||
      nameLower.includes("dia") ||
      nameLower.includes("cs_") ||
      nameLower.includes("mesh0")
    )
      return true;

    // Match numeric-named objects (e.g., "0.80", "0.80_1", "1.10_5") - carat sizes from Blender
    if (/^\d+[\._]\d+/.test(name)) return true;

    // Check material name
    const mat = Array.isArray(child.material)
      ? child.material[0]
      : child.material;
    if (mat) {
      const matName = (mat.name || "").toLowerCase();
      if (
        matName.includes("diamond") ||
        matName.includes("gem") ||
        matName.includes("glass") ||
        matName.includes("crystal") ||
        matName.includes("stone")
      )
        return true;

      // Check material properties: transmission > 0, or very low metalness + roughness
      if ((mat as any).transmission > 0) return true;
    }

    return false;
  };

  // Clone scene and apply materials directly
  const ringClone = useMemo(() => {
    if (!scene || !diamondEnvMap) return null;
    const clone = scene.clone(true);
    const metalColor = new THREE.Color(METAL_COLORS[metal] || "#D9D9D9");
    const gemColor = new THREE.Color(GEM_CONFIG[gem]?.color || "#ffffff");

    // DEBUG: Log all mesh names so you can see what's in the GLB
    console.group("🔍 GLB Mesh Names (ring.glb)");
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const mat = Array.isArray(child.material)
          ? child.material[0]
          : child.material;
        const detected = isDiamondMesh(child);
        console.log(
          `${detected ? "💎" : "🔩"} "${child.name}" | Material: "${mat?.name}" | Type: ${mat?.type} | Detected as: ${detected ? "DIAMOND" : "METAL"}`
        );
      }
    });
    console.groupEnd();

    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (isDiamondMesh(child)) {
          // Apply diamond material with transmission directly on the mesh
          child.material = new THREE.MeshPhysicalMaterial({
            color: gemColor,
            metalness: 0,
            roughness: 0,
            transmission: 1,
            thickness: 1.5,
            ior: 2.42,
            envMap: diamondEnvMap,
            envMapIntensity: 3,
            clearcoat: 1,
            clearcoatRoughness: 0,
            transparent: true,
            opacity: 1,
            specularIntensity: 1,
            specularColor: new THREE.Color("#ffffff"),
            attenuationDistance: 0.5,
            attenuationColor: gemColor,
          });
        } else {
          // Apply metal material to ring body
          child.material = new THREE.MeshStandardMaterial({
            color: metalColor,
            metalness: 1,
            roughness: 0.05,
            envMapIntensity: envMapIntensity * 1.5,
          });
        }
      }
    });
    return clone;
  }, [scene, metal, gem, envMapIntensity, diamondEnvMap]);

  // Update materials when metal or gem changes
  useEffect(() => {
    if (!ringClone || !diamondEnvMap) return;
    const metalColor = new THREE.Color(METAL_COLORS[metal] || "#D9D9D9");
    const gemColor = new THREE.Color(GEM_CONFIG[gem]?.color || "#ffffff");

    ringClone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (isDiamondMesh(child)) {
          child.material = new THREE.MeshPhysicalMaterial({
            color: gemColor,
            metalness: 0,
            roughness: 0,
            transmission: 1,
            thickness: 1.5,
            ior: 2.42,
            envMap: diamondEnvMap,
            envMapIntensity: 3,
            clearcoat: 1,
            clearcoatRoughness: 0,
            transparent: true,
            opacity: 1,
            specularIntensity: 1,
            specularColor: new THREE.Color("#ffffff"),
            attenuationDistance: 0.5,
            attenuationColor: gemColor,
          });
        } else {
          child.material = new THREE.MeshStandardMaterial({
            color: metalColor,
            metalness: 1,
            roughness: 0.05,
            envMapIntensity: envMapIntensity * 1.5,
          });
        }
      }
    });
  }, [ringClone, metal, gem, envMapIntensity, diamondEnvMap]);

  // Notify when loaded
  useEffect(() => {
    if (ringClone && !hasNotifiedRef.current) {
      const timer = setTimeout(() => {
        if (onModelReady) {
          onModelReady();
          hasNotifiedRef.current = true;
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [ringClone, onModelReady]);

  // Reset notification on shape change
  useEffect(() => {
    hasNotifiedRef.current = false;
  }, [diamondShape]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (ringClone) {
        ringClone.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry?.dispose();
            const material = child.material;
            if (Array.isArray(material)) {
              material.forEach((mat) => mat.dispose?.());
            } else if (material) {
              (material as any).dispose?.();
            }
          }
        });
      }
      useGLTF.clear(ringUrl);
    };
  }, [ringClone]);

  if (!ringClone) return null;

  return (
    <group ref={groupRef} scale={0.5}>
      <primitive object={ringClone} />
    </group>
  );
};
