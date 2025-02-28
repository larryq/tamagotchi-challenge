import React, { useRef, useState, useEffect } from "react";
import {
  useGLTF,
  Gltf,
  PerspectiveCamera,
  RenderTexture,
} from "@react-three/drei";
import {
  useFrame,
  Canvas,
  useThree,
  extend,
  createPortal,
} from "@react-three/fiber";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import * as THREE from "three";
import { ShaderMaterial } from "three";
import Tamagotchi from "./Tamagotchi";

export default function Egg(props) {
  const [isButtonAudioReady, setIsButtonAudioReady] = useState(false);
  const groupo = useRef();
  const blueButtonRef = useRef();
  const redButtonRef = useRef();
  const greenButtonRef = useRef();
  const audioRef = useRef();
  const soundsRef = useRef({});
  const screenRef = useRef();
  const tamagotchiRef = useRef();
  const { camera } = useThree();
  const [scale, setScale] = useState(1.5); // State for scale, default 1.5
  const [rotateY, setRotateY] = useState(Math.PI / 2);
  const [rotateX, setRotateX] = useState(Math.PI);
  const [rotateZ, setRotateZ] = useState(0.0);
  const [isSleeping, setIsSleeping] = useState(false);
  const [isLocked, setIsLocked] = useState(false); //lock buttons when tamagotchi acton is in progress
  const [isGrown, setIsGrown] = useState(false);
  const [tamagotchiSize, setTamagotchiSize] = useState(1);

  const playSound = async (soundName) => {
    const sound = soundsRef.current[soundName];
    if (sound) {
      if (sound.isPlaying) {
        await sound.stop(); // Stop if already playing
      }
      await sound.play();
    } else {
      console.log(`Sound ${soundName} not loaded yet`);
    }
  };

  const wait = (seconds) => {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
  };

  const { nodes, materials } = useGLTF("/egg.glb");
  useEffect(() => {
    const listener = new THREE.AudioListener();
    // camera.add(listener);
    // const sound = new THREE.Audio(listener);
    audioRef.current = listener;
    const audioLoader = new THREE.AudioLoader();

    const soundFiles = {
      button_click: "/button_click.wav",
      whee1: "/whee1.mp3",
      whee2: "/whee2.mp3",
      whee3: "/whee3.mp3",
      crunch: "/crunch.mp3",
      yummy: "/yummy.mp3",
      slurp: "/slurp.mp3",
      yawn: "/yawn.mp3",
    };

    Object.entries(soundFiles).forEach(([name, path]) => {
      const sound = new THREE.Audio(listener);
      audioLoader.load(
        path,
        (buffer) => {
          sound.setBuffer(buffer);
          sound.setVolume(0.2);
          soundsRef.current[name] = sound;
          console.log(`${name} loaded successfully`);
        },
        (progress) => {
          console.log(
            `${name} loading:`,
            (progress.loaded / progress.total) * 100
          );
        },
        (error) => {
          console.error(`Error loading ${name}:`, error);
        }
      );
    });

    return () => {
      Object.values(soundsRef.current).forEach((sound) => {
        if (sound.isPlaying) sound.stop();
      });
    };
  }, [camera]);

  const eatingClick = async (e) => {
    e.stopPropagation();
    if (isLocked) return;
    setIsLocked(true);
    if (audioRef.current) {
      await playSound("button_click");
      playSound("slurp");
      await wait(0.6); // Wait for 1 second
      playSound("yummy");
    }

    const newScale = scale + 0.5;
    const scaleObj = { value: scale };
    gsap.to(scaleObj, {
      duration: 0.6, // 1 second
      value: newScale,
      ease: "power2.inOut",
      onComplete: () => setScale(newScale),
      onUpdate: () => setScale(scaleObj.value),
    });
    setIsLocked(false);
    setTamagotchiSize(tamagotchiSize + 1);
  };

  const sleepingClick = async (e) => {
    e.stopPropagation();
    if (isLocked) return;
    setIsLocked(true);
    setIsSleeping(true);

    if (audioRef.current) {
      await playSound("button_click");
      await playSound("yawn");
    }
    await wait(1.6); // Wait for 1 second
    setIsSleeping(false);
    setIsLocked(false);
  };

  const playingClick = (e) => {
    e.stopPropagation();
    if (isLocked) return;
    setIsLocked(true);
    if (audioRef.current) {
      playSound("button_click");
      playSound("whee1");
    }

    const rotateVal = Math.PI / 2;

    const rotateObj = { value: rotateY };

    gsap.to(rotateObj, {
      duration: 1,
      value: rotateObj.value + Math.PI * 2,
      ease: "power2.inOut",
      onComplete: () => setRotateY(rotateVal),
      onUpdate: () => setRotateY(rotateObj.value),
    });
    setIsLocked(false);
  };

  useGLTF("/egg.glb");

  const renderScene = new THREE.Scene();
  const renderCamera = useRef();
  const textureRef = useRef();
  const shaderRef = useRef();

  useFrame((clock) => {
    // if (shaderRef.current) {
    //   const time = clock.getElapsedTime();
    //   shaderRef.current.material.uniforms.time.value = time;
    //   shaderRef.current.material.needsUpdate = true;
    // }
  });

  if (tamagotchiSize < 5) {
    return (
      <group {...props} dispose={null}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.egg_body.geometry}
          material={materials["egg shell"]}
          rotation={[0, 0.138, 0]}
          scale={1.721}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.screen.geometry}
          position={[0.047, 0.814, 0.871]}
          rotation={[1.488, 0, 0]}
        >
          <meshStandardMaterial>
            <RenderTexture
              attach="map"
              anisotropy={16}
              ref={textureRef}
              camera={renderCamera.current}
            >
              <PerspectiveCamera
                lookAt={[0, 0, 0]}
                makeDefault
                aspect={1}
                position={[0, 0, 2.5]}
                ref={renderCamera}
                fov={55}
                near={0.1}
                far={1000}
              />
              ;
              <color attach="background" args={["grey"]} />
              <ambientLight intensity={1.0} />
              {/* <ShaderPlane ref={shaderRef} /> */}
              <Tamagotchi
                scale={scale}
                rotation={[rotateX, rotateY, rotateZ]}
                position={[0, 0, 0]}
                sleeping={isSleeping}
              />
              <ambientLight intensity={1.0} />
              <directionalLight position={[10, 10, 5]} />
              <pointLight position={[0, 0, 5]} intensity={1.0} />
            </RenderTexture>
          </meshStandardMaterial>
        </mesh>
        <mesh
          ref={blueButtonRef}
          castShadow
          receiveShadow
          geometry={nodes.button1.geometry}
          material={materials["Material.003"]}
          position={[0.043, -0.572, 0.898]}
          scale={0.237}
          onClick={sleepingClick}
          onPointerDown={() =>
            (blueButtonRef.current.material = materials["shiny_button"])
          } // Visual feedback
          onPointerUp={() =>
            (blueButtonRef.current.material = materials["Material.003"])
          }
        />
        <mesh
          ref={redButtonRef}
          castShadow
          receiveShadow
          geometry={nodes.button2.geometry}
          material={materials["Material.002"]}
          position={[0.653, -0.572, 0.898]}
          scale={0.237}
          onClick={eatingClick}
          onPointerDown={() =>
            (redButtonRef.current.material = materials["shiny_button"])
          } // Visual feedback
          onPointerUp={() =>
            (redButtonRef.current.material = materials["Material.002"])
          }
        />
        <mesh
          ref={greenButtonRef}
          castShadow
          receiveShadow
          geometry={nodes.button3.geometry}
          material={materials["Material.004"]}
          position={[-0.572, -0.572, 0.898]}
          scale={0.237}
          onClick={playingClick}
          onPointerDown={() =>
            (greenButtonRef.current.material = materials["shiny_button"])
          } // Visual feedback
          onPointerUp={() =>
            (greenButtonRef.current.material = materials["Material.004"])
          }
        />
      </group>
    );
  }
  return (
    <Tamagotchi
      scale={[7, 7, 7]}
      rotation={[0, -Math.PI / 2, 0]}
      position={[0, 0, 0]}
      sleeping={false}
      onClick={() => {
        setTamagotchiSize(1);
        setScale(1.5);
      }}
    />
  );
}

useGLTF.preload("/egg.glb");
