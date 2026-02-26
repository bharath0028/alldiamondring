import { MetalType, GemType, SkinTone, RingModelType } from '../types/index';
import { OptionItemData } from '../components/Configurator/OptionGrid';

export const METAL_PREVIEW_COLORS: Readonly<Record<MetalType, string>> = {
  [MetalType.WhiteGold]: "#D8D8D8",
  [MetalType.YellowGold]: "#F4C542",
  [MetalType.RoseGold]: "#E3A6A1",
  [MetalType.Platinum]: "#C5C6C7",
} as const;

export const GEM_PREVIEW_GRADIENTS: Readonly<Record<GemType, string>> = {
  [GemType.White]: "radial-gradient(circle, #ffffff 0%, #d9d9d9 60%, #a8a8a8 100%)",
  [GemType.Yellow]: "radial-gradient(circle, #fff29b 0%, #e6c447 60%, #a87f00 100%)",
  [GemType.Pink]: "radial-gradient(circle, #ffb7d9 0%, #e678a5 60%, #b0446c 100%)",
  [GemType.Blue]: "radial-gradient(circle, #b3e7ff 0%, #5db6e6 60%, #186a8f 100%)",
} as const;

export const DIAMOND_SHAPES = [
  { value: 'baguette', label: 'Baguette' },
  { value: 'cushion', label: 'Cushion' },
  { value: 'emerald', label: 'Emerald' },
  { value: 'halfmoon', label: 'Half Moon' },
  { value: 'heart', label: 'Heart' },
  { value: 'hexagon', label: 'Hexagon' },
  { value: 'kite', label: 'Kite' },
  { value: 'marquise', label: 'Marquise' },
  { value: 'octagon', label: 'Octagon' },
  { value: 'oval', label: 'Oval' },
  { value: 'pear', label: 'Pear' },
  { value: 'princess', label: 'Princess' },
  { value: 'radiant', label: 'Radiant' },
  { value: 'round', label: 'Round' },
  { value: 'taper', label: 'Taper' },
  { value: 'trillion', label: 'Trillion' },
] as const;

export type DiamondShape = typeof DIAMOND_SHAPES[number]['value'];

// Map diamond shape values to preview image files in public/assets/cuts
const DIAMOND_SHAPE_IMAGE_MAP: Record<string, string> = {
  baguette: '/assets/cuts/baguette.png',
  cushion: '/assets/cuts/cushion.png',
  emerald: '/assets/cuts/emerald.png',
  halfmoon: '/assets/cuts/Halfmoon.png',
  heart: '/assets/cuts/heart.png',
  hexagon: '/assets/cuts/hexagon.png',
  kite: '/assets/cuts/kite.png',
  marquise: '/assets/cuts/marquise.png',
  octagon: '/assets/cuts/octagon.png',
  oval: '/assets/cuts/oval.png',
  pear: '/assets/cuts/pear.png',
  princess: '/assets/cuts/princess.png',
  radiant: '/assets/cuts/radient.png',
  round: '/assets/cuts/round.png',
  taper: '/assets/cuts/tapper.png',
  trillion: '/assets/cuts/trillion.png',
};

// Mapping from config shape names to standard shape names and their display info (no previewImage)
const SHAPE_NAME_MAPPING: Record<string, { standardName: DiamondShape; label: string }> = {
  'round': { standardName: 'round', label: 'Round' },
  'radiant': { standardName: 'radiant', label: 'Radiant' },
  'princess': { standardName: 'princess', label: 'Princess' },
  'pear': { standardName: 'pear', label: 'Pear' },
  'marquise': { standardName: 'marquise', label: 'Marquise' },
  'emerald': { standardName: 'emerald', label: 'Emerald' },
  'heart': { standardName: 'heart', label: 'Heart' },
  'baguette': { standardName: 'baguette', label: 'Baguette' },
  'cushion': { standardName: 'cushion', label: 'Cushion' },
  'halfmoon': { standardName: 'halfmoon', label: 'Half Moon' },
  'hexagon': { standardName: 'hexagon', label: 'Hexagon' },
  'kite': { standardName: 'kite', label: 'Kite' },
  'octagon': { standardName: 'octagon', label: 'Octagon' },
  'oval': { standardName: 'oval', label: 'Oval' },
  'taper': { standardName: 'taper', label: 'Taper' },
  'trillion': { standardName: 'trillion', label: 'Trillion' },
};

interface RingConfig {
  name: string;
  baseRing: string;
  heads?: Record<string, string>;
  visible?: boolean;
}

interface RingConfigData {
  rings: Record<string, RingConfig>;
  diamondEXR: string;
}

let ringConfigCache: RingConfigData | null = null;
let ringConfigPromise: Promise<RingConfigData> | null = null;

const loadRingConfig = async (): Promise<RingConfigData> => {
  if (ringConfigCache) return ringConfigCache;
  if (ringConfigPromise) return ringConfigPromise;

  ringConfigPromise = fetch("/assets/ring-config.json")
    .then((res) => res.json())
    .then((data) => {
      ringConfigCache = data;
      return data;
    });

  return ringConfigPromise;
};

export const createMetalOptions = (): ReadonlyArray<OptionItemData<MetalType>> => {
  return Object.values(MetalType).map((type) => ({
    value: type,
    label: type,
    previewColor: METAL_PREVIEW_COLORS[type],
  }));
};

export const createGemOptions = (): ReadonlyArray<OptionItemData<GemType>> => {
  const fileMap: Record<GemType, string> = {
    [GemType.White]: '/assets/images/white.png',
    [GemType.Yellow]: '/assets/images/yellow.png',
    [GemType.Pink]: '/assets/images/pink.png',
    [GemType.Blue]: '/assets/images/blue.png',
  };

  return Object.values(GemType).map((type) => ({
    value: type,
    label: type,
    previewGradient: GEM_PREVIEW_GRADIENTS[type],
    previewImage: fileMap[type],
    imageOnly: true,
  }));
};

export const createDiamondShapeOptions = (): ReadonlyArray<OptionItemData<DiamondShape>> => {
  return DIAMOND_SHAPES.map((shape) => ({
    value: shape.value,
    label: shape.label,
    previewImage: DIAMOND_SHAPE_IMAGE_MAP[shape.value] || undefined,
    useBlackBackground: true,
  }));
};

export const createDiamondShapeOptionsForRing = async (
  ringModel: string
): Promise<ReadonlyArray<OptionItemData<DiamondShape>>> => {
  const config = await loadRingConfig();
  const ring = config.rings[ringModel];

  if (!ring || !ring.heads) {
    // Fallback to all shapes if ring not found or has no heads
    return createDiamondShapeOptions();
  }

  const availableHeads = Object.keys(ring.heads);

  // Create options for all standard shapes, but disable unavailable ones
  return DIAMOND_SHAPES.map((shape) => {
    // Check if this shape is available in the ring's heads
    // We need to check both the standard name and any mapped names
    const isAvailable = availableHeads.some((headKey) => {
      const mapping = SHAPE_NAME_MAPPING[headKey];
      return mapping?.standardName === shape.value || headKey === shape.value;
    });

    return {
      value: shape.value,
      label: shape.label,
      disabled: !isAvailable,
      previewImage: DIAMOND_SHAPE_IMAGE_MAP[shape.value] || undefined,
      useBlackBackground: true,
    };
  });
};

// Hook-friendly version that returns options based on available heads
export const getDiamondShapeOptionsForRing = (
  ringModel: string,
  availableHeads: string[]
): ReadonlyArray<OptionItemData<DiamondShape>> => {
  return DIAMOND_SHAPES.map((shape) => {
    // Check if this shape is available in the ring's heads
    const isAvailable = availableHeads.some((headKey) => {
      const mapping = SHAPE_NAME_MAPPING[headKey];
      return mapping?.standardName === shape.value || headKey === shape.value;
    });

    return {
      value: shape.value,
      label: shape.label,
      disabled: !isAvailable,
      previewImage: DIAMOND_SHAPE_IMAGE_MAP[shape.value] || undefined,
      useBlackBackground: true,
    };
  });
};

export const SKIN_TONE_COLORS: Readonly<Record<SkinTone, string>> = {
  [SkinTone.Light]: "#E8C5A0",
  [SkinTone.Dark]: "#6B4423",
} as const;

export const createSkinToneOptions = (): ReadonlyArray<OptionItemData<SkinTone>> => {
  return Object.values(SkinTone).map((tone) => ({
    value: tone,
    label: tone,
    previewColor: SKIN_TONE_COLORS[tone],
  }));
};

// Ring model configuration
export const RING_MODELS: ReadonlyArray<{ value: RingModelType; label: string }> = [
  { value: 'ring', label: 'Classic Ring' },
  { value: 'ring-02', label: 'Modern Ring' },
  { value: 'ring-03', label: 'Vintage Ring' },
] as const;

export const createRingModelOptions = (
  ringConfig?: RingConfigData | { rings: Record<string, Partial<RingConfig>> } | null
): ReadonlyArray<OptionItemData<RingModelType>> => {
  // If no config provided, return all models (for backward compatibility)
  if (!ringConfig) {
    return RING_MODELS.map((model) => ({
      value: model.value,
      label: model.label,
      previewColor: "#D9D9D9",
    }));
  }

  // Filter out rings where visible === false
  // If visible is not present or is true, show the ring
  return RING_MODELS.filter((model) => {
    const ring = ringConfig.rings[model.value];
    // If ring doesn't exist in config, show it (backward compatibility)
    if (!ring) return true;
    // If visible is explicitly false, hide it
    // If visible is true or not present, show it
    return ring.visible !== false;
  }).map((model) => ({
    value: model.value,
    label: model.label,
    previewColor: "#D9D9D9", // Default preview color for rings
  }));
};
