import { useState, useEffect, useRef } from "react";

interface UseRingAnimationProps {
  ringModel: string;
  diamondShape: string;
  baseClone: any;
  headClone: any;
}

export const useRingAnimation = ({
  ringModel,
  diamondShape,
  baseClone,
  headClone,
}: UseRingAnimationProps) => {
  const [animProgress, setAnimProgress] = useState(1);
  const [ringTransitionProgress, setRingTransitionProgress] = useState(1);
  const [ringScale, setRingScale] = useState(1);
  const [ringRotation, setRingRotation] = useState(0);
  const prevShapeRef = useRef(diamondShape);
  const prevRingModelRef = useRef(ringModel);

  // Easing function (ease-in-out cubic)
  const easeInOutCubic = (t: number) => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  // Handle ring model change animation (fade + scale + rotation)
  useEffect(() => {
    if (prevRingModelRef.current !== ringModel && prevRingModelRef.current) {
      prevRingModelRef.current = ringModel;

      const startTime = Date.now();
      const duration = 1050;
      const fadeOutDuration = 400;
      const fadeInDuration = 600;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        if (elapsed < fadeOutDuration) {
          const phaseProgress = elapsed / fadeOutDuration;
          const eased = easeInOutCubic(phaseProgress);

          setRingTransitionProgress(1 - eased);
          setRingScale(1 - eased * 0.2);
          setRingRotation(eased * Math.PI * 0.5);
        } else if (elapsed < fadeOutDuration + 150) {
          setRingTransitionProgress(0);
          setRingScale(0.8);
          setRingRotation(Math.PI * 0.5);
        } else {
          const phaseElapsed = elapsed - fadeOutDuration - 150;
          const phaseProgress = Math.min(phaseElapsed / fadeInDuration, 1);
          const eased = easeInOutCubic(phaseProgress);

          setRingTransitionProgress(eased);
          setRingScale(0.8 + eased * 0.2);
          setRingRotation(Math.PI * 0.5 - eased * Math.PI * 0.5);
        }

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setRingTransitionProgress(1);
          setRingScale(1);
          setRingRotation(0);
        }
      };

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(animate);
        });
      });
    } else if (!prevRingModelRef.current) {
      prevRingModelRef.current = ringModel;
      setRingTransitionProgress(1);
      setRingScale(1);
      setRingRotation(0);
    }
  }, [ringModel, baseClone, headClone]);

  // Handle diamond shape change animation
  useEffect(() => {
    if (prevShapeRef.current !== diamondShape) {
      setAnimProgress(0);
      prevShapeRef.current = diamondShape;

      const startTime = Date.now();
      const duration = 600;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased =
          progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        setAnimProgress(eased);
        if (progress < 1) requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
    }
  }, [diamondShape]);

  return {
    animProgress,
    ringTransitionProgress,
    ringScale,
    ringRotation,
  };
};

