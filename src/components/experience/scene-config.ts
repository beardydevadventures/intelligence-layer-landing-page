export const sceneStates = {
  hero: { spread: 0.25, depth: 0.1, rotation: 0.35, scale: 1, cameraZ: 7.5, accent: '#1f65ff' },
  layered: { spread: 0.9, depth: 0.4, rotation: 0.65, scale: 1.05, cameraZ: 7.2, accent: '#2770ff' },
  cybersecurity: { spread: 0.42, depth: 0.1, rotation: 1.0, scale: 1.08, cameraZ: 7, accent: '#1247c7' },
  automation: { spread: 0.75, depth: 0.8, rotation: 1.45, scale: 1, cameraZ: 7.5, accent: '#0b86bf' },
  digital: { spread: 0.55, depth: 0.15, rotation: 1.9, scale: 0.95, cameraZ: 7, accent: '#315ad7' },
  spatial: { spread: 1.15, depth: 1.6, rotation: 2.35, scale: 1.08, cameraZ: 8.2, accent: '#4d4ff0' },
  products: { spread: 0.2, depth: 0, rotation: 2.7, scale: 0.72, cameraZ: 8.5, accent: '#6a78a8' },
  process: { spread: 0.06, depth: 0, rotation: 3.05, scale: 0.48, cameraZ: 9, accent: '#4267bf' },
  final: { spread: 0.28, depth: 0.08, rotation: 3.45, scale: 1, cameraZ: 7.3, accent: '#1f65ff' },
} as const;

export type SceneState = keyof typeof sceneStates;
