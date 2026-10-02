import * as THREE from 'three';
import type { WebGPURenderer } from 'three/webgpu';
import { createLayers } from './layer-geometry';
import { updateMarkMaterials } from './materials';
import { sceneStates } from './scene-config';

export class IntelligenceLayerScene {
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  private renderer: THREE.WebGLRenderer | WebGPURenderer;
  private group: THREE.Group;
  private mark: ReturnType<typeof createLayers>;
  private startedAt = performance.now();
  private frame = 0;
  private visible = true;
  private inViewport = true;
  private intersectionObserver: IntersectionObserver;
  private pointer = new THREE.Vector2();
  private state = { ...sceneStates.hero };
  private resizeObserver: ResizeObserver;

  constructor(private canvas: HTMLCanvasElement, renderer?: WebGPURenderer) {
    this.renderer = renderer ?? new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.camera.position.set(0, 0, 12);
    this.mark = createLayers(); this.group = this.mark.group;
    this.group.rotation.set(0, -0.12, 0);
    this.scene.add(this.group);
    this.scene.add(new THREE.HemisphereLight('#ffffff', '#a7b7d8', 2.4));
    const key = new THREE.DirectionalLight('#ffffff', 5); key.position.set(3, 5, 6); this.scene.add(key);
    const rim = new THREE.PointLight('#3f7cff', 18, 16); rim.position.set(-4, -2, 4); this.scene.add(rim);
    this.resizeObserver = new ResizeObserver(() => this.resize()); this.resizeObserver.observe(canvas);
    this.intersectionObserver = new IntersectionObserver(([entry]) => {
      this.inViewport = entry.isIntersecting;
      this.onVisibility();
    });
    this.intersectionObserver.observe(canvas);
    this.bind(); this.resize(); this.animate();
  }

  private bind() {
    window.addEventListener('pointermove', this.onPointer, { passive: true });
    document.addEventListener('visibilitychange', this.onVisibility);
  }

  private onPointer = (event: PointerEvent) => { this.pointer.set((event.clientX / innerWidth - 0.5) * 0.18, (event.clientY / innerHeight - 0.5) * 0.1); };
  private onVisibility = () => { this.visible = !document.hidden && this.inViewport; if (this.visible && !this.frame) this.animate(); };

  private resize() {
    const { width, height } = this.canvas.getBoundingClientRect();
    const aspect = width / Math.max(height, 1);
    // Leave room for the nearer corners as perspective and layer separation change.
    const halfHeight = Math.max(3.4, 2.8 / Math.max(aspect, 0.1));
    this.camera.aspect = aspect;
    this.camera.position.z = halfHeight / Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2)) + 1.6;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  private animate = () => {
    if (!this.visible) { this.frame = 0; return; }
    this.frame = requestAnimationFrame(this.animate);
    const t = (performance.now() - this.startedAt) / 1000;
    this.mark.update(this.state.spread + Math.sin(t * 0.55) * 0.045, t);
    this.group.position.y = Math.sin(t * 0.7) * 0.12;
    this.group.rotation.y += (-0.12 + this.state.rotation + Math.sin(t * 0.28) * 0.08 + this.pointer.x - this.group.rotation.y) * 0.035;
    this.group.rotation.x += (Math.sin(t * 0.35) * 0.025 + this.pointer.y - this.group.rotation.x) * 0.025;
    this.group.rotation.z = Math.sin(t * 0.38) * 0.015;
    this.group.scale.setScalar(this.state.scale * 0.82);
    updateMarkMaterials(this.mark, this.state.accent, t);
    this.renderer.render(this.scene, this.camera);
  };

  destroy() {
    cancelAnimationFrame(this.frame); this.resizeObserver.disconnect(); this.intersectionObserver.disconnect();
    window.removeEventListener('pointermove', this.onPointer); document.removeEventListener('visibilitychange', this.onVisibility);
    this.mark.dispose(); this.renderer.dispose();
  }
}
