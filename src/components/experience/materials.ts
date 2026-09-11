import * as THREE from 'three';

export function updateLayerMaterials(layers: THREE.Mesh[], colour: string) {
  const target = new THREE.Color(colour);
  layers.forEach((layer, index) => {
    const material = layer.material as THREE.MeshPhysicalMaterial;
    material.color.lerp(target, 0.08);
    material.emissive.copy(target).multiplyScalar(index === 0 ? 0.05 : 0.015);
  });
}
