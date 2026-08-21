"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
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
  onToggle: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const [texture, setTexture] = useState<THREE.VideoTexture | null>(null);
  const themeAccent = useThemeAccent();

  useEffect(() => {
    let el = document.getElementById("bobine-3d-video-el") as HTMLVideoElement;
    if (!el) {
      el = document.createElement("video");
      el.id = "bobine-3d-video-el";
      el.src = VIDEO_URL;
      el.loop = true;
      el.playsInline = true;
      el.preload = "auto";
      el.crossOrigin = "anonymous";
      el.style.position = "fixed";
      el.style.top = "-9999px";
      el.style.left = "-9999px";
      el.style.width = "1px";
      el.style.height = "1px";
      el.style.opacity = "0.01";
      el.style.pointerEvents = "none";
      document.body.appendChild(el);
    }
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
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
      videoRef.current = null;
    };
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) {
      v.currentTime = 0;
      v.muted = false;
      v.volume = 1.0;
      const p = v.play();
      if (p !== undefined) {
        p.catch((err) => {
          console.warn("Autoplay with audio blocked:", err);
          v.muted = true;
          v.play().catch(() => {});
        });
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
    if (v) {
      v.muted = false;
      v.volume = 1.0;
    }
    onToggle();
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
  const [isMuted, setIsMuted] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  const handleTogglePlay = () => {
    const el = document.getElementById("bobine-3d-video-el") as HTMLVideoElement;
    if (el) {
      el.muted = false;
      el.volume = 1.0;
    }
    setIsMuted(false);
    setPlaying((prev) => !prev);
  };

  const handleToggleMute = () => {
    const el = document.getElementById("bobine-3d-video-el") as HTMLVideoElement;
    if (el) {
      const nextMuted = !el.muted;
      el.muted = nextMuted;
      setIsMuted(nextMuted);
    }
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

          {/* 3. Les 4 vélos stationnaires face à l'écran */}
          {BIKES_STUDIO.map((bike, idx) => (
            <VeloModel
              key={idx}
              position={bike.position}
              rotation={[0, 0, 0]}
              scale={2.2}
            />
          ))}
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

      <div
        style={{
          position: "absolute",
          top: "1.25rem",
          left: "1.25rem",
          zIndex: 10,
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <button
          type="button"
          className="power-demo__status"
          data-on={playing}
          onClick={handleTogglePlay}
          style={{
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

        {playing && (
          <button
            type="button"
            className="btn-secondary"
            onClick={handleToggleMute}
            style={{
              padding: "0.35rem 0.75rem",
              fontSize: "0.8rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              cursor: "pointer",
              borderRadius: "999px",
            }}
            title={isMuted ? "Activer le son" : "Couper le son"}
          >
            {isMuted ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
                <span>Son coupé</span>
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
                <span>Son 100%</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
