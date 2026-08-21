"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  ContactShadows,
  OrbitControls,
  useProgress,
} from "@react-three/drei";
import * as THREE from "three";
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

  // 120 particules ambiantes légères en suspension dans le studio
  const [particlePositions] = useState(() => {
    const coords = new Float32Array(120 * 3);
    for (let i = 0; i < 120; i++) {
      coords[i * 3] = (Math.random() - 0.5) * 32;
      coords[i * 3 + 1] = Math.random() * 12;
      coords[i * 3 + 2] = (Math.random() - 0.5) * 32;
    }
    return coords;
  });

  return (
    <group>
      {/* Grille au sol légère teintée */}
      <gridHelper
        args={[32, 32, themeAccent, themeAccent]}
        position={[0, 0, 0]}
      >
        <lineBasicMaterial attach="material" color={themeAccent} transparent opacity={0.12} />
      </gridHelper>

      {/* Particules flottantes d'ambiance */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.10}
          color={themeAccent}
          transparent
          opacity={0.35}
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

// Voile HD Studio 16:9 orienté vers les vélos avec texture vidéo interactive et audio
function VoileHD({
  playing,
  onToggle,
}: {
  playing: boolean;
  onToggle: (videoEl?: HTMLVideoElement) => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const [texture, setTexture] = useState<THREE.VideoTexture | null>(null);
  const themeAccent = useThemeAccent();

  useEffect(() => {
    const el = document.createElement("video");
    el.src = VIDEO_URL;
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
      el.src = "";
      videoTexture.dispose();
      videoRef.current = null;
    };
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) {
      if (v.paused) {
        v.currentTime = 0;
        v.muted = false;
        v.volume = 0.85;
        const p = v.play();
        if (p !== undefined) {
          p.catch((err) => {
            console.warn("Autoplay audio blocked, falling back to muted:", err);
            v.muted = true;
            v.play().catch(() => {});
          });
        }
      }
    } else {
      if (!v.paused) {
        v.pause();
      }
    }
  }, [playing]);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.needsUpdate = true;
    }
  }, [playing, texture]);

  const handleMeshClick = () => {
    const v = videoRef.current;
    if (v && !playing) {
      v.currentTime = 0;
      v.muted = false;
      v.volume = 0.85;
      const p = v.play();
      if (p !== undefined) {
        p.catch(() => {
          v.muted = true;
          v.play().catch(() => {});
        });
      }
    }
    onToggle(v || undefined);
  };

  return (
    <group position={[4.0, 3.2, 0]} rotation={[0, -Math.PI / 2, 0]}>
      {/* Cadre fin de l'écran cinéma studio */}
      <mesh position={[0, 0, -0.04]}>
        <boxGeometry args={[6.0, 3.46, 0.06]} />
        <meshStandardMaterial color="#111827" roughness={0.6} metalness={0.4} />
      </mesh>

      {/* Surface de diffusion vidéo HD (16:9 - 5.80m x 3.26m) */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          handleMeshClick();
        }}
        onPointerDown={(e) => {
          e.stopPropagation();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
        }}
      >
        <planeGeometry args={[5.80, 3.26]} />
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

// 4 vélos stationnaires de studio orientés face à l'écran
const BIKES_STUDIO = [
  { position: [-1.2, 0, -2.5] as const },
  { position: [-1.2, 0, -0.85] as const },
  { position: [-1.2, 0, 0.85] as const },
  { position: [-1.2, 0, 2.5] as const },
];

export default function PowerDemoScene() {
  const [playing, setPlaying] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  const handleTogglePlay = () => {
    setPlaying((prev) => !prev);
  };

  return (
    <div ref={stageRef} className="power-demo__stage" style={{ width: "100%", height: "100%", border: "none", borderRadius: 0, padding: 0, margin: 0, background: "transparent" }}>
      <Canvas
        camera={{ position: [-8.5, 4.2, 7.2], fov: 42 }}
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
        <ambientLight intensity={playing ? 1.1 : 0.9} />
        <directionalLight position={[10, 16, 10]} intensity={1.4} />
        <directionalLight position={[-10, 8, -6]} intensity={0.5} />
        {playing && (
          <pointLight position={[2.5, 3.2, 0]} intensity={3.0} color="#38bdf8" distance={12} />
        )}

        <Suspense fallback={null}>
          {/* Environnement 3D teinté aux couleurs du thème actif */}
          <ThemeSpace3D />

          {/* 1. Écran Cinéma Studio HD orienté vers la caméra et les vélos */}
          <VoileHD playing={playing} onToggle={handleTogglePlay} />

          {/* 2. Dell Wyse 5070 sur son support à droite de l'écran */}
          <WyseModel
            active={playing}
            onActivate={handleTogglePlay}
            position={[3.8, 0.35, 3.6]}
            rotation={[0, -Math.PI / 2, 0]}
            scale={0.9}
          />

          {/* 3. Les 4 vélos stationnaires face à l'écran (-Math.PI / 2 pour orienter le guidon vers l'écran) */}
          {BIKES_STUDIO.map((bike, idx) => (
            <VeloModel
              key={idx}
              position={bike.position}
              rotation={[0, -Math.PI / 2, 0]}
              scale={2.2}
            />
          ))}

          {/* Ombre de sol contact douce */}
          <ContactShadows
            position={[0, 0, 0]}
            opacity={0.5}
            blur={2.0}
            far={10}
            scale={20}
            frames={1}
          />
        </Suspense>

        <OrbitControls
          makeDefault
          enablePan={false}
          enableDamping={true}
          dampingFactor={0.08}
          minDistance={3.0}
          maxDistance={22}
          minPolarAngle={0.1}
          maxPolarAngle={Math.PI / 2 - 0.02}
          target={[1.0, 2.2, 0]}
        />
      </Canvas>

      <LoadingOverlay />

      <button
        type="button"
        className="power-demo__status"
        data-on={playing}
        onClick={handleTogglePlay}
        style={{
          position: "absolute",
          top: "1.25rem",
          left: "1.25rem",
          zIndex: 10,
          cursor: "pointer",
          border: "1px solid var(--border-subtle)",
          background: "var(--bg-card)",
          fontFamily: "inherit",
        }}
        title="Cliquez pour lancer ou mettre en pause la démo vidéo"
      >
        <span className="power-demo__dot" />
        <span>{playing ? "Démo vidéo en cours (cliquez pour pause)" : "Cliquez sur le Wyse ou l'écran pour lancer la démo"}</span>
      </button>
    </div>
  );
}
