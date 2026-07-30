"use client";

import { Suspense, useRef, useState, useEffect, useCallback } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { useGLTF, OrbitControls, Environment, Html, useProgress } from "@react-three/drei";
import { motion } from "framer-motion";
import { ParticleBackground } from "@/components/cinematic/ParticleBackground";
import * as THREE from "three";

/* ─── Loading Screen ─── */
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="w-16 h-16 relative">
          <svg className="animate-spin" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="rgba(0,212,255,0.2)" strokeWidth="2" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <p className="text-accent text-sm font-mono">{Math.round(progress)}%</p>
        <p className="text-gray-500 text-xs">Memuat model 3D...</p>
      </div>
    </Html>
  );
}

/* ─── The 3D Building Model (Optimized) ─── */
function BuildingModel({ url, wireframe }: { url: string; wireframe: boolean }) {
  const { scene } = useGLTF(url);
  const groupRef = useRef<THREE.Group>(null);

  // Optimize model on load: merge geometries where possible, reduce material complexity
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        // Enable frustum culling
        mesh.frustumCulled = true;
        
        // Optimize geometry
        if (mesh.geometry) {
          mesh.geometry.computeBoundingSphere();
          mesh.geometry.computeBoundingBox();
        }

        // Apply wireframe and optimize materials
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((mat) => {
            const stdMat = mat as THREE.MeshStandardMaterial;
            stdMat.wireframe = wireframe;
            // Reduce material complexity for performance
            stdMat.envMapIntensity = 0.3;
            stdMat.roughness = Math.max(stdMat.roughness, 0.4);
          });
        } else {
          const stdMat = mesh.material as THREE.MeshStandardMaterial;
          stdMat.wireframe = wireframe;
          stdMat.envMapIntensity = 0.3;
          stdMat.roughness = Math.max(stdMat.roughness, 0.4);
        }
      }
    });
  }, [scene, wireframe]);

  return (
    <group ref={groupRef}>
      <primitive object={scene} dispose={null} />
    </group>
  );
}

/* ─── Camera Controller with Smooth Animation ─── */
function CameraController({ 
  controlsRef, 
  targetView, 
  onReady 
}: { 
  controlsRef: React.RefObject<any>; 
  targetView: { azimuth: number; polar: number; distance: number } | null;
  onReady: () => void;
}) {
  const { camera, scene } = useThree();
  const initialized = useRef(false);
  const animating = useRef(false);

  // Auto-fit camera on first load
  useEffect(() => {
    if (initialized.current) return;
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    
    if (size.length() === 0) return; // Model not loaded yet
    
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = (camera as THREE.PerspectiveCamera).fov * (Math.PI / 180);
    const dist = Math.abs(maxDim / Math.sin(fov / 2)) * 0.6;
    
    camera.position.set(center.x + dist * 0.6, center.y + dist * 0.4, center.z + dist * 0.8);
    camera.lookAt(center);
    camera.updateProjectionMatrix();
    
    if (controlsRef.current) {
      controlsRef.current.target.copy(center);
      controlsRef.current.update();
    }
    
    initialized.current = true;
    onReady();
  }, [scene, camera, controlsRef, onReady]);

  // Animate to hotspot view with smooth LERP
  useEffect(() => {
    if (!targetView || !controlsRef.current || !initialized.current) return;
    if (animating.current) return;
    
    animating.current = true;
    const controls = controlsRef.current;
    
    const startAzimuth = controls.getAzimuthalAngle();
    const startPolar = controls.getPolarAngle();
    const startDistance = controls.getDistance();
    
    const targetAzimuth = targetView.azimuth;
    const targetPolar = targetView.polar;
    const targetDistance = targetView.distance;
    
    const duration = 800; // ms
    const startTime = performance.now();
    
    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      
      const currentAzimuth = startAzimuth + (targetAzimuth - startAzimuth) * eased;
      const currentPolar = startPolar + (targetPolar - startPolar) * eased;
      const currentDistance = startDistance + (targetDistance - startDistance) * eased;
      
      controls.setAzimuthalAngle(currentAzimuth);
      controls.setPolarAngle(currentPolar);
      
      // Set distance by adjusting camera position
      const direction = new THREE.Vector3().subVectors(camera.position, controls.target).normalize();
      camera.position.copy(controls.target).addScaledVector(direction, currentDistance);
      
      controls.update();
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        animating.current = false;
      }
    };
    
    requestAnimationFrame(animate);
  }, [targetView, controlsRef, camera]);

  return null;
}

/* ─── Hotspot views ─── */
const hotspots = [
  { id: "full",      label: "Eksterior Keseluruhan", icon: "🏢", desc: "Tampak keseluruhan bangunan kantor 2 lantai." },
  { id: "front",     label: "Tampak Depan",          icon: "👁️", desc: "Fasad utama dan pintu masuk utama bangunan." },
  { id: "roof",      label: "Tampak Atas / Atap",    icon: "🛰️", desc: "Rangka atap baja ringan dengan genteng metal." },
  { id: "side",      label: "Tampak Samping",        icon: "📐", desc: "Sisi lateral bangunan, potongan struktur." },
  { id: "interior",  label: "Area Dalam",            icon: "🏛️", desc: "Ruang pelayanan publik dan ruang kantor." },
];

// Camera positions for each hotspot view (azimuth, polar in radians, distance multiplier)
const hotspotCameras: Record<string, { azimuth: number; polar: number; distance: number }> = {
  full:     { azimuth: 0.8,    polar: 1.1,   distance: 80 },
  front:    { azimuth: 0,      polar: 1.3,   distance: 60 },
  roof:     { azimuth: 0.3,    polar: 0.3,   distance: 100 },
  side:     { azimuth: Math.PI / 2, polar: 1.2, distance: 70 },
  interior: { azimuth: Math.PI,     polar: 1.4, distance: 30 },
};

/* ─── Main Page ─── */
export default function Visualisasi3DPage() {
  const [activeHotspot, setActiveHotspot] = useState(hotspots[0]);
  const [wireframe, setWireframe] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [modelError, setModelError] = useState(false);
  const [targetView, setTargetView] = useState<{ azimuth: number; polar: number; distance: number } | null>(null);
  const controlsRef = useRef<any>(null);

  const handleModelReady = useCallback(() => {
    setModelLoaded(true);
  }, []);

  const goToHotspot = (hotspot: typeof hotspots[0]) => {
    setActiveHotspot(hotspot);
    const cam = hotspotCameras[hotspot.id];
    if (cam) {
      setTargetView({ ...cam }); // Trigger smooth camera animation
    }
  };

  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ParticleBackground particleCount={50} showGrid showGlowOrb />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background" />
        </div>
        <div className="relative z-10 text-center px-4">
          <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-xs text-accent tracking-[0.3em] uppercase font-medium">3D Model</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}
            className="font-[family-name:var(--font-display)] text-4xl md:text-5xl lg:text-6xl font-bold mt-3">
            Visualisasi 3D
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            className="text-text-secondary mt-4 max-w-lg mx-auto">
            Model interaktif Kantor Kecamatan Pahandut — drag untuk rotate, scroll untuk zoom
          </motion.p>
        </div>
      </section>

      {/* 3D Viewer Section */}
      <section className="py-10 md:py-16">
        <div className="section-container">
          <div className="grid lg:grid-cols-4 gap-6">

            {/* Viewer Canvas */}
            <div className="lg:col-span-3">
              <div className="rounded-2xl border border-border-subtle bg-[#060a10] overflow-hidden">
                {/* Toolbar */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle bg-bg-tertiary/50">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${modelLoaded ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
                    <span className="text-xs text-text-secondary font-mono">
                      {modelLoaded ? "Model Loaded — WebGL" : modelError ? "Error memuat model" : "Loading model..."}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setWireframe(!wireframe)}
                      className={`px-3 py-1 rounded-lg text-xs border transition-all ${wireframe
                        ? "bg-accent/10 border-accent/30 text-accent"
                        : "border-border-subtle text-text-secondary hover:border-accent/20"}`}
                    >
                      {wireframe ? "⬡ Wireframe ON" : "⬡ Wireframe"}
                    </button>
                    <button
                      onClick={() => { if (controlsRef.current) { controlsRef.current.reset(); } }}
                      className="px-3 py-1 rounded-lg text-xs border border-border-subtle text-text-secondary hover:border-accent/20 transition-all"
                    >
                      ↻ Reset View
                    </button>
                  </div>
                </div>

                {/* Canvas */}
                <div className="h-[560px] w-full">
                  {modelError ? (
                    <div className="h-full flex items-center justify-center text-center p-8">
                      <div>
                        <div className="text-5xl mb-4">⚠️</div>
                        <h3 className="font-bold text-lg mb-2">Gagal memuat model 3D</h3>
                        <p className="text-text-muted text-sm max-w-sm mx-auto">
                          File model belum tersedia di server. Pastikan file sudah di-deploy ke Vercel.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <Canvas
                      shadows={false}
                      camera={{ fov: 45, near: 0.1, far: 5000 }}
                      gl={{
                        antialias: false,
                        toneMapping: THREE.ACESFilmicToneMapping,
                        powerPreference: "high-performance",
                        stencil: false,
                        depth: true,
                      }}
                      dpr={[0.75, 1.25]}
                      performance={{ min: 0.5 }}
                      onCreated={({ gl }) => {
                        gl.toneMappingExposure = 1.2;
                        gl.shadowMap.enabled = false;
                        gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
                      }}
                    >
                      <Suspense fallback={<Loader />}>
                        {/* Lighting — simplified for performance */}
                        <ambientLight intensity={0.8} />
                        <directionalLight position={[10, 20, 10]} intensity={1.2} />
                        <directionalLight position={[-10, 10, -5]} intensity={0.3} color="#7b5cff" />

                        {/* Environment — use lightweight preset */}
                        <Environment preset="city" />

                        {/* Model */}
                        <BuildingModel
                          url="/models/building.glb"
                          wireframe={wireframe}
                        />

                        {/* Camera Controller */}
                        <CameraController
                          controlsRef={controlsRef}
                          targetView={targetView}
                          onReady={handleModelReady}
                        />

                        {/* Controls */}
                        <OrbitControls
                          ref={controlsRef}
                          enablePan
                          enableZoom
                          enableRotate
                          minDistance={2}
                          maxDistance={500}
                          maxPolarAngle={Math.PI / 1.5}
                          dampingFactor={0.08}
                          enableDamping
                        />
                      </Suspense>
                    </Canvas>
                  )}
                </div>

                {/* Bottom info bar */}
                <div className="px-4 py-2 border-t border-border-subtle bg-bg-tertiary/30 flex items-center justify-between">
                  <p className="text-[10px] text-text-muted font-mono">
                    Drag: Rotate · Scroll: Zoom · Right-drag: Pan
                  </p>
                  <p className="text-[10px] text-text-muted">
                    Kantor Kecamatan Pahandut · SketchUp → GLB
                  </p>
                </div>
              </div>
            </div>

            {/* Side Panel */}
            <div className="lg:col-span-1 space-y-3">
              <h3 className="font-[family-name:var(--font-display)] text-xs font-semibold tracking-widest uppercase text-text-secondary mb-4">
                Sudut Pandang
              </h3>

              {hotspots.map((hotspot) => (
                <button
                  key={hotspot.id}
                  onClick={() => goToHotspot(hotspot)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                    activeHotspot.id === hotspot.id
                      ? "border-accent/30 bg-accent/5"
                      : "border-border-subtle hover:border-accent/20 bg-bg-card/50"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{hotspot.icon}</span>
                    <h4 className={`text-sm font-medium transition-colors ${activeHotspot.id === hotspot.id ? "text-accent" : ""}`}>
                      {hotspot.label}
                    </h4>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">{hotspot.desc}</p>
                </button>
              ))}

              {/* Controls info */}
              <div className="mt-4 p-4 rounded-xl border border-border-subtle bg-bg-card/30 space-y-2">
                <h4 className="text-xs font-semibold text-text-secondary mb-3">Kontrol</h4>
                {[
                  { icon: "🖱️", key: "Drag Kiri", action: "Rotate" },
                  { icon: "⬆️", key: "Scroll", action: "Zoom" },
                  { icon: "✋", key: "Drag Kanan", action: "Pan" },
                ].map((c) => (
                  <div key={c.key} className="flex items-center justify-between text-xs">
                    <span className="text-text-muted">{c.icon} {c.key}</span>
                    <span className="text-accent font-mono text-[10px]">{c.action}</span>
                  </div>
                ))}
              </div>


            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
