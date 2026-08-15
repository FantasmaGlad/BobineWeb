"use client";

import { useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import type { Group } from "three";

const MODEL_URL = "/models/wyse5070.glb";

export default function WyseModel({
  onToggle,
}: {
  onToggle: () => void;
}) {
  const { scene } = useGLTF(MODEL_URL);
  const groupRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;
    // Léger grossissement au survol — seul indice, avec le curseur, que
    // l'objet est cliquable (pas d'affordance visuelle "bouton" sur le mesh).
    const target = hovered ? 1.02 : 1;
    const next = group.scale.x + (target - group.scale.x) * Math.min(delta * 8, 1);
    group.scale.setScalar(next);
  });

  return (
    <group
      ref={groupRef}
      onClick={(event: ThreeEvent<MouseEvent>) => {
        event.stopPropagation();
        onToggle();
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
    </group>
  );
}

useGLTF.preload(MODEL_URL);
