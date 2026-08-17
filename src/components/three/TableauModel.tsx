"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const MODEL_URL = "/models/tableau.glb";
const VIDEO_URL = "/videos/kiosk-demo.mp4";

// Dimensions et positions exactes fournies depuis l'inspecteur Spline
const SCREEN_SIZE = {
  width: 1.90,
  height: 1.40,
  y: 1.55,
  zFront: -1.375,
  zBack: -1.425,
};

export default function TableauModel({
  playing = false,
  onActivate,
  position = [0, 0.7, -1.4] as const,
  rotation = [0, 0, 0] as const,
  scale = 2.0,
}: {
  playing?: boolean;
  onActivate?: () => void;
  position?: readonly [number, number, number];
  rotation?: readonly [number, number, number];
  scale?: number;
}) {
  const { scene } = useGLTF(MODEL_URL);
  const clone = useMemo(() => scene.clone(), [scene]);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [texture, setTexture] = useState<THREE.VideoTexture | null>(null);

  // Initialisation de la texture vidéo pour l'écran de projection
  useEffect(() => {
    const el = document.createElement("video");
    el.src = VIDEO_URL;
    el.loop = true;
    el.muted = true;
    el.playsInline = true;
    el.preload = "auto";
    videoRef.current = el;

    const videoTexture = new THREE.VideoTexture(el);
    videoTexture.colorSpace = THREE.SRGBColorSpace;
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    videoTexture.generateMipmaps = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTexture(videoTexture);

    return () => {
      el.pause();
      videoTexture.dispose();
      videoRef.current = null;
    };
  }, []);

  // Gestion lecture / pause du flux vidéo
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (playing) {
      video.currentTime = 0;
      const promise = video.play();
      if (promise !== undefined) {
        promise.catch((err) => {
          console.warn("Erreur lecture vidéo RPM:", err);
        });
      }
    } else {
      video.pause();
    }
  }, [playing]);

  const handlePointerOver = (e: { stopPropagation: () => void }) => {
    if (onActivate) {
      e.stopPropagation();
      document.body.style.cursor = "pointer";
    }
  };

  const handlePointerOut = () => {
    if (onActivate) {
      document.body.style.cursor = "auto";
    }
  };

  const handleClick = (e: { stopPropagation: () => void }) => {
    if (onActivate) {
      e.stopPropagation();
      onActivate();
    }
  };

  return (
    <group>
      {/* Modèle de structure de l'écran déroulant */}
      <group position={position} rotation={rotation} scale={scale}>
        <primitive object={clone} />
      </group>

      {/* Voile rectangulaire Face Avant (vers les vélos) */}
      <mesh
        position={[0, SCREEN_SIZE.y, SCREEN_SIZE.zFront]}
        rotation={[0, 0, 0]}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <planeGeometry args={[SCREEN_SIZE.width, SCREEN_SIZE.height]} />
        <meshBasicMaterial
          map={playing ? texture : null}
          color={playing ? "#ffffff" : "#f1f5f9"}
          toneMapped={false}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Voile rectangulaire Face Arrière */}
      <mesh
        position={[0, SCREEN_SIZE.y, SCREEN_SIZE.zBack]}
        rotation={[0, Math.PI, 0]}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <planeGeometry args={[SCREEN_SIZE.width, SCREEN_SIZE.height]} />
        <meshBasicMaterial
          map={playing ? texture : null}
          color={playing ? "#ffffff" : "#e2e8f0"}
          toneMapped={false}
          side={THREE.FrontSide}
        />
      </mesh>
    </group>
  );
}

useGLTF.preload(MODEL_URL);
