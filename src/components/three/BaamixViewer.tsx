"use client";

import { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls, Center } from "@react-three/drei";
import type { Group } from "three";

const MODEL_PATH = "/models/baamix.glb";

function BaamixMesh() {
  const { scene } = useGLTF(MODEL_PATH);
  const groupRef = useRef<Group>(null);

  return (
    <group ref={groupRef}>
      <Center>
        <primitive object={scene} />
      </Center>
    </group>
  );
}

useGLTF.preload(MODEL_PATH);

export default function BaamixViewer() {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "340px",
        height: "280px",
        margin: "0 auto 1.5rem auto",
        borderRadius: "1rem",
        background: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
        boxShadow: "var(--shadow-card)",
        overflow: "hidden",
      }}
    >
      <Suspense
        fallback={
          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-muted)",
              fontSize: "0.85rem",
              fontWeight: 600,
            }}
          >
            <span>Chargement de Baamix 3D…</span>
          </div>
        }
      >
        <Canvas
          camera={{ position: [0, 1.2, 3], fov: 42 }}
          style={{ width: "100%", height: "100%", touchAction: "none" }}
        >
          <ambientLight intensity={1.4} />
          <directionalLight position={[4, 6, 4]} intensity={1.6} />
          <directionalLight position={[-4, 3, -3]} intensity={0.8} />
          <directionalLight position={[0, -3, 2]} intensity={0.4} />
          <BaamixMesh />
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={1.4}
            maxDistance={5.5}
            autoRotate={true}
            autoRotateSpeed={1.6}
            dampingFactor={0.05}
          />
        </Canvas>
      </Suspense>

      {/* Badge indicateur 360° */}
      <div
        style={{
          position: "absolute",
          bottom: "0.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: "0.35rem",
          padding: "0.2rem 0.6rem",
          borderRadius: "999px",
          background: "color-mix(in srgb, var(--bg-card) 85%, transparent)",
          backdropFilter: "blur(8px)",
          border: "1px solid var(--border-subtle)",
          color: "var(--text-muted)",
          fontSize: "0.725rem",
          fontWeight: 600,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
        </svg>
        <span>360° interactif</span>
      </div>
    </div>
  );
}
