"use client";

import { Suspense, useEffect, useRef, useState, type RefObject } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  ContactShadows,
  GizmoHelper,
  GizmoViewport,
  OrbitControls,
  useProgress,
} from "@react-three/drei";
import * as THREE from "three";
import TvModel from "./TvModel";
import WyseModel from "./WyseModel";

function ResizeOnFullscreenChange() {
  // Le passage en plein écran ne redimensionne pas toujours fiablement le
  // renderer three.js (le canvas peut rester bloqué à sa taille précédente
  // le temps que le ResizeObserver interne réagisse à la transition) — on
  // force explicitement la remise à taille juste après la transition.
  const { gl, camera } = useThree();

  useEffect(() => {
    const handler = () => {
      requestAnimationFrame(() => {
        const parent = gl.domElement.parentElement;
        if (!parent) return;
        const { width, height } = parent.getBoundingClientRect();
        if (width === 0 || height === 0) return;
        gl.setSize(width, height);
        if (camera instanceof THREE.PerspectiveCamera) {
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
        }
      });
    };
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, [gl, camera]);

  return null;
}

function LoadingOverlay() {
  // useProgress est un hook React normal (pas un composant de la scène) :
  // il peut vivre en dehors du <Canvas>, ce qui évite tout souci de
  // positionnement/projection propre au rendu 3D pour un simple indicateur.
  const { active } = useProgress();
  if (!active) return null;
  return (
    <div className="power-demo__loading power-demo__loading--overlay">
      Chargement des modèles…
    </div>
  );
}

function FullscreenButton({
  targetRef,
}: {
  targetRef: RefObject<HTMLDivElement | null>;
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handler = () =>
      setIsFullscreen(document.fullscreenElement === targetRef.current);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, [targetRef]);

  return (
    <button
      type="button"
      className="power-demo__fullscreen"
      aria-pressed={isFullscreen}
      onClick={() => {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          targetRef.current?.requestFullscreen().catch(() => {});
        }
      }}
    >
      {isFullscreen ? "Quitter le plein écran" : "Plein écran"}
    </button>
  );
}

export default function PowerDemoScene() {
  const [playing, setPlaying] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={stageRef} className="power-demo__stage">
      <Canvas
        camera={{ position: [0, 1, 6.5], fov: 32 }}
        dpr={[1, 1.75]}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={playing ? 0.85 : 0.65} />
        <directionalLight position={[2, 3, 2]} intensity={0.9} />
        <directionalLight position={[-2, 1.5, -1.5]} intensity={0.3} />
        <Suspense fallback={null}>
          <TvModel playing={playing} position={[-1.3, 0, 0]} scale={3.2} />
          <WyseModel
            active={playing}
            onActivate={() => setPlaying((value) => !value)}
            position={[1.7, 0, 0.25]}
            rotation={[0, 0, 0]}
            scale={0.8}
          />
          <ContactShadows
            position={[0, 0, 0]}
            opacity={0.4}
            blur={2.4}
            far={2.2}
            scale={9}
          />
        </Suspense>
        <OrbitControls
          makeDefault
          enablePan={false}
          minDistance={0.6}
          maxDistance={10}
          minPolarAngle={0.15}
          maxPolarAngle={Math.PI / 2.05}
          target={[0, 1, 0]}
        />
        <GizmoHelper alignment="bottom-right" margin={[56, 56]}>
          <GizmoViewport
            axisColors={["#e4626f", "#7fcf7f", "#6fa8e6"]}
            labelColor="#1a1a1a"
          />
        </GizmoHelper>
        <ResizeOnFullscreenChange />
      </Canvas>
      <LoadingOverlay />
      <FullscreenButton targetRef={stageRef} />
      <div className="power-demo__status" data-on={playing}>
        <span className="power-demo__dot" />
        {playing ? "Démo en lecture" : "Cliquez sur le Wyse pour lancer la démo"}
      </div>
    </div>
  );
}
