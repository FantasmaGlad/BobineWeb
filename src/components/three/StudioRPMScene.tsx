"use client";

import { Suspense, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import TvModel from "./TvModel";
import WyseModel from "./WyseModel";
import VeloModel from "./VeloModel";

const Spline = dynamic(() => import("@splinetool/react-spline/next"), {
  ssr: false,
  loading: () => (
    <div className="studio-rpm-loading">
      Chargement de la scène 3D Spline...
    </div>
  ),
});

type CameraView = "studio" | "screen" | "rider";
type SceneEngine = "three" | "spline";

const VIEW_PRESETS: Record<
  CameraView,
  { position: [number, number, number]; target: [number, number, number] }
> = {
  studio: {
    position: [0, 2.2, 5.2],
    target: [0, 0.4, 0],
  },
  screen: {
    position: [0, 1.1, 2.6],
    target: [0, 0.6, -0.2],
  },
  rider: {
    position: [-0.9, 1.4, 2.8],
    target: [0, 0.7, -0.3],
  },
};

function SceneContent({
  playing,
  onTogglePlay,
  view,
}: {
  playing: boolean;
  onTogglePlay: () => void;
  view: CameraView;
}) {
  const controlsRef = useRef<OrbitControlsImpl>(null);

  const preset = VIEW_PRESETS[view];

  return (
    <>
      <OrbitControls
        ref={controlsRef}
        makeDefault
        target={preset.target}
        minDistance={2}
        maxDistance={8}
        maxPolarAngle={Math.PI / 2 - 0.05}
        enablePan={false}
        enableZoom={true}
        autoRotate={false}
      />

      <ambientLight intensity={playing ? 0.9 : 0.75} />
      <directionalLight position={[4, 6, 4]} intensity={1.1} castShadow />
      <directionalLight position={[-4, 4, -2]} intensity={0.4} />
      <pointLight position={[0, 2, 0]} intensity={playing ? 1.2 : 0.6} color="#818cf8" />

      {/* Écran TV Bobine au centre de la scène */}
      <TvModel
        playing={playing}
        onActivate={onTogglePlay}
        position={[0, 0.2, -0.5]}
        scale={1.35}
      />

      {/* Mini PC Dell Wyse 5070 posé sur la droite de l'écran */}
      <WyseModel position={[1.1, -0.35, -0.4]} scale={0.7} />

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
        opacity={0.45}
        scale={8}
        blur={2}
        far={3}
      />
    </>
  );
}

export default function StudioRPMScene() {
  const [playing, setPlaying] = useState(true);
  const [view, setView] = useState<CameraView>("studio");
  const [engine, setEngine] = useState<SceneEngine>("spline");

  return (
    <div className="studio-rpm-container">
      <div className="studio-rpm-header">
        <div className="studio-rpm-title">
          <span className="studio-rpm-badge">Studio RPM & Biking 3D</span>
          <h3>Immersion en salle de cours collectifs</h3>
        </div>
        <div className="studio-rpm-controls">
          <div className="studio-rpm-btn-group" role="group" aria-label="Moteur 3D">
            <button
              type="button"
              className={`studio-rpm-btn ${engine === "spline" ? "is-active" : ""}`}
              onClick={() => setEngine("spline")}
            >
              Scène Spline 3D
            </button>
            <button
              type="button"
              className={`studio-rpm-btn ${engine === "three" ? "is-active" : ""}`}
              onClick={() => setEngine("three")}
            >
              Régie Three.js
            </button>
          </div>

          {engine === "three" && (
            <>
              <div className="studio-rpm-btn-group" role="group" aria-label="Angles de caméra">
                <button
                  type="button"
                  className={`studio-rpm-btn ${view === "studio" ? "is-active" : ""}`}
                  onClick={() => setView("studio")}
                >
                  Vue studio
                </button>
                <button
                  type="button"
                  className={`studio-rpm-btn ${view === "screen" ? "is-active" : ""}`}
                  onClick={() => setView("screen")}
                >
                  Vue régie & TV
                </button>
                <button
                  type="button"
                  className={`studio-rpm-btn ${view === "rider" ? "is-active" : ""}`}
                  onClick={() => setView("rider")}
                >
                  Vue adhérent
                </button>
              </div>
              <button
                type="button"
                className="studio-rpm-action-btn"
                onClick={() => setPlaying((prev) => !prev)}
                aria-label={playing ? "Mettre la vidéo en pause" : "Lancer la vidéo"}
              >
                {playing ? "Pause flux vidéo" : "Lancer flux vidéo"}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="studio-rpm-viewport">
        {engine === "spline" ? (
          <Spline scene="/models/scene.splinecode" />
        ) : (
          <Suspense
            fallback={
              <div className="studio-rpm-loading">
                Chargement de la scène studio 3D...
              </div>
            }
          >
            <Canvas
              camera={{ position: VIEW_PRESETS[view].position, fov: 36 }}
              dpr={[1, 1.75]}
              gl={{ alpha: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
            >
              <SceneContent
                playing={playing}
                onTogglePlay={() => setPlaying((p) => !p)}
                view={view}
              />
            </Canvas>
          </Suspense>
        )}
      </div>
      <div className="studio-rpm-footer">
        <span>
          {engine === "spline"
            ? "Scène 3D Spline interactive — Glissez pour tourner, molette pour zoomer"
            : "Faites glisser pour tourner autour des vélos et de la régie"}
        </span>
        <span>
          {engine === "spline"
            ? "Moteur Spline Runtime"
            : "Modèle Dell Wyse 5070 + TV HDMI-CEC + Vélos stationnaires"}
        </span>
      </div>
    </div>
  );
}

