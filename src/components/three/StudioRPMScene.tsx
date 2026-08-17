"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import VeloModel from "./VeloModel";
import TableauModel from "./TableauModel";
import ProjecteurModel from "./ProjecteurModel";
import WyseModel from "./WyseModel";

// Grille de 8 vélos stationnaires (2 colonnes x 4 rangées) orientés vers l'écran
const BIKES_GRID: Array<{
  position: [number, number, number];
  rotation: [number, number, number];
}> = [
  // Rangée 1 (Avant)
  { position: [-0.65, 0, -0.2], rotation: [0, Math.PI * 0.15, 0] },
  { position: [0.65, 0, -0.2], rotation: [0, -Math.PI * 0.15, 0] },

  // Rangée 2
  { position: [-0.75, 0, 0.75], rotation: [0, Math.PI * 0.12, 0] },
  { position: [0.75, 0, 0.75], rotation: [0, -Math.PI * 0.12, 0] },

  // Rangée 3
  { position: [-0.85, 0, 1.7], rotation: [0, Math.PI * 0.08, 0] },
  { position: [0.85, 0, 1.7], rotation: [0, -Math.PI * 0.08, 0] },

  // Rangée 4 (Fond)
  { position: [-0.95, 0, 2.65], rotation: [0, Math.PI * 0.05, 0] },
  { position: [0.95, 0, 2.65], rotation: [0, -Math.PI * 0.05, 0] },
];

function StudioContent() {
  return (
    <>
      <OrbitControls
        makeDefault
        target={[0, 0.6, 0.5]}
        minDistance={2.2}
        maxDistance={7.5}
        maxPolarAngle={Math.PI / 2 - 0.08}
        minPolarAngle={0.2}
        enablePan={false}
        enableZoom={true}
        autoRotate={false}
        dampingFactor={0.05}
      />

      {/* Éclairage studio soigné */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[4, 6, 4]} intensity={1.2} />
      <directionalLight position={[-4, 5, -2]} intensity={0.5} />
      <pointLight position={[0, 2.5, -1]} intensity={1.0} color="#818cf8" />

      {/* Grand écran de projection suspendu face aux vélos */}
      <TableauModel
        position={[0, 0.35, -1.5]}
        rotation={[0, 0, 0]}
        scale={2.1}
      />

      {/* Projecteur fixé au plafond au-dessus de la salle */}
      <ProjecteurModel
        position={[0, 2.1, 0.2]}
        rotation={[0.15, 0, 0]}
        scale={0.55}
      />

      {/* Mini PC Dell Wyse 5070 posé discrètement sur le côté */}
      <WyseModel
        position={[1.55, 0, -1.3]}
        rotation={[0, -0.4, 0]}
        scale={0.5}
      />

      {/* Grille de vélos stationnaires */}
      {BIKES_GRID.map((bike, index) => (
        <VeloModel
          key={index}
          position={bike.position}
          rotation={bike.rotation}
          scale={0.62}
        />
      ))}

      {/* Ombre de sol réaliste mise en cache (1 frame) */}
      <ContactShadows
        position={[0, -0.01, 0.6]}
        opacity={0.5}
        scale={10}
        blur={2}
        far={3.5}
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

      <div className="studio-rpm-viewport studio-rpm-viewport--dark">
        {isInView ? (
          <Suspense
            fallback={
              <div className="studio-rpm-loading">
                Chargement du studio 3D...
              </div>
            }
          >
            <Canvas
              camera={{ position: [2.6, 2.0, 4.4], fov: 36 }}
              frameloop="demand"
              dpr={1}
              gl={{
                alpha: false,
                antialias: true,
                powerPreference: "low-power",
                toneMapping: THREE.ACESFilmicToneMapping,
              }}
            >
              <color attach="background" args={["#1c1e24"]} />
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






