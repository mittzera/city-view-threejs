/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */

"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { MapControls } from "three/examples/jsm/controls/MapControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { pointsOfInterest } from "./pointsOfInterest";
import Link from "next/link";

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
    renderer.setClearColor(0x333333); // Change to your desired color
    mountRef.current.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 90, -100);
    camera.lookAt(-10, 19, -55); // Define o ponto para onde a câmera está olhando

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Adiciona luz
    const light = new THREE.AmbientLight(0xffffff, 1);
    scene.add(light);
    
    // // Adiciona o grid de posicionamento
    // const gridHelper = new THREE.GridHelper(500, 50); // Tamanho do grid e número de divisões
    // scene.add(gridHelper);
    
    // // Adiciona indicadores de eixos x, y, z
    // const axesHelper = new THREE.AxesHelper(250); // Tamanho dos eixos (metade do grid)
    // scene.add(axesHelper);

// Red line for X axis
// Green line for Y axis
// Blue line for Z axis

    const loader = new GLTFLoader();
    loader.load(
      "https://raw.githubusercontent.com/mittzera/Threejs-boilerplate/main/public/CatedralSe.glb",
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

    const spheres: THREE.Object3D[] = [];
    pointsOfInterest.forEach((poi) => {
      // Create a pin shape (cone with sphere on top)
      const pinGroup = new THREE.Group();
      
      // Head of the pin (sphere)
      const headGeometry = new THREE.SphereGeometry(3, 16, 16);
      const headMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const head = new THREE.Mesh(headGeometry, headMaterial);
      head.position.y = 6; // Position head above the cone
      pinGroup.add(head);
      
      // Body of the pin (cone)
      const bodyGeometry = new THREE.ConeGeometry(2.8, 4, 8);
      const bodyMaterial = new THREE.MeshBasicMaterial({ color: 0xcc0000 });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.position.y = 0; // Base of the pin
      body.rotation.x = Math.PI; // Flip cone so point is down
      pinGroup.add(body);
      
      // Position the entire pin at the POI location
      // Move up by 2 so the tip of the pin is at the exact position
      pinGroup.position.copy(poi.position);
      pinGroup.position.y += 2; // Elevate slightly so pin tip is at the point
      
      scene.add(pinGroup);
      
      // Store the pin group for interaction
      (pinGroup as any).userData = {
        title: poi.title,
        description: poi.description,
        image: poi.image,
      };
      
      spheres.push(pinGroup);
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
      // Use recursive option to intersect with all meshes in the groups
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        // Find the pin group that contains this mesh
        let obj: THREE.Object3D | null = intersects[0].object;
        while (obj && (!obj.userData || !obj.userData.title)) {
          obj = obj.parent as THREE.Object3D | null;
        }
        
        if (obj && obj.userData && obj.userData.title) {
          const { title, description, image } = obj.userData;
          setSidebarInfo({ title, description, image });
        }
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
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
          <div className="loader mb-10"></div>
          <Link href={"https://www.amazonsky.com.br"} target="_blank">
            <div className="flex flex-col items-center bg-white bg-opacity-80 px-3 py-2 rounded-lg shadow-md z-10">
              <span className="text-sm font-medium text-gray-700 mb-2">
                Aerofotogrametria feita por
              </span>
              <Image
                src="/logo.png"
                alt="Company Logo"
                width={160}
                height={60}
                className="h-auto"
              />
              <span className="text-sm font-medium text-gray-700 mb-2">
                Clique aqui e conheça melhor nossos serviços
              </span>
            </div>
          </Link>
        </div>
      )}
      <div ref={mountRef} className="w-full h-full" />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-lg transform transition-transform duration-300 z-20 ${
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
            <p className="mt-2 text-gray-700 px-4 text-start overflow-y-auto">
              {sidebarInfo.description}
            </p>
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
