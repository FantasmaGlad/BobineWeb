"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
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
import VeloModel from "./VeloModel";

const VIDEO_URL = "/videos/VideoDemo.mp4";

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
  }, [fallback]);

  return accentColor;
}

// Espace 3D léger en arrière-plan teinté avec les couleurs du thème actif
function ThemeSpace3D() {
  const themeAccent = useThemeAccent();
  const particlesRef = useRef<THREE.Points>(null);

  // 100 particules ambiantes légères en suspension dans le studio
  const [particlePositions] = useState(() => {
    const coords = new Float32Array(100 * 3);
    for (let i = 0; i < 100; i++) {
      coords[i * 3] = (Math.random() - 0.5) * 36;
      coords[i * 3 + 1] = Math.random() * 16;
      coords[i * 3 + 2] = (Math.random() - 0.5) * 36;
    }
    return coords;
  });

  return (
    <group>
      {/* Grille au sol légère teintée */}
      <gridHelper
        args={[36, 36, themeAccent, themeAccent]}
        position={[0, -0.01, 0]}
      >
        <lineBasicMaterial attach="material" color={themeAccent} transparent opacity={0.15} />
      </gridHelper>

      {/* Anneaux lumineux subtils au sol sous le studio */}
      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[8.5, 8.6, 64]} />
        <meshBasicMaterial color={themeAccent} transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[13.5, 13.6, 64]} />
        <meshBasicMaterial color={themeAccent} transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>

      {/* Particules flottantes d'ambiance */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          color={themeAccent}
          transparent
          opacity={0.4}
          sizeAttenuation={true}
        />
      </points>
    </group>
  );
}

function LoadingOverlay() {
  const { active } = useProgress();
  if (!active) return null;
  return (
    <div className="power-demo__loading power-demo__loading--overlay">
      Chargement de la scène 3D…
    </div>
  );
}

// Voile HD officiel 610x360 à x475 y782 z0 avec texture vidéo interactive et audio
function VoileHD({
  playing,
  onActivate,
}: {
  playing: boolean;
  onActivate: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const [texture, setTexture] = useState<THREE.VideoTexture | null>(null);
  const themeAccent = useThemeAccent();

  useEffect(() => {
    const el = document.createElement("video");
    el.src = VIDEO_URL;
    el.crossOrigin = "anonymous";
    el.loop = true;
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
      video.muted = false;
      video.volume = 0.85;
      const promise = video.play();
      if (promise !== undefined) {
        promise.catch((err) => {
          console.warn("Autoplay / audio error, falling back to muted:", err);
          video.muted = true;
          video.play().catch(() => {});
        });
      }
    } else {
      video.pause();
      video.muted = true;
    }
  }, [playing]);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.needsUpdate = true;
    }
  }, [playing, texture]);

  return (
    <group position={[4.75, 7.82, 0]} rotation={[0, Math.PI / 2, 0]}>
      {/* Voile HD Format 6.10m x 3.60m */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onActivate();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
        }}
      >
        <planeGeometry args={[6.10, 3.60]} />
        <meshBasicMaterial
          ref={materialRef}
          map={playing ? texture : null}
          color={playing ? "#ffffff" : themeAccent}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// Positions des 4 vélos face à l'écran depuis scene.gltf
const BIKES_SCENE = [
  { position: [-2.5, 0, -2.0] as const },
  { position: [-2.5, 0, -5.2] as const },
  { position: [-2.5, 0, 2.0] as const },
  { position: [-2.5, 0, 5.2] as const },
];

export default function PowerDemoScene() {
  const [playing, setPlaying] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  const togglePlaying = () => setPlaying((prev) => !prev);

  return (
    <div ref={stageRef} className="power-demo__stage">
      <Canvas
        camera={{ position: [-13.5, 9.5, 11.5], fov: 38 }}
        frameloop={playing ? "always" : "demand"}
        dpr={[1, 1.5]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
          preserveDrawingBuffer: false,
          stencil: false,
        }}
      >
        {/* Éclairage studio immersif */}
        <ambientLight intensity={playing ? 1.0 : 0.85} />
        <directionalLight position={[12, 18, 12]} intensity={1.3} />
        <directionalLight position={[-12, 10, -8]} intensity={0.45} />
        {playing && (
          <pointLight position={[3.5, 7.8, 0]} intensity={2.5} color="#38bdf8" distance={14} />
        )}

        <Suspense fallback={null}>
          {/* Environnement 3D teinté aux couleurs du thème actif */}
          <ThemeSpace3D />

          {/* 1. Voile HD 610x360 à x475 y782 z0 */}
          <VoileHD playing={playing} onActivate={togglePlaying} />

          {/* 2. TV 3D positionnée à x500 y547.7 z0 */}
          <TvModel
            playing={playing}
            onActivate={togglePlaying}
            position={[5.0, 5.48, 0]}
            rotation={[0, Math.PI / 2, 0]}
            scale={1.12}
          />

          {/* 3. Wyse 5070 positionné à x500 y600 z500 */}
          <WyseModel
            active={playing}
            onActivate={togglePlaying}
            position={[5.0, 6.0, 5.0]}
            rotation={[0, Math.PI / 2, 0]}
            scale={0.3}
          />

          {/* 4. Les 4 vélos stationnaires de scene.gltf face au voile */}
          {BIKES_SCENE.map((bike, idx) => (
            <VeloModel
              key={idx}
              position={bike.position}
              rotation={[0, 0, 0]}
              scale={0.8}
            />
          ))}

          {/* Ombre de sol contact douce */}
          <ContactShadows
            position={[0, 0, 0]}
            opacity={0.45}
            blur={2.5}
            far={12}
            scale={22}
            frames={1}
          />
        </Suspense>

        <OrbitControls
          makeDefault
          enablePan={false}
          enableDamping={true}
          dampingFactor={0.08}
          minDistance={3.5}
          maxDistance={30}
          minPolarAngle={0.1}
          maxPolarAngle={Math.PI / 2 - 0.02}
          target={[1.2, 5.2, 0]}
        />

        <GizmoHelper alignment="bottom-right" margin={[48, 48]}>
          <GizmoViewport
            axisColors={["#e4626f", "#7fcf7f", "#6fa8e6"]}
            labelColor="#1a1a1a"
          />
        </GizmoHelper>
      </Canvas>

      <LoadingOverlay />

      <div className="power-demo__status" data-on={playing}>
        <span className="power-demo__dot" />
        {playing ? "Démo vidéo en cours" : "Cliquez sur le Wyse ou l'écran pour lancer la démo"}
      </div>
    </div>
  );
}
