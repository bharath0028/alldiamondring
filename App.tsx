import React, { useState, useEffect } from "react";
import { Scene } from "./components/3d/Scene";
import { ConfiguratorUI } from "./components/ConfiguratorUI";
import { SkinToneSelector } from "./components/SkinToneSelector";
import { DiamondSpecs } from "./components/Configurator/DiamondSpecs";
import { MetalType, GemType, SkinTone, RingModelType } from "./types/index";
import { DiamondShape } from "./constants/optionConfig";

const App: React.FC = () => {
  const [metal, setMetal] = useState<MetalType>(MetalType.WhiteGold);
  const [gem, setGem] = useState<GemType>(GemType.White);
  const [diamondShape, setDiamondShape] = useState<DiamondShape>("round");
  const [ringModel, setRingModel] = useState<RingModelType>("ring");
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [skinTone, setSkinTone] = useState<SkinTone>(SkinTone.Light);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const [previousAutoRotate, setPreviousAutoRotate] = useState<boolean>(false);
  const [renderMode, setRenderMode] = useState<"performance" | "quality">(
    "quality"
  );

  return (
    <div className="relative w-full h-screen lux-bg overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Scene
          metal={metal}
          gem={gem}
          diamondShape={diamondShape}
          ringModel={ringModel}
          autoRotate={autoRotate}
          onToggleAutoRotate={() => setAutoRotate((v) => !v)}
          // removed tryHandOn prop
          skinTone={skinTone}
          renderMode={renderMode}
        />
      </div>

      <DiamondSpecs isConfiguratorOpen={isDrawerOpen} />
      {/* Customize buttons placed outside the drawer so they don't block scene interaction */}
      {!isDrawerOpen && (
          <> 
          <button
              onClick={() => {
                console.log('Customize click (mobile) -> opening');
                setIsDrawerOpen(true);
              }}
            className="md:hidden fixed top-4 left-4 z-60 px-5 py-2 bg-white text-black rounded-full shadow-md hover:shadow-lg transition-shadow font-semibold"
          >
            Customize
          </button>

          <button
              onClick={() => {
                console.log('Customize click (desktop) -> opening');
                setIsDrawerOpen(true);
              }}
            className="hidden md:flex fixed bottom-6 right-8 z-60 px-6 py-3 bg-white text-black rounded-full shadow-md hover:shadow-lg transition-shadow font-semibold"
            style={{ right: 'calc(2rem + 360px)' }}
          >
            Customize
          </button>
        </>
      )}

      <div
        className={`fixed z-70 ${isDrawerOpen ? 'pointer-events-auto' : 'pointer-events-none'} w-full md:w-[420px] h-[24vh] md:h-[55vh] bottom-[3.5rem] md:bottom-0 left-0 md:left-1/2 md:transform md:-translate-x-1/2 transition-transform duration-300 ease-out `}
      >
        <ConfiguratorUI
          metal={metal}
          setMetal={setMetal}
          gem={gem}
          setGem={setGem}
          diamondShape={diamondShape}
          setDiamondShape={setDiamondShape}
          ringModel={ringModel}
          setRingModel={setRingModel}
          autoRotate={autoRotate}
          setAutoRotate={setAutoRotate}
          skinTone={skinTone}
          setSkinTone={setSkinTone}
          renderMode={renderMode}
          setRenderMode={setRenderMode}
          onClose={() => setIsDrawerOpen(false)}
          onOpen={() => setIsDrawerOpen(true)}
          externalOpen={isDrawerOpen}
        />
      </div>
    </div>
  );
};

export default App;
