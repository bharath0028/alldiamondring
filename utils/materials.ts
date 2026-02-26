import * as THREE from "three";
import { METAL_COLORS } from "../types";
import { isDiamondName } from "./helpers";

/**
 * Create metal material with specified color
 */
export const createMetalMaterial = (metalColor: string): THREE.MeshStandardMaterial => {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(metalColor),
    metalness: 1,
    roughness: 0.05,
    envMapIntensity: 2.5,
  });
};

/**
 * Clone scene and apply metal materials immediately
 */
export const cloneSceneWithMaterials = (
  scene: THREE.Object3D,
  metal: string
): THREE.Object3D => {
  const metalColor = METAL_COLORS[metal] || "#D9D9D9";
  const metalMaterial = createMetalMaterial(metalColor);

  const clone = scene.clone(true);
  clone.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      // Clone material first
      child.material = Array.isArray(child.material)
        ? child.material.map((m) => m.clone())
        : child.material?.clone();

      // Apply metal material immediately if not a diamond
      if (!isDiamondName(child.name)) {
        child.material = metalMaterial.clone();
      }
    }
  });

  return clone;
};

/**
 * Apply opacity to all materials in an object
 */
export const applyOpacityToObject = (
  obj: THREE.Object3D,
  opacity: number
): void => {
  obj.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      const material = child.material;
      if (Array.isArray(material)) {
        material.forEach((mat) => {
          if (mat instanceof THREE.MeshStandardMaterial) {
            mat.transparent = opacity < 1;
            mat.opacity = opacity;
          }
        });
      } else if (material instanceof THREE.MeshStandardMaterial) {
        material.transparent = opacity < 1;
        material.opacity = opacity;
      }
    }
  });
};

/**
 * Apply metal material to all non-diamond meshes
 */
export const applyMetalToObject = (
  obj: THREE.Object3D,
  metal: string
): void => {
  const metalColor = METAL_COLORS[metal] || "#D9D9D9";
  const metalMaterial = createMetalMaterial(metalColor);

  obj.traverse((child) => {
    if (child instanceof THREE.Mesh && !isDiamondName(child.name)) {
      child.material = metalMaterial.clone();
    }
  });
};

