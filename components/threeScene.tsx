/* eslint-disable react-hooks/exhaustive-deps */
 
"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { MapControls } from "three/examples/jsm/controls/MapControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const ThreeScene = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xfefefe);
    mountRef.current.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(6, 8, 14);

    const loader = new GLTFLoader();
    loader.load(
      "https://raw.githubusercontent.com/mittzera/Threejs-boilerplate/a1eacf42e7481b9bc9acbecb2a4098f75702e7ba/public/sporting_village.glb",
      (glb) => {
        const model = glb.scene;
        scene.add(model);
        model.position.set(0, 0, 0);
      },
      undefined,
      (error) => {
        console.error("Erro ao carregar modelo", error);
      }
    );


    const controls = new MapControls(camera, renderer.domElement);
    controls.update();

    const animate = () => {
      renderer.render(scene, camera);
    };
    renderer.setAnimationLoop(animate);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      mountRef.current?.removeChild(renderer.domElement);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
};

export default ThreeScene;
