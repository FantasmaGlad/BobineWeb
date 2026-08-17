"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const MODEL_URL = "/models/tableau.glb";
const VIDEO_URL = "/videos/kiosk-demo.mp4";

// Dimensions et positions exactes depuis l'inspecteur Spline
const SCREEN_DIMS = {
  width: 1.90,
  height: 1.40,
  y: 1.55,
  zFront: -1.372,
  zBack: -1.428,
};

// Hook pour récupérer dynamiquement la couleur d'accent du thème actif
function useThemeAccent(fallback = "#6366f1"): string {
  const [accentColor, setAccentColor] = useState(() => {
    if (typeof document === "undefined") return fallback;
    const val = getComputedStyle(document.documentElement)
      .getPropertyValue("--accent-primary")
      .trim();
    return val || fallback;
  });

  useEffect(() => {
    const update = () => {
      const val = getComputedStyle(document.documentElement)
        .getPropertyValue("--accent-primary")
        .trim();
      if (val) setAccentColor(val);
    };

    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  return accentColor;
}

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
  const [videoTexture, setVideoTexture] = useState<THREE.VideoTexture | null>(null);
  const themeAccent = useThemeAccent();

  // Création robuste de l'élément vidéo HTML5 et de la VideoTexture
  useEffect(() => {
    const video = document.createElement("video");
    video.src = VIDEO_URL;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = "anonymous";
    video.preload = "auto";
    videoRef.current = video;

    const texture = new THREE.VideoTexture(video);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVideoTexture(texture);

    return () => {
      video.pause();
      texture.dispose();
      videoRef.current = null;
    };
  }, []);

  // Lecture / pause synchrone
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (playing) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Lecture vidéo 3D RPM :", err);
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
      {/* Structure de l'écran déroulant suspendu */}
      <group position={position} rotation={rotation} scale={scale}>
        <primitive object={clone} />
      </group>

      {/* Voile & Écran Face Avant (orienté vers les vélos) */}
      <mesh
        position={[0, SCREEN_DIMS.y, SCREEN_DIMS.zFront]}
        rotation={[0, 0, 0]}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <planeGeometry args={[SCREEN_DIMS.width, SCREEN_DIMS.height]} />
        <meshBasicMaterial
          map={playing && videoTexture ? videoTexture : null}
          color={playing ? "#ffffff" : themeAccent}
          toneMapped={false}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Voile Face Arrière (couleur du thème au repos et en lecture) */}
      <mesh
        position={[0, SCREEN_DIMS.y, SCREEN_DIMS.zBack]}
        rotation={[0, Math.PI, 0]}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <planeGeometry args={[SCREEN_DIMS.width, SCREEN_DIMS.height]} />
        <meshBasicMaterial
          color={themeAccent}
          toneMapped={false}
          side={THREE.FrontSide}
        />
      </mesh>
    </group>
  );
}

useGLTF.preload(MODEL_URL);
