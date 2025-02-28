import React, { useRef, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame, useLoader } from "@react-three/fiber";
import { useShallow } from "zustand/react/shallow";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import * as THREE from "three";

export default function Tamagotchi(props) {
  const tamagotchiRef = useRef();
  const sleepingTexture = useLoader(
    THREE.TextureLoader,
    "/tamagotchi sleeping 1.jpeg"
  );
  useFrame(() => {
    if (tamagotchiRef.current) {
      // tamagotchiRef.current.rotation.y += 0.01; // Spin for demo
    }
  });
  const { nodes, materials } = useGLTF("/tamagotchi.glb");
  if (props.sleeping) {
    return (
      <mesh
        ref={tamagotchiRef}
        position={[0, 0, 0]}
        rotation={[0, 0, Math.PI]}
        scale={[4, 4, 4]}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={sleepingTexture}
          side={THREE.DoubleSide}
          transparent={false}
        />
      </mesh>
    );
  }
  return (
    <group {...props} dispose={null} ref={tamagotchiRef}>
      <mesh
        castShadow
        receiveShadow
        geometry={
          nodes["tripo_node_911e9c62-cf45-4691-9544-4fb899059873"].geometry
        }
        material={
          materials["tripo_material_911e9c62-cf45-4691-9544-4fb899059873"]
        }
      />
    </group>
  );
}

useGLTF.preload("/tamagotchi.glb");
