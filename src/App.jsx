import React, { useRef, useEffect, useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  AccumulativeShadows,
  RandomizedLight,
  OrbitControls,
  Environment,
  useGLTF,
  useVideoTexture,
  useAnimations,
  Sparkles,
  Html,
  Billboard,
  Text,
} from "@react-three/drei";
//import { EffectComposer, Bloom, HueSaturation, BrightnessContrast, TiltShift2, WaterEffect, ToneMapping } from '@react-three/postprocessing'
import Egg from "./Egg";

function Loader3() {
  return (
    <Html>
      <div id="loading-dialog" class="hidden">
        <img src="tamagotchi1.jpeg" alt="Loading..." id="loading-image" />
      </div>
    </Html>
  );
}

export default function App() {
  return (
    <Canvas
      gl={{ antialias: false }}
      flat
      shadows
      camera={{ position: [0, -11.5, 15], fov: 35 }}
    >
      <color attach="background" args={["#353535"]} />
      {/* <fog attach="fog" args={["#353535", 5, 20]} /> */}
      <ambientLight intensity={2.5} />
      <Suspense fallback={<Loader3 />}>
        <Egg position={[1, -0.225, 1]} scale={1.5} rotation={[-0.1, 0, 0]} />
        <Environment preset="city" />
        <OrbitControls
          autoRotate={false}
          autoRotateSpeed={0.9}
          enableZoom={false}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2.5}
          minAzimuthAngle={-Math.PI / 8}
          maxAzimuthAngle={Math.PI / 8}
        />
        {/* <Html
          position={[-4, 2, 0]} // Initial 3D position (adjusted by transform)
          transform={false} // Prevents it from being affected by 3D transforms
          style={{
            position: "absolute",
            top: "10px", // Distance from top of canvas
            left: "10px", // Distance from left of canvas
            color: "white",
            fontSize: "20px",
            pointerEvents: "none", // Prevents interaction with the text
          }}
        >
          Upper Left Text
        </Html> */}

        {/* <Sparkles color="white" count={1200} scale={10} size={1.5} /> */}
      </Suspense>
    </Canvas>
  );
}
