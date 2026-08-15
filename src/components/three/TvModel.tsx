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
  position: [0, 0.482, 0.048] as const,
  rotation: [0, 0, 0] as const,
  width: 0.895,
  height: 0.67,
};

const VEIL_CSS_VAR = "--accent-primary";
const VEIL_FALLBACK = "#1a1a1a";

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
  onActivate,
  position = [0, 0, 0] as const,
  rotation = [0, 0, 0] as const,
  scale = 1,
}: {
  playing: boolean;
  onActivate?: () => void;
  position?: readonly [number, number, number];
  rotation?: readonly [number, number, number];
  scale?: number;
}) {
  const { scene } = useGLTF(MODEL_URL);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const [texture, setTexture] = useState<THREE.VideoTexture | null>(null);
  const veilColor = useCssColor(VEIL_CSS_VAR, VEIL_FALLBACK);

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

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (playing) {
      video.currentTime = 0;
      const promise = video.play();
      if (promise !== undefined) {
        promise.catch((err) => {
          console.warn("Autoplay / video play error:", err);
        });
      }
    } else {
      video.pause();
    }
  }, [playing]);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.needsUpdate = true;
    }
  }, [playing, texture]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <primitive object={scene} />
      <mesh
        position={SCREEN.position}
        rotation={SCREEN.rotation}
        onClick={(e) => {
          if (onActivate) {
            e.stopPropagation();
            onActivate();
          }
        }}
        onPointerOver={(e) => {
          if (onActivate) {
            e.stopPropagation();
            document.body.style.cursor = "pointer";
          }
        }}
        onPointerOut={() => {
          if (onActivate) {
            document.body.style.cursor = "auto";
          }
        }}
      >
        <planeGeometry args={[SCREEN.width, SCREEN.height]} />
        <meshBasicMaterial
          ref={materialRef}
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
