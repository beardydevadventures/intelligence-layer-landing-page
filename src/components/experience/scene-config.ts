const resting = { spread: 1, rotation: 0, scale: 1, accent: '#1559ed' };
export const sceneStates = {
  hero: { ...resting },
  layered: { ...resting, spread: 1.12, rotation: 0.035 },
  cybersecurity: { ...resting },
  automation: { ...resting, spread: 1.08, rotation: -0.035 },
  digital: { ...resting },
  spatial: { ...resting, spread: 1.16, rotation: 0.045 },
  products: { ...resting, scale: 0.85 },
  process: { ...resting, scale: 0.8 },
  final: { ...resting },
};
export type SceneState = keyof typeof sceneStates;
