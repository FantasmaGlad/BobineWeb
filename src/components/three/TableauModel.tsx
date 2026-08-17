"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useGLTF, useVideoTexture } from "@react-three/drei";
import * as THREE from "three";

const MODEL_URL = "/models/tableau.glb";
const VIDEO_URL = "/videos/kiosk-demo.mp4";

// Dimensions et positions exactes depuis l'inspecteur Spline
const SCREEN_DIMS = {
  width: 1.90,
  height: 1.40,
  y: 1.55,
  zFront: -1.370,
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

// Composant de texture vidéo géré par le hook natif useVideoTexture de Drei
function VideoMaterial({ playing }: { playing: boolean }) {
  const texture = useVideoTexture(VIDEO_URL, {
    start: playing,
    muted: true,
    loop: true,
    playsInline: true,
    crossOrigin: "anonymous",
  });

  useEffect(() => {
    const video = texture.image as HTMLVideoElement;
    if (!video) return;

    if (playing) {
      const p = video.play();
      if (p !== undefined) {
        p.catch((err) => console.warn("Erreur lecture vidéo RPM:", err));
      }
    } else {
      video.pause();
    }
  }, [playing, texture]);

  return (
    <meshBasicMaterial
      map={texture}
      toneMapped={false}
      side={THREE.FrontSide}
    />
  );
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
  const themeAccent = useThemeAccent();

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

      {/* 1. Écran Vidéo Face Avant (affiché pendant la lecture) */}
      {playing && (
        <mesh
          position={[0, SCREEN_DIMS.y, SCREEN_DIMS.zFront + 0.006]}
          rotation={[0, 0, 0]}
          onClick={handleClick}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          <planeGeometry args={[SCREEN_DIMS.width, SCREEN_DIMS.height]} />
          <Suspense
            fallback={
              <meshBasicMaterial
                color={themeAccent}
                toneMapped={false}
                side={THREE.FrontSide}
              />
            }
          >
            <VideoMaterial playing={playing} />
          </Suspense>
        </mesh>
      )}

      {/* 2. Voile Thème Face Avant (affiché au repos aux couleurs du thème actif) */}
      <mesh
        position={[0, SCREEN_DIMS.y, SCREEN_DIMS.zFront]}
        rotation={[0, 0, 0]}
        visible={!playing}
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

      {/* 3. Voile Thème Face Arrière (toujours habillé avec la couleur du thème) */}
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
