import * as THREE from 'three';

export const LAYER_COUNT = 5;

export function createLayers() {
  const group = new THREE.Group();
  const layers: THREE.Mesh[] = [];
  const shape = new THREE.Shape();
  shape.moveTo(0, 1.55); shape.lineTo(2.35, 0); shape.lineTo(0, -1.55); shape.lineTo(-2.35, 0); shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: 0.055, bevelEnabled: true, bevelSize: 0.035, bevelThickness: 0.025, bevelSegments: 2 });
  geometry.center();
  for (let i = 0; i < LAYER_COUNT; i++) {
    const material = new THREE.MeshPhysicalMaterial({ color: new THREE.Color('#1f65ff'), roughness: 0.2, metalness: 0.08, transmission: i < 2 ? 0.12 : 0, transparent: true, opacity: 0.9 - i * 0.08, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = Math.PI / 2.55;
    mesh.userData.index = i;
    layers.push(mesh); group.add(mesh);
  }
  return { group, layers, geometry };
}
