import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";

const MODEL_URL = "/models/velo.glb";

export default function VeloModel({
  position = [0, 0, 0] as const,
  rotation = [0, 0, 0] as const,
  scale = 1,
}: {
  position?: readonly [number, number, number];
  rotation?: readonly [number, number, number];
  scale?: number;
}) {
  const { scene } = useGLTF(MODEL_URL);
  const clone = useMemo(() => scene.clone(), [scene]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <primitive object={clone} />
    </group>
  );
}


useGLTF.preload(MODEL_URL);
