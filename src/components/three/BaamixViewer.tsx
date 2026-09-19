"use client";

import { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls, Center } from "@react-three/drei";
import "@/lib/gltfDecoders";
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
        margin: "0 auto 1.25rem auto",
        background: "transparent",
      }}
    >
      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 1.2, 3], fov: 42 }}
          style={{ width: "100%", height: "100%", touchAction: "none", background: "transparent" }}
        >
          <ambientLight intensity={1.4} />
          <directionalLight position={[4, 6, 4]} intensity={1.6} />
          <directionalLight position={[-4, 3, -3]} intensity={0.8} />
          <directionalLight position={[0, -3, 2]} intensity={0.4} />
          <BaamixMesh />
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            autoRotate={true}
            autoRotateSpeed={1.8}
            dampingFactor={0.05}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}
