import * as THREE from 'three';
import logoSource from '../../brand/intelligence-layer-mark-flat.svg?raw';

// Read the approved SVG directly so its proportions remain the source of truth.
const polygons = [...logoSource.matchAll(/<polygon points="([^"]+)"/g)]
  .map(match => match[1].split(' ').map(pair => pair.split(',').map(Number))).reverse();
const unit = 0.012;
// The upper diamond corner recedes; the lower corner faces the viewer.
const inclination = -Math.PI / 4;
export const LAYER_COUNT = polygons.length;

export function createLayers() {
  const group = new THREE.Group(); group.name = 'intelligenceLayerMark';
  const layers: THREE.Group[] = [];
  const plateDepth = 0.14;
  // Solid faces write depth so rear connectors and overlapping plates occlude correctly.
  const plateMaterial = new THREE.MeshPhysicalMaterial({ color: '#1559ed', roughness: 0.32, metalness: 0.08, clearcoat: 0.25, clearcoatRoughness: 0.3 });
  const edgeMaterial = new THREE.MeshStandardMaterial({ color: '#54cfff', emissive: '#54cfff', emissiveIntensity: 0.68, roughness: 0.3, metalness: 0 });
  const nodeMaterial = new THREE.MeshStandardMaterial({ color: '#85e2ff', emissive: '#54cfff', emissiveIntensity: 0.85, roughness: 0.18 });
  const geometries: THREE.BufferGeometry[] = [];
  const basePositions = polygons.map(points => (284 - points[1][1]) * unit);
  const radius = 3.5 * unit;
  const cylinder = new THREE.CylinderGeometry(radius, radius, 1, 12);
  const sphere = new THREE.SphereGeometry(9 * unit, 16, 12);
  geometries.push(cylinder, sphere);
  // Layered translucent shells give a halo on both the light and dark page sections.
  // Share geometry/materials and inherit the core's animation and connector transforms.
  const glowMaterials = Array.from({ length: 6 }, (_, i) => new THREE.MeshBasicMaterial({
    color: '#39bfff', transparent: true, opacity: 0.075 * (1 - i / 6),
    depthWrite: false, toneMapped: false,
  }));
  const addGlow = (core: THREE.Mesh, geometry: THREE.BufferGeometry, line: boolean) => {
    glowMaterials.forEach((material, i) => {
      const halo = new THREE.Mesh(geometry, material);
      const scale = 1.25 + i * 0.4;
      halo.scale.set(scale, line ? 1 : scale, scale);
      core.add(halo);
    });
  };
  const segment = (parent: THREE.Group, a: THREE.Vector3, b: THREE.Vector3) => {
    const mesh = new THREE.Mesh(cylinder, edgeMaterial);
    addGlow(mesh, cylinder, true);
    mesh.position.copy(a).add(b).multiplyScalar(0.5);
    mesh.scale.y = a.distanceTo(b);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
    parent.add(mesh); return mesh;
  };
  polygons.forEach((points, i) => {
    const layer = new THREE.Group(); layer.name = ['topLayer', 'middleLayer', 'bottomLayer'][i];
    const shape = new THREE.Shape();
    const vertices = points.map(([x, y]) => new THREE.Vector3((x - 300) * unit, (points[1][1] - y) * unit, 0));
    vertices.forEach((v, index) => index ? shape.lineTo(v.x, v.y / Math.cos(inclination)) : shape.moveTo(v.x, v.y / Math.cos(inclination)));
    shape.closePath();
    // Extrude behind the frame plane, keeping the cyan border on the front surface.
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: plateDepth, bevelEnabled: false }); geometry.translate(0, 0, -plateDepth); geometry.rotateX(inclination); geometries.push(geometry);
    layer.add(new THREE.Mesh(geometry, plateMaterial));
    vertices.forEach(v => v.z = v.y * Math.tan(inclination));
    vertices.forEach((v, j) => segment(layer, v, vertices[(j + 1) % 4]));
    layer.position.y = basePositions[i]; layers.push(layer); group.add(layer);
  });
  const connectors = new THREE.Group(); connectors.name = 'connectors'; group.add(connectors);
  const nodes = new THREE.Group(); nodes.name = 'nodes'; group.add(nodes);
  // Centre structure follows the SVG exactly, including the gap from y=188 to y=284.
  const anchor = (x: number, y: number) => new THREE.Vector3((x - 300) * unit, (284 - y) * unit, x === 300 ? (y < 284 ? 96 : -96) * unit * Math.tan(inclination) : 0);
  const lineSpecs = [...logoSource.matchAll(/<line x1="(\d+)" y1="(\d+)" x2="(\d+)" y2="(\d+)"/g)];
  const links = lineSpecs.map(m => { const a = anchor(+m[1], +m[2]); const b = anchor(+m[3], +m[4]); return { mesh: segment(connectors, a, b), a, b }; });
  const dots = [...logoSource.matchAll(/<circle cx="(\d+)" cy="(\d+)"/g)].map(m => {
    const base = anchor(+m[1], +m[2]); const mesh = new THREE.Mesh(sphere, nodeMaterial); addGlow(mesh, sphere, false); mesh.position.copy(base); nodes.add(mesh); return { mesh, base };
  });
  // Keep all connector endpoints and nodes aligned as layer spacing opens slightly.
  const update = (spread: number, t: number) => {
    const glowPulse = 0.9 + Math.sin(t * 1.2) * 0.1;
    glowMaterials.forEach((material, i) => material.opacity = 0.075 * (1 - i / 6) * glowPulse);
    layers.forEach((layer, i) => layer.position.y = basePositions[i] * spread + Math.sin(t * 0.65 + i * 0.7) * 0.012);
    const project = (base: THREE.Vector3) => {
      const nearest = basePositions.reduce((best, y, i) => Math.abs(y - (base.y - base.z / Math.tan(inclination))) < Math.abs(basePositions[best] - (base.y - base.z / Math.tan(inclination))) ? i : best, 0);
      return base.clone().setY(base.y + layers[nearest].position.y - basePositions[nearest]);
    };
    dots.forEach(({ mesh, base }) => mesh.position.copy(project(base)));
    links.forEach(({ mesh, a, b }) => { const start = project(a), end = project(b); mesh.position.copy(start).add(end).multiplyScalar(0.5); mesh.scale.y = start.distanceTo(end); mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), end.sub(start).normalize()); });
  };
  return { group, layers, plateMaterial, edgeMaterial, nodeMaterial, update, dispose: () => { geometries.forEach(g => g.dispose()); [plateMaterial, edgeMaterial, nodeMaterial, ...glowMaterials].forEach(m => m.dispose()); } };
}
