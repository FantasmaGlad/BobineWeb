"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import VeloModel from "./VeloModel";
import ProjecteurModel from "./ProjecteurModel";
import WyseModel from "./WyseModel";

// Positions de la grille de 8 vélos stationnaires (2 colonnes x 4 rangées)
const BIKES_GRID: Array<{
  position: [number, number, number];
  rotation: [number, number, number];
}> = [
  // Rangée 1 (Avant)
  { position: [-0.9, -0.4, 0.4], rotation: [0, Math.PI - 0.12, 0] },
  { position: [0.9, -0.4, 0.4], rotation: [0, Math.PI + 0.12, 0] },

  // Rangée 2
  { position: [-1.0, -0.4, 1.5], rotation: [0, Math.PI - 0.08, 0] },
  { position: [1.0, -0.4, 1.5], rotation: [0, Math.PI + 0.08, 0] },

  // Rangée 3
  { position: [-1.1, -0.4, 2.6], rotation: [0, Math.PI - 0.05, 0] },
  { position: [1.1, -0.4, 2.6], rotation: [0, Math.PI + 0.05, 0] },

  // Rangée 4 (Fond)
  { position: [-1.2, -0.4, 3.7], rotation: [0, Math.PI, 0] },
  { position: [1.2, -0.4, 3.7], rotation: [0, Math.PI, 0] },
];

function StudioContent() {
  return (
    <>
      <OrbitControls
        makeDefault
        target={[0, 0.3, 1.2]}
        minDistance={2.5}
        maxDistance={9.5}
        maxPolarAngle={Math.PI / 2 - 0.05}
        minPolarAngle={0.15}
        enablePan={false}
        enableZoom={true}
        autoRotate={false}
        dampingFactor={0.05}
      />

      {/* Éclairage studio immersif */}
      <ambientLight intensity={0.75} />
      <directionalLight position={[5, 8, 5]} intensity={1.1} />
      <directionalLight position={[-5, 6, -3]} intensity={0.4} />
      <pointLight position={[0, 3, -1]} intensity={0.8} color="#818cf8" />

      {/* Écran de projection / Projecteur face aux vélos */}
      <ProjecteurModel
        position={[0, 0.4, -1.6]}
        rotation={[0, 0, 0]}
        scale={1.2}
      />

      {/* Mini PC Dell Wyse 5070 régie */}
      <WyseModel
        position={[1.8, -0.38, -1.2]}
        rotation={[0, -0.35, 0]}
        scale={0.65}
      />

      {/* Grille complète de vélos de RPM */}
      {BIKES_GRID.map((bike, index) => (
        <VeloModel
          key={index}
          position={bike.position}
          rotation={bike.rotation}
          scale={0.48}
        />
      ))}

      {/* Ombre de sol globale calculée une seule fois */}
      <ContactShadows
        position={[0, -0.41, 1.2]}
        opacity={0.4}
        scale={12}
        blur={2}
        far={4}
        frames={1}
      />
    </>
  );
}

export default function StudioRPMScene() {
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
      { rootMargin: "150px", threshold: 0.05 }
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
                Chargement du studio 3D...
              </div>
            }
          >
            <Canvas
              camera={{ position: [3.8, 3.2, 6.2], fov: 38 }}
              frameloop="demand"
              dpr={1}
              gl={{
                alpha: true,
                antialias: true,
                powerPreference: "low-power",
                toneMapping: THREE.ACESFilmicToneMapping,
              }}
            >
              <StudioContent />
            </Canvas>
          </Suspense>
        ) : (
          <div className="studio-rpm-loading">Scène 3D en pause (hors écran)</div>
        )}
      </div>

      <div className="studio-rpm-footer">
        <span>Glissez pour faire pivoter la vue · Molette pour zoomer et explorer la salle</span>
        <span>Studio RPM avec écran de projection & vélos stationnaires</span>
      </div>
    </div>
  );
}





