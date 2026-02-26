import React, { useMemo, useEffect, useRef } from "react";
import * as THREE from "three";
import { useGLTF, useTexture } from "@react-three/drei";

const handModelPath = "/assets/models/left-hand.glb";

const SKIN_TEXTURES = {
    light: "/assets/textures/left-skin-light.jpg",
    dark: "/assets/textures/left-skin-dark.jpg",
};

interface HandModelProps {
    ringPosition: THREE.Vector3;
    ringScale: number;
    skinTone?: "light" | "dark";
}

export const HandModel: React.FC<HandModelProps> = ({ ringPosition, ringScale, skinTone = "light" }) => {
    const { scene: handScene } = useGLTF(handModelPath);
    const handRef = useRef<THREE.Group>(null);

    // Texture loaded but NOT used
    const texture = useTexture(SKIN_TEXTURES[skinTone]);
    texture.flipY = false;
    texture.colorSpace = THREE.SRGBColorSpace;

    // Flat skin colors (no texture)
    const SKIN_COLORS = {
        light: "#E8C5A0",
        dark: "#6B4423",
    };

    const handClone = useMemo(() => {
        const clone = handScene.clone(true);

        clone.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                const originalMat = child.material;
                const newMat = originalMat.clone();

                // Apply simple color instead of texture
                newMat.color = new THREE.Color(SKIN_COLORS[skinTone]);
                newMat.needsUpdate = true;

                child.material = newMat;
            }
        });

        return clone;
    }, [handScene, skinTone, texture]);

    useEffect(() => {
        if (!handRef.current) return;

        // Position & scale for alignment with the ring
        handRef.current.scale.setScalar(ringScale * 0.5);
        handRef.current.position.copy(ringPosition)
            .add(new THREE.Vector3(-0.1, -0.2, 0.2));
    }, [ringPosition, ringScale]);

    // Dispose cloned hand meshes/materials and clear cache on unmount to limit GPU memory
    useEffect(() => {
        return () => {
            handClone.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.geometry?.dispose();
                    const material = child.material;
                    if (Array.isArray(material)) {
                        material.forEach((mat) => mat.dispose?.());
                    } else {
                        (material as any)?.dispose?.();
                    }
                }
            });
            useGLTF.clear(handModelPath);
        };
    }, [handClone]);

    return <primitive ref={handRef} object={handClone} />;
};

