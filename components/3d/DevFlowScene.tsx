'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useTheme } from '@/context/ThemeContext';

const STAGES = [
  { step: '01', name: 'PROMPT PARSING', detail: 'Natural language semantic parsing & intent extraction' },
  { step: '02', name: 'AI AGENT LOOP', detail: 'Vercel AI SDK multi-turn reasoning & tool calling' },
  { step: '03', name: 'CODE SYNTHESIS', detail: 'AST generation, TypeScript interfaces & Next.js routes' },
  { step: '04', name: 'VIRTUAL FILES', detail: 'In-memory virtual file tree & dependency resolution' },
  { step: '05', name: 'SANDBOX RUNTIME', detail: 'E2B secure micro-VM execution & PostgreSQL connection' },
  { step: '06', name: 'LIVE PREVIEW', detail: 'Hot module server container ready with public tunnel' },
];

export const DevFlowScene = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const [currentStage, setCurrentStage] = useState(0);
  const [activeStageManual, setActiveStageManual] = useState<number | null>(null);
  const activeStageManualRef = useRef<number | null>(null);
  activeStageManualRef.current = activeStageManual;

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      36,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(3.5, 2.5, 5.8);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);

    // Architectural Lighting
    const ambientLight = new THREE.AmbientLight(
      theme === 'dark' ? 0xffffff : 0x222222,
      theme === 'dark' ? 1.0 : 1.4
    );
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, theme === 'dark' ? 2.5 : 2.8);
    keyLight.position.set(6, 8, 6);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xcccccc, 1.2);
    rimLight.position.set(-6, -2, -5);
    scene.add(rimLight);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Architectural Materials
    const isDark = theme === 'dark';
    const matGraphite = new THREE.MeshStandardMaterial({
      color: isDark ? 0x161616 : 0x2c2c2c,
      roughness: 0.4,
      metalness: 0.3,
    });
    const matAluminum = new THREE.MeshStandardMaterial({
      color: isDark ? 0x2e2e2e : 0xe2e0dc,
      roughness: 0.2,
      metalness: 0.85,
    });
    const matFrosted = new THREE.MeshPhysicalMaterial({
      color: isDark ? 0x222222 : 0xf7f6f3,
      roughness: 0.2,
      transmission: 0.6,
      thickness: 0.3,
      transparent: true,
      opacity: 0.8,
    });
    const matCore = new THREE.MeshStandardMaterial({
      color: isDark ? 0x202020 : 0xdedede,
      roughness: 0.25,
      metalness: 0.7,
    });
    const matEdge = new THREE.LineBasicMaterial({
      color: isDark ? 0x777777 : 0x999999,
      transparent: true,
      opacity: 0.7,
    });

    const addEdges = (mesh: THREE.Mesh) => {
      const edges = new THREE.EdgesGeometry(mesh.geometry);
      const line = new THREE.LineSegments(edges, matEdge);
      mesh.add(line);
    };

    // Component 1: Prompt Input Base (Machined slab)
    const promptGeom = new THREE.BoxGeometry(2.4, 0.22, 1.6);
    const promptMesh = new THREE.Mesh(promptGeom, matGraphite);
    promptMesh.position.set(0, -1.2, 0);
    addEdges(promptMesh);
    rootGroup.add(promptMesh);

    // Component 2: AI Orchestrator Core (Central crystalline module)
    const aiCoreGeom = new THREE.BoxGeometry(1.2, 0.45, 1.2);
    const aiCoreMesh = new THREE.Mesh(aiCoreGeom, matCore);
    aiCoreMesh.position.set(0, -0.5, 0);
    addEdges(aiCoreMesh);
    rootGroup.add(aiCoreMesh);

    // Component 3: Code Synthesis Layer (Array of code block slats)
    const codeGroup = new THREE.Group();
    for (let i = 0; i < 3; i++) {
      const slatGeom = new THREE.BoxGeometry(0.6, 0.16, 0.9);
      const slat = new THREE.Mesh(slatGeom, matAluminum);
      slat.position.set((i - 1) * 0.75, 0.1, 0);
      addEdges(slat);
      codeGroup.add(slat);
    }
    rootGroup.add(codeGroup);

    // Component 4: Virtual File Tree Rack (Segmented vertical chassis)
    const fileRackGeom = new THREE.BoxGeometry(1.8, 0.24, 1.4);
    const fileRackMesh = new THREE.Mesh(fileRackGeom, matFrosted);
    fileRackMesh.position.set(0, 0.65, 0);
    addEdges(fileRackMesh);
    rootGroup.add(fileRackMesh);

    // Component 5: Sandbox Container & Database (Cylindrical persistence token)
    const dbGeom = new THREE.CylinderGeometry(0.35, 0.35, 0.5, 24);
    const dbMesh = new THREE.Mesh(dbGeom, matAluminum);
    dbMesh.position.set(-0.8, -0.5, 0.7);
    rootGroup.add(dbMesh);

    // Component 6: Finished Live Application Terminal Window (Floating acrylic display)
    const displayGeom = new THREE.BoxGeometry(2.2, 0.18, 1.5);
    const displayMesh = new THREE.Mesh(displayGeom, matAluminum);
    displayMesh.position.set(0, 1.25, 0);
    addEdges(displayMesh);
    rootGroup.add(displayMesh);

    rootGroup.rotation.y = -0.45;
    rootGroup.rotation.x = 0.22;

    // Stage positioning & assembly states
    let targetStageProgress = 0;
    let currentStageProgress = 0;

    let cachedRect: DOMRect | null = null;
    const updateRect = () => {
      if (container) {
        cachedRect = container.getBoundingClientRect();
      }
    };
    updateRect();

    const handleScroll = () => {
      updateRect();
      if (!cachedRect) return;
      const windowHeight = window.innerHeight;
      if (cachedRect.top < windowHeight && cachedRect.bottom > 0) {
        const rawProgress = (windowHeight - cachedRect.top) / (windowHeight + cachedRect.height);
        const clamped = Math.max(0, Math.min(rawProgress, 1));
        targetStageProgress = clamped;
        const stageIndex = Math.min(Math.floor(clamped * STAGES.length), STAGES.length - 1);
        setCurrentStage(stageIndex);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Mouse parallax with cached rect
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handlePointerMove = (e: PointerEvent) => {
      if (!cachedRect) updateRect();
      if (!cachedRect || cachedRect.width === 0 || cachedRect.height === 0) return;
      const x = (e.clientX - cachedRect.left) / cachedRect.width - 0.5;
      const y = (e.clientY - cachedRect.top) / cachedRect.height - 0.5;
      targetMouseX = x * 0.25;
      targetMouseY = y * 0.18;
    };

    const handlePointerLeave = () => {
      targetMouseX = 0;
      targetMouseY = 0;
    };

    container.addEventListener('pointerenter', updateRect, { passive: true });
    container.addEventListener('pointermove', handlePointerMove, { passive: true });
    container.addEventListener('pointerleave', handlePointerLeave, { passive: true });

    // Resize handler
    const handleResize = () => {
      if (!container || !renderer) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      updateRect();
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const render = () => {
      animationFrameId = requestAnimationFrame(render);
      const elapsedTime = clock.getElapsedTime();

      // Mouse damping
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      rootGroup.rotation.y = -0.45 + mouseX + Math.sin(elapsedTime * 0.35) * 0.02;
      rootGroup.rotation.x = 0.22 - mouseY + Math.cos(elapsedTime * 0.28) * 0.015;

      // Smooth scrub between stages
      const activeManual = activeStageManualRef.current;
      const activeProg =
        activeManual !== null
          ? activeManual / (STAGES.length - 1)
          : targetStageProgress;

      currentStageProgress += (activeProg - currentStageProgress) * 0.08;

      // Morph / Assemble based on scrub progress
      aiCoreMesh.rotation.y = elapsedTime * 0.2 + currentStageProgress * Math.PI;
      
      codeGroup.children.forEach((child, i) => {
        const spread = (1 - currentStageProgress) * 0.4;
        child.position.y = 0.1 + (i - 1) * spread;
        child.position.z = Math.sin(elapsedTime + i) * 0.04;
      });

      fileRackMesh.position.y = 0.5 + currentStageProgress * 0.25;

      dbMesh.rotation.y = elapsedTime * 0.3;
      dbMesh.position.x = -0.8 + Math.cos(elapsedTime * 0.5) * 0.03;

      displayMesh.position.y = 1.0 + currentStageProgress * 0.35;

      camera.position.z = 5.8 - currentStageProgress * 0.6;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', handleScroll);
      container.removeEventListener('pointerenter', updateRect);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', handlePointerLeave);
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, [theme]);

  const activeIndex = activeStageManual !== null ? activeStageManual : currentStage;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[400px] md:h-[480px] select-none flex flex-col justify-between overflow-hidden rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-100/40 dark:bg-neutral-900/40"
    >
      <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing" />

      {/* Blueprint Header */}
      <div className="absolute top-4 left-4 pointer-events-none">
        <div className="font-mono-code text-[10px] text-neutral-500 dark:text-neutral-400 tracking-wider uppercase flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 dark:bg-neutral-100" />
          <span>FIG. 02 — DEVFLOW GENERATION ENGINE</span>
        </div>
        <div className="font-mono-code text-[9px] text-neutral-400 dark:text-neutral-600 mt-0.5">
          PROMPT ➔ AGENT ➔ SYNTHESIS ➔ MICRO-VM ➔ PREVIEW
        </div>
      </div>

      {/* Interactive Phase Controller Tabs */}
      <div className="absolute bottom-4 inset-x-4 flex flex-wrap items-center justify-between gap-2 p-2.5 rounded border border-neutral-300 dark:border-neutral-800 bg-neutral-100/90 dark:bg-neutral-950/90 backdrop-blur-md">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {STAGES.map((s, idx) => (
            <button
              key={s.step}
              onClick={() => setActiveStageManual(idx)}
              className={`px-2.5 py-1 text-[10px] font-mono-code rounded tracking-wider transition-colors duration-150 cursor-pointer ${
                activeIndex === idx
                  ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-950 font-semibold'
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-200/60 dark:hover:bg-neutral-900'
              }`}
            >
              {s.step} {s.name.split(' ')[0]}
            </button>
          ))}
        </div>

        <div className="hidden lg:block text-right">
          <span className="font-mono-code text-[10px] text-neutral-400 dark:text-neutral-500">
            {STAGES[activeIndex]?.detail}
          </span>
        </div>
      </div>
    </div>
  );
};
