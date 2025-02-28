import React, { useRef, useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame, useLoader } from "@react-three/fiber";
import { useShallow } from "zustand/react/shallow";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import * as THREE from "three";

export default function Tamagotchi(props) {
  const tamagotchiRef = useRef();
  const textureURLs = [
    "/tamagotchi sleeping 1.jpeg",
    "/tamagotchi sleeping 2.jpeg",
    "/tamagotchi sleeping 4.jpeg",
  ];
  const sleepingTextures = useLoader(THREE.TextureLoader, textureURLs);

  const randomTexture = useMemo(() => {
    if (sleepingTextures && sleepingTextures.length > 0) {
      const randomIndex = THREE.MathUtils.randInt(
        0,
        sleepingTextures.length - 1
      );
      return sleepingTextures[randomIndex];
    }
    return null;
  }, [sleepingTextures]);

  const getRandomTexture = () => {
    if (sleepingTextures && sleepingTextures.length > 0) {
      const randomIndex = THREE.MathUtils.randInt(
        0,
        sleepingTextures.length - 1
      );
      return sleepingTextures[randomIndex];
    }
    return null; // Or a default texture
  };

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
        scale={[5, 4, 4]}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={getRandomTexture()}
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
