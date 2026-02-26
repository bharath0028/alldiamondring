/**
 * Check if a mesh name indicates it's a diamond/gem
 */
export const isDiamondName = (name: string): boolean => {
  const n = name.toLowerCase();
  return (
    n.includes("dia") ||
    n.includes("diamond") ||
    n.includes("gem") ||
    n.includes("stone") ||
    n.includes("cs_") ||
    n.includes("mesh0")
  );
};

/**
 * Map standard shape names to config keys
 */
export const SHAPE_MAPPING: Record<string, string[]> = {
  radiant: ["radiant", "emerald"],
  marquise: ["marquise", "heart"],
  round: ["round"],
  princess: ["princess"],
  pear: ["pear"],
};

/**
 * Get head URL for a given diamond shape and ring config
 */
export const getHeadUrl = (
  ringConfig: { heads?: Record<string, string> } | null,
  diamondShape: string
): string => {
  if (!ringConfig || !ringConfig.heads) {
    return "/assets/models/ring/heads/round.glb";
  }

  // First try direct match
  if (ringConfig.heads[diamondShape]) {
    return ringConfig.heads[diamondShape];
  }

  const possibleKeys = SHAPE_MAPPING[diamondShape] || [diamondShape, "round"];

  // Find the first matching key in the ring's heads
  for (const key of possibleKeys) {
    if (ringConfig.heads[key]) {
      return ringConfig.heads[key];
    }
  }

  // Fallback to round or first available head
  return (
    ringConfig.heads["round"] ||
    Object.values(ringConfig.heads)[0] ||
    "/assets/models/ring/heads/round.glb"
  );
};

