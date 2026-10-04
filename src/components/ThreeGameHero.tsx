import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeGameHeroProps {
  hoveredAction?: 'host' | 'join' | null;
  onSceneClick?: () => void;
  className?: string;
}

export const ThreeGameHero: React.FC<ThreeGameHeroProps> = ({
  hoveredAction = null,
  onSceneClick,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hoveredActionRef = useRef<'host' | 'join' | null>(hoveredAction);

  useEffect(() => {
    hoveredActionRef.current = hoveredAction;
  }, [hoveredAction]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 360;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 1000);
    camera.position.set(0, 0, 24);

    // Mouse & Touch coordinates with lerping inertia
    const targetMouse = { x: 0, y: 0 };
    const currentMouse = { x: 0, y: 0 };
    let shockwavePulse = 0;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      let clientX = 0;
      let clientY = 0;

      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const x = ((clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((clientY - rect.top) / rect.height) * 2 - 1);
      targetMouse.x = Math.max(-1.5, Math.min(1.5, x));
      targetMouse.y = Math.max(-1.5, Math.min(1.5, y));
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    container.addEventListener('touchmove', handlePointerMove, { passive: true });

    // Interactive Shockwave on Click/Tap
    const handleCanvasClick = () => {
      shockwavePulse = 1.0;
      if (onSceneClick) onSceneClick();
    };
    container.addEventListener('click', handleCanvasClick);

    // --- 1. LIGHTING (Cyber Cyan & Electric Purple) ---
    const ambientLight = new THREE.AmbientLight(0x0a0c1a, 2.5);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x06b6d4, 45, 50);
    cyanLight.position.set(12, 8, 10);
    scene.add(cyanLight);

    const purpleLight = new THREE.PointLight(0xa855f7, 45, 50);
    purpleLight.position.set(-12, -6, 10);
    scene.add(purpleLight);

    const topRimLight = new THREE.DirectionalLight(0x3b82f6, 3);
    topRimLight.position.set(0, 15, 8);
    scene.add(topRimLight);

    // --- 2. ROOT GROUP ---
    const heroGroup = new THREE.Group();
    scene.add(heroGroup);

    // --- 3. CENTRAL SUSPECT IDENTITY ARTIFACT ---
    // Outer wireframe dodecahedron
    const outerGeo = new THREE.DodecahedronGeometry(4.2, 0);
    const outerMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.25,
      metalness: 0.85,
      wireframe: true,
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    heroGroup.add(outerMesh);

    // Inner dark reflective core (The Mystery Core)
    const innerGeo = new THREE.IcosahedronGeometry(3.2, 0);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x05070e,
      roughness: 0.1,
      metalness: 0.95,
      flatShading: true,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    heroGroup.add(innerMesh);

    // Glowing Neon Visor / Eye Slits (matching the imposter's piercing eyes)
    const visorGeo = new THREE.BoxGeometry(2.4, 0.45, 3.4);
    const visorMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: false,
    });
    const visorMesh = new THREE.Mesh(visorGeo, visorMat);
    heroGroup.add(visorMesh);

    // Secondary subtle purple visor slit on back
    const backVisorGeo = new THREE.BoxGeometry(2.4, 0.35, 3.4);
    const backVisorMat = new THREE.MeshBasicMaterial({
      color: 0xc084fc,
    });
    const backVisorMesh = new THREE.Mesh(backVisorGeo, backVisorMat);
    backVisorMesh.rotation.y = Math.PI;
    heroGroup.add(backVisorMesh);

    // --- 4. DUAL BROKEN CYBERNETIC ORBITAL RINGS (Matching Imposter Icon) ---
    // Primary segmented neon ring
    const ringGeo1 = new THREE.TorusGeometry(6.6, 0.08, 16, 80);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.75,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 6;
    heroGroup.add(ring1);

    // Secondary tilted purple ring
    const ringGeo2 = new THREE.TorusGeometry(7.8, 0.06, 16, 80);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.65,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.z = Math.PI / 5;
    heroGroup.add(ring2);

    // Shockwave pulse ring (expands on click)
    const pulseGeo = new THREE.RingGeometry(0.1, 0.35, 48);
    const pulseMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    });
    const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
    pulseMesh.rotation.x = Math.PI / 2;
    heroGroup.add(pulseMesh);

    // --- 5. ORBITING SUSPECT SHIELDS / IDENTITY TOKENS ---
    const suspectCount = 4;
    const suspectMeshes: THREE.Mesh[] = [];
    const suspectAngles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];

    for (let i = 0; i < suspectCount; i++) {
      const shieldGeo = new THREE.OctahedronGeometry(0.9, 0);
      const shieldMat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? 0x06b6d4 : 0xa855f7,
        roughness: 0.3,
        metalness: 0.9,
        wireframe: i === 0, // One imposter stands out
      });
      const shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
      heroGroup.add(shieldMesh);
      suspectMeshes.push(shieldMesh);
    }

    // --- 6. FLOATING CYBERNETIC PARTICLES ---
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const cyanColor = new THREE.Color(0x06b6d4);
    const purpleColor = new THREE.Color(0xa855f7);
    const whiteColor = new THREE.Color(0xffffff);

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      const r = 5.5 + Math.random() * 11;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[idx] = r * Math.sin(phi) * Math.cos(theta);
      positions[idx + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[idx + 2] = r * Math.cos(phi);

      const chosenColor = i % 3 === 0 ? cyanColor : i % 3 === 1 ? purpleColor : whiteColor;
      colors[idx] = chosenColor.r;
      colors[idx + 1] = chosenColor.g;
      colors[idx + 2] = chosenColor.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.22,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    heroGroup.add(particles);

    // --- 7. RESIZE LISTENER ---
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // --- 8. ANIMATION LOOP ---
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth mouse lerping
      currentMouse.x += (targetMouse.x - currentMouse.x) * 0.05;
      currentMouse.y += (targetMouse.y - currentMouse.y) * 0.05;

      // Base rotation + interactive tilt
      let speedMult = 1.0;
      if (hoveredActionRef.current === 'host') {
        speedMult = 1.8;
        visorMat.color.setHex(0x38bdf8); // Cyan intensity surge
        cyanLight.intensity = 70;
        purpleLight.intensity = 25;
      } else if (hoveredActionRef.current === 'join') {
        speedMult = 1.8;
        visorMat.color.setHex(0xc084fc); // Purple intensity surge
        cyanLight.intensity = 25;
        purpleLight.intensity = 70;
      } else {
        visorMat.color.setHex(0x38bdf8);
        cyanLight.intensity = 45;
        purpleLight.intensity = 45;
      }

      // Central core rotations
      heroGroup.rotation.y = elapsed * 0.35 * speedMult + currentMouse.x * 0.6;
      heroGroup.rotation.x = Math.sin(elapsed * 0.25) * 0.15 - currentMouse.y * 0.5;

      outerMesh.rotation.y = elapsed * 0.2;
      outerMesh.rotation.z = elapsed * 0.15;

      innerMesh.rotation.y = -elapsed * 0.4;
      innerMesh.rotation.x = elapsed * 0.25;

      // Orbital rings rotation
      ring1.rotation.z = elapsed * 0.5 * speedMult;
      ring2.rotation.z = -elapsed * 0.35 * speedMult;

      // Orbiting suspect shields
      const orbitRadius = 6.2 + Math.sin(elapsed * 1.5) * 0.4;
      suspectMeshes.forEach((mesh, i) => {
        const angle = elapsed * 0.6 * speedMult + suspectAngles[i];
        mesh.position.x = Math.cos(angle) * orbitRadius;
        mesh.position.z = Math.sin(angle) * orbitRadius;
        mesh.position.y = Math.sin(elapsed * 2 + i) * 1.2;

        mesh.rotation.x = elapsed * 1.2;
        mesh.rotation.y = elapsed * 0.8;
      });

      // Swirling particles
      particles.rotation.y = -elapsed * 0.15;
      particles.rotation.x = Math.sin(elapsed * 0.2) * 0.1;

      // Click shockwave expansion
      if (shockwavePulse > 0.01) {
        pulseMesh.scale.set(1 + (1 - shockwavePulse) * 12, 1 + (1 - shockwavePulse) * 12, 1);
        pulseMat.opacity = shockwavePulse * 0.8;
        shockwavePulse -= 0.035;
      } else {
        pulseMat.opacity = 0;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('touchmove', handlePointerMove);
      container.removeEventListener('click', handleCanvasClick);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [onSceneClick]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-square max-w-[340px] sm:max-w-[420px] mx-auto cursor-pointer select-none touch-none ${className}`}
      title="Interactive 3D Suspect Core - Tap or drag to interact"
    />
  );
};
