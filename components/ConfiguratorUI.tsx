const HEADER_CLASSES = "p-8 pb-4 flex-shrink-0 relative";
import React, {
  useMemo,
  useCallback,
  useState,
  useEffect,
  useRef,
} from "react";
import { MetalType, GemType, SkinTone, RingModelType } from "../types/index";
import { OptionGrid, OptionItemData } from "./Configurator/OptionGrid";
import { OptionItem } from "./Configurator/OptionItem";
import {
  createMetalOptions,
  createGemOptions,
  getDiamondShapeOptionsForRing,
  createSkinToneOptions,
  createRingModelOptions,
  DiamondShape,
} from "../constants/optionConfig";

interface ConfiguratorUIProps {
  metal: MetalType;
  setMetal: (m: MetalType) => void;
  gem: GemType;
  setGem: (g: GemType) => void;
  diamondShape: DiamondShape;
  setDiamondShape: (s: DiamondShape) => void;
  ringModel: RingModelType;
  setRingModel: (r: RingModelType) => void;
  autoRotate: boolean;
  setAutoRotate: (value: boolean) => void;
  skinTone: SkinTone;
  setSkinTone: (t: SkinTone) => void;
  renderMode: "performance" | "quality";
  setRenderMode: (m: "performance" | "quality") => void;
  onClose?: () => void;
  onOpen?: () => void;
  externalOpen?: boolean;
}

// Cache ring config globally to avoid re-fetching
let cachedRingConfig: {
  rings: Record<string, { heads?: Record<string, string>; visible?: boolean }>;
  diamondEXR?: string;
} | null = null;
let configLoadPromise: Promise<any> | null = null;

const loadRingConfigOnce = async () => {
  if (cachedRingConfig) return cachedRingConfig;
  if (configLoadPromise) return configLoadPromise;

  configLoadPromise = fetch("/assets/ring-config.json")
    .then((res) => res.json())
    .then((data) => {
      cachedRingConfig = data;
      return data;
    })
    .catch((err) => {
      console.error("Failed to load ring config:", err);
      return null;
    });

  return configLoadPromise;
};

export const ConfiguratorUI: React.FC<ConfiguratorUIProps> = React.memo(
  ({
    metal,
    setMetal,
    gem,
    setGem,
    diamondShape,
    setDiamondShape,
    ringModel,
    setRingModel,
    autoRotate,
    setAutoRotate,
    skinTone,
    setSkinTone,
    renderMode,
    setRenderMode,
    onClose,
    onOpen,
    externalOpen,
  }) => {
    const [ringConfig, setRingConfig] = useState<{
      rings: Record<string, { heads?: Record<string, string>; visible?: boolean }>;
      diamondEXR?: string;
    } | null>(cachedRingConfig);

    useEffect(() => {
      if (!ringConfig) {
        loadRingConfigOnce().then((data) => {
          if (data) setRingConfig(data);
        });
      }
    }, [ringConfig]);

    const [isOpen, setIsOpen] = useState<boolean>(false);

    // mounted/visibility state for animated show/hide
    const [isMounted, setIsMounted] = useState<boolean>(!!isOpen);
    const [isVisible, setIsVisible] = useState<boolean>(!!isOpen);

    const [isMobile, setIsMobile] = useState<boolean>(false);

    // sync with external control from parent App
    useEffect(() => {
      if (typeof externalOpen !== 'undefined' && externalOpen !== isOpen) {
        setIsOpen(!!externalOpen);
      }
    }, [externalOpen]);

    // manage mount + visibility for slide animation when isOpen changes
    useEffect(() => {
      let timeoutId: any;
      if (isOpen) {
        setIsMounted(true);
        // small delay to ensure the element is in the DOM for transition
        timeoutId = setTimeout(() => setIsVisible(true), 10);
        if (onOpen) onOpen();
      } else {
        // trigger hide animation
        setIsVisible(false);
        // unmount after transition
        timeoutId = setTimeout(() => {
          setIsMounted(false);
          if (onClose) onClose();
        }, 300);
      }
      return () => clearTimeout(timeoutId);
    }, [isOpen, onOpen, onClose]);

    // computed wrapper classes/styles for responsive/mobile behavior
    const wrapperStyle = isMobile ? {} : { marginLeft: '300px' };
    const wrapperClasses = isMobile
      ? `fixed left-0 right-0 bottom-0 z-50 transition-transform duration-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`
      : `fixed left-1/2 bottom-6 transform -translate-x-1/2 z-50 transition-transform duration-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`;

    useEffect(() => {
      if (typeof window === 'undefined') return;
      const mq = window.matchMedia?.('(max-width: 640px)');
      const handler = (e: MediaQueryList | MediaQueryListEvent) => setIsMobile((e as any).matches ?? (e as MediaQueryList).matches);
      if (mq) {
        setIsMobile(mq.matches);
        if (mq.addEventListener) mq.addEventListener('change', handler as any);
        else mq.addListener(handler as any);
        return () => {
          if (mq.removeEventListener) mq.removeEventListener('change', handler as any);
          else mq.removeListener(handler as any);
        };
      }
      const onResize = () => setIsMobile(window.innerWidth <= 640);
      onResize();
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }, []);

    const metalOptions = useMemo(() => createMetalOptions(), []);
    const gemOptions = useMemo(() => createGemOptions(), []);
    const skinToneOptions = useMemo(() => createSkinToneOptions(), []);

    const diamondShapeOptions = useMemo(() => {
      if (!ringConfig) {
        return [
          { value: "round" as DiamondShape, label: "Round", previewImage: "/assets/shapes/Round.svg", disabled: false },
          { value: "radiant" as DiamondShape, label: "Radiant", previewImage: "/assets/shapes/Radiant.svg", disabled: false },
          { value: "princess" as DiamondShape, label: "Princess", previewImage: "/assets/shapes/Princess.svg", disabled: false },
          { value: "pear" as DiamondShape, label: "Pear", previewImage: "/assets/shapes/Pear.svg", disabled: false },
          { value: "marquise" as DiamondShape, label: "Marquise", previewImage: "/assets/shapes/Marquise.svg", disabled: false },
          { value: "heart" as DiamondShape, label: "Heart", previewImage: "/assets/shapes/Heart.svg", disabled: false },
          { value: "emerald" as DiamondShape, label: "Emerald", previewImage: "/assets/shapes/Emerald.svg", disabled: false },
        ];
      }

      const currentRing = ringConfig.rings[ringModel];
      if (!currentRing || !currentRing.heads) return getDiamondShapeOptionsForRing(ringModel, []);
      const availableHeads = Object.keys(currentRing.heads);
      return getDiamondShapeOptionsForRing(ringModel, availableHeads);
    }, [ringConfig, ringModel]);

    const prevRingModelRef = useRef(ringModel);
    useEffect(() => {
      if (!ringConfig || prevRingModelRef.current === ringModel) return;
      prevRingModelRef.current = ringModel;
      const currentRing = ringConfig.rings[ringModel];
      if (!currentRing || !currentRing.heads) return;
      const availableHeads = Object.keys(currentRing.heads);
      const shapeMapping: Record<string, string[]> = { radiant: ["radiant", "emerald"], marquise: ["marquise", "heart"] };
      const isAvailable = availableHeads.some((headKey) => {
        const mapping = shapeMapping[headKey];
        return mapping?.includes(diamondShape) || headKey === diamondShape;
      });
      if (!isAvailable) {
        const firstAvailable = availableHeads[0];
        if (firstAvailable) {
          const standardShape = firstAvailable === "emerald" ? "radiant" : (firstAvailable === "heart" || firstAvailable === "marquise1" || firstAvailable === "marquise") ? "marquise" : (firstAvailable as DiamondShape);
          setDiamondShape(standardShape);
        }
      }
    }, [ringModel, ringConfig, diamondShape, setDiamondShape]);

    const renderModeOptions = useMemo<ReadonlyArray<OptionItemData<"performance" | "quality">>>(() => [
      { value: "performance", label: "Performance", previewImage: "/assets/images/performance.png" },
      { value: "quality", label: "Fire", previewImage: "/assets/images/fire.webp" },
    ], []);

    const ringModelOptions = useMemo(() => createRingModelOptions(), []);

    const [activeTab, setActiveTab] = useState<'gem' | 'shape' | 'ring' | 'render'>('gem');

    const handleMetalSelect = useCallback((value: MetalType | boolean) => { if (typeof value !== 'boolean') setMetal(value); }, [setMetal]);
    const handleGemSelect = useCallback((value: GemType | boolean) => { if (typeof value !== 'boolean') setGem(value); }, [setGem]);
    const handleDiamondShapeSelect = useCallback((value: DiamondShape | boolean) => { if (typeof value !== 'boolean') setDiamondShape(value); }, [setDiamondShape]);
    const handleSkinToneSelect = useCallback((value: SkinTone | boolean) => { if (typeof value !== 'boolean') setSkinTone(value); }, [setSkinTone]);
    const handleRingModelSelect = useCallback((value: RingModelType | boolean) => { if (typeof value !== 'boolean') setRingModel(value); }, [setRingModel]);
    const handleRenderModeSelect = useCallback((value: 'performance' | 'quality' | boolean) => { if (typeof value !== 'boolean') setRenderMode(value); }, [setRenderMode]);

    if (!isMounted) return null;

    return (
      <>
        <div style={wrapperStyle} className={wrapperClasses}>
          <button
            aria-label="Close configurator"
            onClick={() => {
              setIsOpen(false);
              if (onClose) onClose();
            }}
            className="absolute top-3 right-3 z-60 w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center text-sm md:top-4 md:right-6"
          >
            ✕
          </button>
          {/* Gemstone + Render Mode on top */}
          <div className={`mt-3 mx-auto w-full ${isMobile ? 'max-w-full px-4' : 'max-w-[520px]'}`}>
            {/* Top area: show Diamond Shape (when selected) or horizontal Gemstone row */}
            {activeTab === 'shape' ? (
              <div>
                <div className="flex items-center justify-start gap-4 overflow-x-auto py-2 px-1">
                  {diamondShapeOptions.map((opt) => (
                    <div key={opt.value} className="flex-shrink-0">
                      <OptionItem
                        value={opt.value as any}
                        label={opt.label}
                        isActive={diamondShape === opt.value}
                        onClick={() => handleDiamondShapeSelect(opt.value as any)}
                        previewImage={opt.previewImage}
                        imageOnly={true}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (activeTab === 'gem' || activeTab === 'ring') ? (
              <div>
                <div className="flex items-center justify-center gap-4 overflow-x-auto py-2">
                  {gemOptions.map((opt) => (
                    <div key={opt.value} className="flex-shrink-0">
                      <OptionItem
                        value={opt.value as any}
                        label={opt.label}
                        isActive={gem === opt.value}
                        onClick={() => handleGemSelect(opt.value as any)}
                        previewImage={opt.previewImage}
                        imageOnly={true}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {activeTab === 'render' && (
              <div className="mt-2 flex items-center justify-center">
                <div>
                  <div className="flex items-center justify-center gap-4">
                    {renderModeOptions.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => handleRenderModeSelect(opt.value as any)}
                          className={`w-12 h-12 bg-white rounded-full border border-gray-100 flex items-center justify-center transition-shadow duration-200 ${renderMode === opt.value ? 'ring-2 ring-blue-500 shadow-[0_8px_30px_rgba(59,130,246,0.25)]' : 'shadow-sm'}`}
                        >
                          {opt.previewImage ? (
                            <img src={opt.previewImage} alt={opt.label} className="w-9 h-9 object-contain rounded-full" draggable={false} />
                          ) : (
                            <span className="w-7 h-7 bg-gray-50 rounded-full" />
                          )}
                        </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-3 flex items-center justify-center">
            <div className={`bg-white/80 backdrop-blur-md ${isMobile ? 'rounded-t-xl w-full px-4 py-3' : 'rounded-full px-3 py-1'} flex gap-2 shadow-sm justify-center`}>
                {[
                  { key: 'ring', label: 'Gem stone' },
                  { key: 'diamond', label: 'Diamond shape' },
                  { key: 'render', label: 'Render' },
                ].map((t) => (
                  <button
                    key={t.key}
                    onClick={() => {
                      if (t.key === 'diamond') setActiveTab('shape');
                      else if (t.key === 'ring') setActiveTab('ring');
                      else if (t.key === 'render') setActiveTab('render');
                    }}
                    className={`px-6 py-2 min-w-[145px] text-center whitespace-normal leading-tight rounded-full text-sm font-medium ${((t.key === 'diamond' && activeTab === 'shape') || (t.key === 'ring' && activeTab === 'ring') || (t.key === 'render' && activeTab === 'render')) ? 'bg-white text-black' : 'text-gray-600'}`}
                  >
                    {t.label}
                  </button>
                ))}
            </div>
          </div>

          <div className={`mt-3 mx-auto w-full ${isMobile ? 'max-w-full px-4' : 'max-w-[520px]'}`}>
            {/* Ring Model grid intentionally hidden to avoid placeholder icons */}
          </div>
        </div>
      </>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.metal === nextProps.metal &&
      prevProps.gem === nextProps.gem &&
      prevProps.diamondShape === nextProps.diamondShape &&
      prevProps.ringModel === nextProps.ringModel &&
      prevProps.autoRotate === nextProps.autoRotate &&
      prevProps.skinTone === nextProps.skinTone &&
      prevProps.renderMode === nextProps.renderMode &&
      prevProps.externalOpen === nextProps.externalOpen &&
      prevProps.onOpen === nextProps.onOpen &&
      prevProps.onClose === nextProps.onClose
    );
  }
);
