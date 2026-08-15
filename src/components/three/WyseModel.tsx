"use client";

import { useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import type { Group } from "three";

const MODEL_URL = "/models/wyse5070.glb";

export default function WyseModel({
  active,
  onActivate,
  position = [0, 0, 0] as const,
  rotation = [0, 0, 0] as const,
  scale = 1,
}: {
  active: boolean;
  onActivate: () => void;
  position?: readonly [number, number, number];
  rotation?: readonly [number, number, number];
  scale?: number;
}) {
  const { scene } = useGLTF(MODEL_URL);
  const groupRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;
    // Léger grossissement au survol — seul indice, avec le curseur, que
    // l'objet est cliquable (pas d'affordance visuelle "bouton" sur le mesh).
    const target = hovered ? scale * 1.04 : scale;
    const next = group.scale.x + (target - group.scale.x) * Math.min(delta * 8, 1);
    group.scale.setScalar(next);
  });

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={(event: ThreeEvent<MouseEvent>) => {
        event.stopPropagation();
        onActivate();
      }}
      onPointerOver={(event: ThreeEvent<PointerEvent>) => {
        event.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
    >
      <primitive object={scene} />
      {active && (
        <pointLight position={[0, 0.5, 0.6]} intensity={1.2} color="#6fd6e6" distance={1.6} />
      )}
    </group>
  );
}

useGLTF.preload(MODEL_URL);
