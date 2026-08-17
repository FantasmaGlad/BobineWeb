"use client";

import { useGLTF } from "@react-three/drei";

const MODEL_URL = "/models/tableau.glb";

export default function TableauModel({
  position = [0, 0, 0] as const,
  rotation = [0, 0, 0] as const,
  scale = 1,
}: {
  position?: readonly [number, number, number];
  rotation?: readonly [number, number, number];
  scale?: number;
}) {
  const { scene } = useGLTF(MODEL_URL);
  const clone = scene.clone();

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <primitive object={clone} />
    </group>
  );
}

useGLTF.preload(MODEL_URL);
