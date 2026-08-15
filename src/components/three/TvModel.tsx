"use client";

import { useEffect, useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const MODEL_URL = "/models/tv3d.glb";
const VIDEO_URL = "/videos/kiosk-demo.mp4";

// Le modèle (généré par IA à partir de photos) est un mesh unique, sans
// sous-objet "écran" isolable — on plaque donc un plan indépendant
// par-dessus, calé à la main sur la zone d'écran. Constantes ajustées à
// l'œil face au rendu réel.
const SCREEN = {
  position: [0, 0.4675, 0.13] as const,
  rotation: [0, 0, 0] as const,
  width: 0.89,
  height: 0.665,
};

const VEIL_CSS_VAR = "--accent-primary";
const VEIL_FALLBACK = "#1a1a1a";

// Lit une variable CSS de thème et la garde synchronisée si l'utilisateur
// change de thème pendant la démo (le <html data-theme> change, pas une
// donnée que Three.js peut suivre tout seul).
function useCssColor(varName: string, fallback: string): string {
  const [color, setColor] = useState(() => {
    if (typeof document === "undefined") return fallback;
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim();
    return value || fallback;
  });

  useEffect(() => {
    const read = () => {
      const value = getComputedStyle(document.documentElement)
        .getPropertyValue(varName)
        .trim();
      if (value) setColor(value);
    };
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, [varName]);

  return color;
}

export default function TvModel({
  playing,
  position = [0, 0, 0] as const,
  rotation = [0, 0, 0] as const,
  scale = 1,
}: {
  playing: boolean;
  position?: readonly [number, number, number];
  rotation?: readonly [number, number, number];
  scale?: number;
}) {
  const { scene } = useGLTF(MODEL_URL);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [texture, setTexture] = useState<THREE.VideoTexture | null>(null);
  const veilColor = useCssColor(VEIL_CSS_VAR, VEIL_FALLBACK);

  useEffect(() => {
    // Ce composant n'est jamais rendu côté serveur (chargé via `next/dynamic`
    // avec `ssr: false` en amont), donc créer le <video> et la texture ici,
    // au montage, est sûr — c'est un objet impératif muté en continu par
    // three.js à chaque frame, pas une donnée dérivable du rendu.
    const el = document.createElement("video");
    el.src = VIDEO_URL;
    el.loop = true;
    el.muted = true;
    el.playsInline = true;
    el.preload = "none";
    videoRef.current = el;

    const videoTexture = new THREE.VideoTexture(el);
    videoTexture.colorSpace = THREE.SRGBColorSpace;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTexture(videoTexture);

    return () => {
      el.pause();
      videoTexture.dispose();
      videoRef.current = null;
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) {
      video.currentTime = 0;
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [playing]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <primitive object={scene} />
      {/* Voile plein écran à la couleur du thème actif quand la démo est à
          l'arrêt, remplacé instantanément par la vidéo au clic sur le Wyse —
          même plan dans les deux cas, seul le matériau change. */}
      <mesh position={SCREEN.position} rotation={SCREEN.rotation}>
        <planeGeometry args={[SCREEN.width, SCREEN.height]} />
        <meshBasicMaterial
          map={playing ? texture : null}
          color={playing ? "#ffffff" : veilColor}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

useGLTF.preload(MODEL_URL);
