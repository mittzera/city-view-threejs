/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */

"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { MapControls } from "three/examples/jsm/controls/MapControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { pointsOfInterest } from "./pointsOfInterest";

const ThreeScene = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [sidebarInfo, setSidebarInfo] = useState<{
    title: string;
    description: string;
    image: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Adiciona luz
    const light = new THREE.AmbientLight(0xffffff, 1);
    scene.add(light);

    const loader = new GLTFLoader();
    loader.load(
      "https://raw.githubusercontent.com/mittzera/Threejs-boilerplate/a1eacf42e7481b9bc9acbecb2a4098f75702e7ba/public/sporting_village.glb",
      (glb) => {
        const model = glb.scene;
        scene.add(model);
        model.position.set(0, 0, 0);
        setIsLoading(false); // Set loading to false when the model is loaded
      },
      undefined,
      (error) => {
        console.error("Erro ao carregar modelo", error);
        setIsLoading(false); // Set loading to false even if there's an error
      }
    );

    const spheres: THREE.Mesh[] = [];
    pointsOfInterest.forEach((poi) => {
      const geometry = new THREE.SphereGeometry(0.2, 16, 16);
      const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.copy(poi.position);
      scene.add(sphere);
      spheres.push(sphere);

      // Armazena os dados do ponto no objeto para identificação posterior
      (sphere as any).userData = {
        title: poi.title,
        description: poi.description,
        image: poi.image,
      };
    });

    const controls = new MapControls(camera, renderer.domElement);
    controls.update();

    const animate = () => {
      renderer.render(scene, camera);
    };
    renderer.setAnimationLoop(animate);

    const handleClick = (event: MouseEvent) => {
      if (!mountRef.current) return;

      const rect = mountRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(spheres);

      if (intersects.length > 0) {
        const { title, description, image } = intersects[0].object.userData;
        setSidebarInfo({ title, description, image });
      }
    };

    mountRef.current.addEventListener("click", handleClick);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      mountRef.current?.removeChild(renderer.domElement);
      mountRef.current?.removeEventListener("click", handleClick);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
          <div className="loader"></div>
        </div>
      )}
      <div ref={mountRef} className="w-full h-full" />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-lg transform transition-transform duration-300 ${
          sidebarInfo ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          className="absolute top-4 left-4 text-gray-600"
          onClick={() => setSidebarInfo(null)}
        >
          ✖
        </button>
        {sidebarInfo && (
          <div className="p-4 mt-10">
            <p className="mt-2 font-bold text-2xl text-gray-700">
              {sidebarInfo.title}
            </p>
            <Image
              src={sidebarInfo.image}
              alt={sidebarInfo.title}
              className="mt-2 rounded-lg shadow-md"
              width={300}
              height={200}
            />
            <p className="mt-2 text-gray-700">{sidebarInfo.description}</p>
          </div>
        )}
      </div>
    </>
  );
};

// Add some basic styles for the loader
const styles = `
  .loader {
    border: 16px solid #f3f3f3;
    border-radius: 50%;
    border-top: 16px solid #3498db;
    width: 120px;
    height: 120px;
    animation: spin 2s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Inject the styles into the document head
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

export default ThreeScene;
