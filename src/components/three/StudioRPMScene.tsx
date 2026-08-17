"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import VeloModel from "./VeloModel";
import TableauModel from "./TableauModel";
import ProjecteurModel from "./ProjecteurModel";
import WyseModel from "./WyseModel";

// Coordonnées exactes décodées depuis Spline scene.glb (12 vélos en 2 rangées de 6)
const BIKES_EXACT_GRID: Array<{
  position: [number, number, number];
  rotation: [number, number, number];
}> = [
  // Rangée Avant (Z = 1.0m)
  { position: [-1.5, 0, 1.0], rotation: [0, Math.PI / 2, 0] },
  { position: [-1.0, 0, 1.0], rotation: [0, Math.PI / 2, 0] },
  { position: [-0.5, 0, 1.0], rotation: [0, Math.PI / 2, 0] },
  { position: [0.5, 0, 1.0], rotation: [0, Math.PI / 2, 0] },
  { position: [1.0, 0, 1.0], rotation: [0, Math.PI / 2, 0] },
  { position: [1.5, 0, 1.0], rotation: [0, Math.PI / 2, 0] },

  // Rangée Arrière (Z = 2.1m)
  { position: [-1.5, 0, 2.1], rotation: [0, Math.PI / 2, 0] },
  { position: [-1.0, 0, 2.1], rotation: [0, Math.PI / 2, 0] },
  { position: [-0.5, 0, 2.1], rotation: [0, Math.PI / 2, 0] },
  { position: [0.5, 0, 2.1], rotation: [0, Math.PI / 2, 0] },
  { position: [1.0, 0, 2.1], rotation: [0, Math.PI / 2, 0] },
  { position: [1.5, 0, 2.1], rotation: [0, Math.PI / 2, 0] },
];

function StudioContent() {
  return (
    <>
      <OrbitControls
        makeDefault
        target={[0, 0.7, 0.3]}
        minDistance={2.5}
        maxDistance={8.5}
        maxPolarAngle={Math.PI / 2 - 0.05}
        minPolarAngle={0.15}
        enablePan={false}
        enableZoom={true}
        autoRotate={false}
        dampingFactor={0.05}
      />

      {/* Éclairage studio Spline */}
      <ambientLight intensity={0.9} />
      <directionalLight position={[6, 8, 5]} intensity={1.3} />
      <directionalLight position={[-6, 6, -3]} intensity={0.5} />
      <pointLight position={[0, 3, -1]} intensity={0.8} color="#818cf8" />

      {/* Toile de projection suspendue (Position exacte Spline) */}
      <TableauModel
        position={[0, 0.7, -1.4]}
        rotation={[0, 0, 0]}
        scale={2.0}
      />

      {/* Projecteur au plafond (Position exacte Spline) */}
      <ProjecteurModel
        position={[0, 2.81, -1.0]}
        rotation={[0, -Math.PI / 2, 0]}
        scale={1.0}
      />

      {/* Mini PC Dell Wyse 5070 discret */}
      <WyseModel
        position={[2.0, 0, -1.2]}
        rotation={[0, -0.35, 0]}
        scale={0.5}
      />

      {/* Les 12 vélos stationnaires texturés aux positions Spline */}
      {BIKES_EXACT_GRID.map((bike, index) => (
        <VeloModel
          key={index}
          position={bike.position}
          rotation={bike.rotation}
          scale={1.0}
        />
      ))}

      {/* Ombre de sol contact optimisée (mise en cache) */}
      <ContactShadows
        position={[0, -0.01, 0.5]}
        opacity={0.45}
        scale={14}
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
              camera={{ position: [3.8, 2.4, 4.6], fov: 38 }}
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







