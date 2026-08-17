"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import TvModel from "./TvModel";
import WyseModel from "./WyseModel";
import VeloModel from "./VeloModel";

function SceneContent({
  playing,
  onTogglePlay,
}: {
  playing: boolean;
  onTogglePlay: () => void;
}) {
  return (
    <>
      <OrbitControls
        makeDefault
        target={[0, 0.4, 0]}
        minDistance={2}
        maxDistance={8}
        maxPolarAngle={Math.PI / 2 - 0.05}
        enablePan={false}
        enableZoom={true}
        autoRotate={false}
      />

      <ambientLight intensity={playing ? 0.85 : 0.7} />
      <directionalLight position={[4, 6, 4]} intensity={1.0} />
      <directionalLight position={[-4, 4, -2]} intensity={0.3} />
      <pointLight position={[0, 2, 0]} intensity={playing ? 1.0 : 0.5} color="#818cf8" />

      {/* Écran TV Bobine au centre de la scène */}
      <TvModel
        playing={playing}
        onActivate={onTogglePlay}
        position={[0, 0.2, -0.5]}
        scale={1.35}
      />

      {/* Mini PC Dell Wyse 5070 posé sur la droite de l'écran */}
      <WyseModel
        active={playing}
        onActivate={onTogglePlay}
        position={[1.1, -0.35, -0.4]}
        scale={0.7}
      />

      {/* Rangée de vélos stationnaires face à l'écran */}
      {/* Vélo central */}
      <VeloModel
        position={[0, -0.4, 1.4]}
        rotation={[0, Math.PI, 0]}
        scale={0.55}
      />

      {/* Vélo gauche */}
      <VeloModel
        position={[-1.1, -0.4, 1.7]}
        rotation={[0, Math.PI - 0.18, 0]}
        scale={0.55}
      />

      {/* Vélo droit */}
      <VeloModel
        position={[1.1, -0.4, 1.7]}
        rotation={[0, Math.PI + 0.18, 0]}
        scale={0.55}
      />

      {/* Ombre de contact au sol */}
      <ContactShadows
        position={[0, -0.41, 0.6]}
        opacity={0.4}
        scale={8}
        blur={2}
        far={3}
      />
    </>
  );
}

export default function StudioRPMScene() {
  const [playing, setPlaying] = useState(true);
  const [isInView, setIsInView] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Coupe le rendu WebGL quand la section n'est pas visible dans l'écran
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { rootMargin: "100px", threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="studio-rpm-container" ref={containerRef}>
      <div className="studio-rpm-header">
        <div className="studio-rpm-title">
          <span className="studio-rpm-badge">Studio RPM & Biking 3D</span>
          <h3>Immersion en salle de cours collectifs</h3>
        </div>
      </div>

      <div className="studio-rpm-viewport">
        {isInView ? (
          <Suspense
            fallback={
              <div className="studio-rpm-loading">
                Chargement de la scène 3D...
              </div>
            }
          >
            <Canvas
              camera={{ position: [0, 2.2, 5.2], fov: 36 }}
              dpr={[1, 1.25]}
              gl={{
                alpha: true,
                antialias: true,
                powerPreference: "low-power",
                toneMapping: THREE.ACESFilmicToneMapping,
              }}
            >
              <SceneContent
                playing={playing}
                onTogglePlay={() => setPlaying((p) => !p)}
              />
            </Canvas>
          </Suspense>
        ) : (
          <div className="studio-rpm-loading">Scène 3D en pause (hors écran)</div>
        )}
      </div>

      <div className="studio-rpm-footer">
        <span>Glissez pour faire pivoter la vue · Molette pour zoomer · Clic sur l&apos;écran ou le Wyse pour contrôler</span>
        <span>Dell Wyse 5070 + TV HDMI-CEC + Studio RPM</span>
      </div>
    </div>
  );
}



