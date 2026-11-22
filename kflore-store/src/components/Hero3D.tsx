import { useEffect, useRef } from "react";
import * as THREE from "three";

// A slow, ambient generative bloom rendered in WebGL: a ring of layered
// "petal" meshes that gently rotates and breathes, built from primitives
// rather than an imported model so the whole scene ships in this file.
export function Hero3D({ className }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0.4, 9.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    // ---- lighting: warm key + cool rim, tuned to the burgundy/gold palette
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;

    const hemi = new THREE.HemisphereLight(0xf7ecd8, 0x3a1219, 2.1);
    scene.add(hemi);
    const key = new THREE.DirectionalLight(0xfff1d6, 3.2);
    key.position.set(4, 5, 6);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xf5d9c8, 1.6);
    fill.position.set(-3, 2, 4);
    scene.add(fill);
    const rim = new THREE.PointLight(0xd9a4a4, 9, 30, 2);
    rim.position.set(-5, -1, -4);
    scene.add(rim);
    const ambient = new THREE.AmbientLight(0xf3e3cf, 0.6);
    scene.add(ambient);

    const bloomGroup = new THREE.Group();
    scene.add(bloomGroup);

    const petalGeo = new THREE.SphereGeometry(1, 24, 24);
    petalGeo.scale(1, 1.35, 0.42);

    const colors = [0x5a1725, 0x7a2234, 0xb89a62, 0xb98282, 0xf5f0e8];
    const layers = [
      { count: 8, radius: 1.55, tilt: 0.55, scale: 1.05, yOff: 0.35 },
      { count: 10, radius: 1.95, tilt: 0.36, scale: 0.92, yOff: 0.05 },
      { count: 12, radius: 2.35, tilt: 0.18, scale: 0.78, yOff: -0.25 },
      { count: 10, radius: 2.6, tilt: 0.02, scale: 0.6, yOff: -0.55 },
    ];

    const petalMeshes: THREE.Mesh[] = [];

    layers.forEach((layer, layerIdx) => {
      const baseColor = new THREE.Color(colors[layerIdx % colors.length]);
      const mat = new THREE.MeshStandardMaterial({
        color: baseColor,
        emissive: baseColor.clone().multiplyScalar(0.22),
        roughness: 0.5,
        metalness: 0.05,
        side: THREE.DoubleSide,
      });
      for (let i = 0; i < layer.count; i++) {
        const mesh = new THREE.Mesh(petalGeo, mat);
        const angle = (i / layer.count) * Math.PI * 2 + layerIdx * 0.3;
        mesh.position.set(Math.cos(angle) * layer.radius, layer.yOff + Math.sin(angle * 2) * 0.08, Math.sin(angle) * layer.radius);
        mesh.rotation.y = -angle + Math.PI / 2;
        mesh.rotation.x = layer.tilt;
        mesh.scale.setScalar(layer.scale * (0.85 + 0.3 * Math.cos(i)));
        mesh.userData.baseY = mesh.position.y;
        mesh.userData.phase = i + layerIdx * 3.1;
        bloomGroup.add(mesh);
        petalMeshes.push(mesh);
      }
    });

    // soft center core
    const core = new THREE.Mesh(
      new THREE.SphereGeometry(0.55, 32, 32),
      new THREE.MeshStandardMaterial({ color: 0xd9b87b, emissive: 0x4a3312, emissiveIntensity: 0.6, roughness: 0.35, metalness: 0.4 })
    );
    bloomGroup.add(core);

    // ambient particle motes
    const moteCount = 90;
    const motePositions = new Float32Array(moteCount * 3);
    for (let i = 0; i < moteCount; i++) {
      const r = 3.2 + Math.random() * 3.5;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 5;
      motePositions[i * 3] = Math.cos(theta) * r;
      motePositions[i * 3 + 1] = y;
      motePositions[i * 3 + 2] = Math.sin(theta) * r;
    }
    const moteGeo = new THREE.BufferGeometry();
    moteGeo.setAttribute("position", new THREE.BufferAttribute(motePositions, 3));
    const moteMat = new THREE.PointsMaterial({ color: 0xe7d9bd, size: 0.035, transparent: true, opacity: 0.6 });
    const motes = new THREE.Points(moteGeo, moteMat);
    scene.add(motes);

    bloomGroup.rotation.x = 0.28;

    let raf = 0;
    let t = 0;
    const pointer = { x: 0, y: 0 };

    const onPointerMove = (e: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      pointer.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    mount.addEventListener("pointermove", onPointerMove);

    const clock = new THREE.Clock();

    const animate = () => {
      const dt = clock.getDelta();
      t += dt;

      if (!prefersReducedMotion) {
        bloomGroup.rotation.y += dt * 0.12;
        petalMeshes.forEach((m) => {
          m.position.y = m.userData.baseY + Math.sin(t * 0.8 + m.userData.phase) * 0.05;
        });
        motes.rotation.y += dt * 0.03;
      }

      camera.position.x += (pointer.x * 1.1 - camera.position.x) * 0.03;
      camera.position.y += (0.4 - pointer.y * 0.6 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    const resize = () => {
      const { clientWidth, clientHeight } = mount;
      if (!clientWidth || !clientHeight) return;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mount.removeEventListener("pointermove", onPointerMove);
      petalGeo.dispose();
      core.geometry.dispose();
      moteGeo.dispose();
      moteMat.dispose();
      petalMeshes.forEach((m) => (m.material as THREE.Material).dispose());
      (core.material as THREE.Material).dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className={className} aria-hidden="true" />;
}
