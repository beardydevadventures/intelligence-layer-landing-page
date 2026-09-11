import * as THREE from 'three';
import type { WebGPURenderer } from 'three/webgpu';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createLayers } from './layer-geometry';
import { updateLayerMaterials } from './materials';
import { sceneStates, type SceneState } from './scene-config';

export class IntelligenceLayerScene {
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
  private renderer: THREE.WebGLRenderer | WebGPURenderer;
  private group: THREE.Group;
  private layers: THREE.Mesh[];
  private geometry: THREE.BufferGeometry;
  private frame = 0;
  private visible = true;
  private cameraFit = 1;
  private pointer = new THREE.Vector2();
  private state = { ...sceneStates.hero };
  private resizeObserver: ResizeObserver;

  constructor(private canvas: HTMLCanvasElement, renderer?: WebGPURenderer) {
    this.renderer = renderer ?? new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.camera.position.set(0, 0, this.state.cameraZ);
    ({ group: this.group, layers: this.layers, geometry: this.geometry } = createLayers());
    this.scene.add(this.group);
    this.scene.add(new THREE.HemisphereLight('#ffffff', '#a7b7d8', 2.4));
    const key = new THREE.DirectionalLight('#ffffff', 5); key.position.set(3, 5, 6); this.scene.add(key);
    const rim = new THREE.PointLight('#3f7cff', 18, 16); rim.position.set(-4, -2, 4); this.scene.add(rim);
    this.resizeObserver = new ResizeObserver(() => this.resize()); this.resizeObserver.observe(canvas);
    this.bind(); this.resize(); this.animate();
  }

  private bind() {
    gsap.registerPlugin(ScrollTrigger);
    document.querySelectorAll<HTMLElement>('[data-scene]').forEach((section) => {
      const state = section.dataset.scene as SceneState;
      ScrollTrigger.create({ trigger: section, start: 'top 62%', end: 'bottom 38%', onEnter: () => this.transition(state), onEnterBack: () => this.transition(state) });
    });
    window.addEventListener('pointermove', this.onPointer, { passive: true });
    document.addEventListener('visibilitychange', this.onVisibility);
  }

  private onPointer = (event: PointerEvent) => { this.pointer.set((event.clientX / innerWidth - 0.5) * 0.16, (event.clientY / innerHeight - 0.5) * 0.12); };
  private onVisibility = () => { this.visible = !document.hidden; if (this.visible && !this.frame) this.animate(); };
  private transition(name: SceneState) { gsap.to(this.state, { ...sceneStates[name], duration: 1.45, ease: 'power3.inOut' }); }

  private resize() {
    const { width, height } = this.canvas.getBoundingClientRect();
    this.camera.aspect = width / Math.max(height, 1); this.camera.updateProjectionMatrix();
    // The desktop scene intentionally lives in a tall, narrow half-viewport.
    // Pull the camera back as that surface narrows so the complete layer remains visible.
    this.cameraFit = Math.max(1, 0.98 / this.camera.aspect);
    this.renderer.setSize(width, height, false);
  }

  private animate = () => {
    if (!this.visible) { this.frame = 0; return; }
    this.frame = requestAnimationFrame(this.animate);
    const t = performance.now() * 0.00022;
    this.layers.forEach((layer, i) => {
      const offset = i - (this.layers.length - 1) / 2;
      layer.position.y = offset * this.state.spread;
      layer.position.z = Math.sin(i * 1.25 + this.state.rotation) * this.state.depth;
      layer.rotation.z = offset * 0.035 * this.state.depth;
    });
    this.group.rotation.y += (this.state.rotation + this.pointer.x - this.group.rotation.y) * 0.035;
    this.group.rotation.x += (this.pointer.y + Math.sin(t) * 0.025 - this.group.rotation.x) * 0.025;
    this.group.scale.setScalar(this.state.scale);
    this.camera.position.z += (this.state.cameraZ * this.cameraFit - this.camera.position.z) * 0.04;
    updateLayerMaterials(this.layers, this.state.accent);
    this.renderer.render(this.scene, this.camera);
  };

  destroy() {
    cancelAnimationFrame(this.frame); this.resizeObserver.disconnect(); ScrollTrigger.getAll().forEach((t) => t.kill());
    window.removeEventListener('pointermove', this.onPointer); document.removeEventListener('visibilitychange', this.onVisibility);
    this.layers.forEach((l) => (l.material as THREE.Material).dispose()); this.geometry.dispose(); this.renderer.dispose();
  }
}
