import * as THREE from 'three';

export function updateMarkMaterials(mark: { plateMaterial: THREE.MeshPhysicalMaterial; edgeMaterial: THREE.MeshStandardMaterial; nodeMaterial: THREE.MeshStandardMaterial }, colour: string, t: number) {
  mark.plateMaterial.color.lerp(new THREE.Color(colour), 0.08);
  const pulse = 0.85 + Math.sin(t * 1.2) * 0.08;
  mark.nodeMaterial.emissiveIntensity = pulse;
  mark.edgeMaterial.emissiveIntensity = pulse * 0.8;
}
