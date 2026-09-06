'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '@/context/ThemeContext';

export const SmartJourneyScene = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      35,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 3.2, 5.0);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);

    const isDark = theme === 'dark';

    // Ambient and Directional Light
    const ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 0.9 : 1.3);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, isDark ? 2.0 : 2.5);
    keyLight.position.set(4, 7, 4);
    scene.add(keyLight);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Abstract Terrain Grid with subtle elevation waves
    const terrainSize = 5.2;
    const segments = 28;
    const terrainGeom = new THREE.PlaneGeometry(terrainSize, terrainSize, segments, segments);
    terrainGeom.rotateX(-Math.PI / 2);

    // Apply gentle topographic undulations
    const posAttr = terrainGeom.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);
      const elevation =
        Math.sin(x * 1.2) * Math.cos(z * 1.1) * 0.22 +
        Math.sin(x * 2.5 + z) * 0.08;
      posAttr.setY(i, elevation - 0.3);
    }
    terrainGeom.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x141414 : 0xf2f0eb,
      roughness: 0.8,
      metalness: 0.1,
      wireframe: false,
    });
    const terrainMesh = new THREE.Mesh(terrainGeom, terrainMat);
    rootGroup.add(terrainMesh);

    // Wireframe grid lines on top of terrain for architectural topography
    const wireMat = new THREE.LineBasicMaterial({
      color: isDark ? 0x2e2e2e : 0xd8d6cf,
      transparent: true,
      opacity: 0.6,
    });
    const wireGeom = new THREE.WireframeGeometry(terrainGeom);
    const wireMesh = new THREE.LineSegments(wireGeom, wireMat);
    rootGroup.add(wireMesh);

    // Waypoints along journey
    const waypoints: [number, number, number][] = [
      [-1.8, -0.1, 1.4],
      [-0.8, 0.15, 0.4],
      [0.2, 0.05, -0.3],
      [1.1, 0.25, 0.5],
      [1.8, 0.0, -1.2],
    ];

    const waypointMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0xf5f3ef : 0x111111,
      roughness: 0.2,
      metalness: 0.8,
    });

    const waypointGeom = new THREE.SphereGeometry(0.07, 16, 16);
    waypoints.forEach((p, idx) => {
      const pin = new THREE.Mesh(waypointGeom, waypointMat);
      pin.position.set(...p);
      rootGroup.add(pin);

      // Delicate vertical coordinate altitude line
      const lineGeom = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(p[0], -0.3, p[2]),
        new THREE.Vector3(p[0], p[1], p[2]),
      ]);
      const pinLine = new THREE.Line(
        lineGeom,
        new THREE.LineBasicMaterial({
          color: isDark ? 0x737373 : 0x888888,
          transparent: true,
          opacity: 0.5,
        })
      );
      rootGroup.add(pinLine);
    });

    // Spline Curve connecting the waypoints (The Journey Route)
    const curvePoints = waypoints.map((p) => new THREE.Vector3(...p));
    const curve = new THREE.CatmullRomCurve3(curvePoints);
    const curveGeom = new THREE.TubeGeometry(curve, 64, 0.022, 8, false);
    const curveMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0xd4d4d4 : 0x333333,
      metalness: 0.9,
      roughness: 0.2,
    });
    const curveMesh = new THREE.Mesh(curveGeom, curveMat);
    rootGroup.add(curveMesh);

    // Mouse tilt with cached bounding box
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    let cachedRect: DOMRect | null = null;
    const updateRect = () => {
      if (container) {
        cachedRect = container.getBoundingClientRect();
      }
    };
    updateRect();

    const handlePointerMove = (e: PointerEvent) => {
      if (!cachedRect) updateRect();
      if (!cachedRect || cachedRect.width === 0 || cachedRect.height === 0) return;
      targetMouseX = ((e.clientX - cachedRect.left) / cachedRect.width - 0.5) * 0.22;
      targetMouseY = ((e.clientY - cachedRect.top) / cachedRect.height - 0.5) * 0.15;
    };

    const handlePointerLeave = () => {
      targetMouseX = 0;
      targetMouseY = 0;
    };

    container.addEventListener('pointerenter', updateRect, { passive: true });
    container.addEventListener('pointermove', handlePointerMove, { passive: true });
    container.addEventListener('pointerleave', handlePointerLeave, { passive: true });

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

      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      rootGroup.rotation.y = 0.15 + mouseX + Math.sin(elapsedTime * 0.25) * 0.03;
      rootGroup.rotation.x = -0.1 - mouseY + Math.cos(elapsedTime * 0.2) * 0.02;

      renderer.render(scene, camera);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('pointerenter', updateRect);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', handlePointerLeave);
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, [theme]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[360px] md:h-[420px] select-none overflow-hidden rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-100/40 dark:bg-neutral-900/40 flex items-center justify-center"
    >
      <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing" />
      <div className="absolute top-4 left-4 pointer-events-none">
        <div className="font-mono-code text-[10px] text-neutral-500 dark:text-neutral-400 tracking-wider uppercase flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 dark:bg-neutral-100" />
          <span>SMARTJOURNEY — INTERACTIVE TRAVEL CANVAS</span>
        </div>
        <div className="font-mono-code text-[9px] text-neutral-400 dark:text-neutral-600 mt-0.5">
          DESTINATION · ITINERARY · PLACES · HOTELS · ROUTE
        </div>
      </div>
    </div>
  );
};
