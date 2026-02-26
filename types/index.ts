export enum MetalType {
  WhiteGold = "White Gold",
  YellowGold = "Yellow Gold",
  RoseGold = "Rose Gold",
  Platinum = "Platinum",
}

export enum GemType {
  White = "White Diamond",
  Yellow = "Yellow Diamond",
  Pink = "Pink Diamond",
  Blue = "Blue Diamond",
}

export enum SkinTone {
  Light = "Light",
  Dark = "Dark",
}

export interface ConfigurationState {
  metal: MetalType;
  gem: GemType;
}

export const METAL_COLORS: Record<MetalType, string> = {
  [MetalType.WhiteGold]: "#D9D9D9",
  [MetalType.YellowGold]: "#F4C542",
  [MetalType.RoseGold]: "#E3A6A1",
  [MetalType.Platinum]: "#C5C6C7",
};

export const GEM_CONFIG: Record<GemType, { color: string; transmission: number; absorption: number }> = {
  [GemType.White]: {
    color: "#ffffff",
    transmission: 1.0,
    absorption: 0.0,
  },
  [GemType.Yellow]: {
    color: "#F7E15A",
    transmission: 0.9,
    absorption: 0.35,
  },
  [GemType.Pink]: {
    color: "#FFB7D9",
    transmission: 0.9,
    absorption: 0.45,
  },
  [GemType.Blue]: {
    color: "#8ECDF8",
    transmission: 0.85,
    absorption: 0.55,
  },
};

export type TypeSkinTone = 'light' | 'dark';
export type RingModelType = 'ring' | 'ring-02' | 'ring-03';

