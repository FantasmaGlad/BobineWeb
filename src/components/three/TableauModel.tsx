"use client";

import { useEffect, useMemo, useState } from "react";
import { useGLTF } from "@react-three/drei";
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

  // Création stable de l'élément vidéo et de sa VideoTexture via useMemo
  const { video, videoTexture } = useMemo(() => {
    if (typeof document === "undefined") {
      return { video: null, videoTexture: null };
    }
    const el = document.createElement("video");
    el.src = VIDEO_URL;
    el.loop = true;
    el.muted = true;
    el.playsInline = true;
    el.crossOrigin = "anonymous";
    el.setAttribute("webkit-playsinline", "true");
    el.preload = "auto";
    el.load();

    const texture = new THREE.VideoTexture(el);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;

    return { video: el, videoTexture: texture };
  }, []);

  // Nettoyage lors du démontage
  useEffect(() => {
    return () => {
      if (video) video.pause();
      if (videoTexture) videoTexture.dispose();
    };
  }, [video, videoTexture]);

  // Synchronisation de l'état de lecture
  useEffect(() => {
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
  }, [video, playing]);



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

      {/* 1. Écran Vidéo Face Avant (affiché et actif pendant la lecture) */}
      {videoTexture && (
        <mesh
          position={[0, SCREEN_DIMS.y, SCREEN_DIMS.zFront + 0.005]}
          rotation={[0, 0, 0]}
          visible={playing}
          onClick={handleClick}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          <planeGeometry args={[SCREEN_DIMS.width, SCREEN_DIMS.height]} />
          <meshBasicMaterial
            map={videoTexture}
            toneMapped={false}
            side={THREE.FrontSide}
          />
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
