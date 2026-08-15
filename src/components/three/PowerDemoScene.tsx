"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls, useProgress } from "@react-three/drei";
import WyseModel from "./WyseModel";

function LoadingOverlay() {
  // useProgress est un hook React normal (pas un composant de la scène) :
  // il peut vivre en dehors du <Canvas>, ce qui évite tout souci de
  // positionnement/projection propre au rendu 3D pour un simple indicateur.
  const { active } = useProgress();
  if (!active) return null;
  return (
    <div className="power-demo__loading power-demo__loading--overlay">
      Chargement du modèle…
    </div>
  );
}

export default function PowerDemoScene() {
  const [poweredOn, setPoweredOn] = useState(false);
  // Ce composant n'est jamais rendu côté serveur (chargé via `next/dynamic`
  // avec `ssr: false`), donc lire `window` dès l'initialisation est sûr.
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const listener = () => setReducedMotion(query.matches);
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }, []);

  return (
    <>
      <Canvas
        camera={{ position: [1.15, 0.95, 1.4], fov: 35 }}
        dpr={[1, 1.75]}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={poweredOn ? 0.9 : 0.55} />
        <directionalLight position={[2, 3, 2]} intensity={poweredOn ? 1.1 : 0.75} />
        <directionalLight position={[-2, 1, -1]} intensity={0.25} />
        {poweredOn && (
          <pointLight
            position={[0, 0.5, 0.7]}
            intensity={1.6}
            color="#6fd6e6"
            distance={2.2}
          />
        )}
        <Suspense fallback={null}>
          <WyseModel onToggle={() => setPoweredOn((value) => !value)} />
          <ContactShadows
            position={[0, 0, 0]}
            opacity={0.35}
            blur={2.2}
            far={2}
            scale={3}
          />
        </Suspense>
        <OrbitControls
          makeDefault
          enablePan={false}
          minDistance={0.9}
          maxDistance={2.4}
          minPolarAngle={0.3}
          maxPolarAngle={Math.PI / 2.05}
          autoRotate={poweredOn && !reducedMotion}
          autoRotateSpeed={1.1}
        />
      </Canvas>
      <LoadingOverlay />
      <div className="power-demo__status" data-on={poweredOn}>
        <span className="power-demo__dot" />
        {poweredOn ? "Wyse 5070 — Allumé" : "Wyse 5070 — Éteint"}
      </div>
    </>
  );
}
