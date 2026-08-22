"use client";

import { useEffect } from "react";
import { useGLTF } from "@react-three/drei";

const MODEL_TV = "/models/tv3d.glb";
const MODEL_WYSE = "/models/wyse5070.glb";
const VIDEO_DEMO = "/videos/VideoDemo.mp4";

export default function Demo3DPreloader() {
  useEffect(() => {
    const preload = () => {
      // 1. Preload Drei pour les modèles 3D
      try {
        useGLTF.preload(MODEL_TV);
        useGLTF.preload(MODEL_WYSE);
      } catch {
        // Silencieux
      }

      // 2. Preload HTTP de la vidéo dans le cache du navigateur
      fetch(VIDEO_DEMO, { mode: "cors" }).catch(() => {});
    };

    if (typeof window !== "undefined") {
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(preload, { timeout: 3000 });
      } else {
        setTimeout(preload, 1000);
      }
    }
  }, []);

  return null;
}
