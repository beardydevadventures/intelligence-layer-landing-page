export interface ProjectMedia { src: string; alt: string; width: number; height: number }
export interface ProjectVideo { src: string; type: string; title: string }
export interface Project {
  slug: string; title: string; category: string; headline: string; description: string;
  tags: string[]; image?: ProjectMedia; video?: ProjectVideo; poster?: string;
  featured: boolean; technologies: string[]; platform: string[]; note?: string;
  // Attribution is opt-in and requires approval before publication.
  collaborators?: string[];
  showCollaborators?: boolean;
}
// Add genuine project captures here. Media is optional; never substitute fabricated screenshots.
// Include only projects Intelligence Layer helped conceive, direct, develop or deliver.
// Independent work by other studios must not be presented as Intelligence Layer work.
// Collaborator fields remain unset by default and are not rendered automatically.
export const projects: Project[] = [
 { slug: 'diamond-easy', title: 'Diamond Easy', category: 'VR / Meta Quest', headline: 'Crafting, designed for virtual reality.', description: 'A native immersive crafting experience designed for Meta Quest, combining spatial interaction, immersive UI, real-time 3D and VR-native interaction design.', tags: ['VR', 'Meta Quest', 'Unity', 'Interaction Design', 'Spatial UI'], featured: true, technologies: ['Unity'], platform: ['Meta Quest'] },
 { slug: 'ai-digital-twin', title: 'AI Digital Twin', category: 'AI / Conversational Experience', headline: 'A conversation with a real-time 3D avatar.', description: 'A conversational AI experience combining LLMs, voice, knowledge retrieval and an interactive real-time 3D avatar.', tags: ['AI', 'LLM', 'Voice', '3D', 'Web'], featured: true, technologies: ['LLM', 'Voice', 'Knowledge retrieval', 'Real-time 3D'], platform: ['Web'] },
 { slug: 'brisbane-digital-twin', title: 'Brisbane 2032 Digital Twin', category: 'WebXR / Digital Twin', headline: 'Exploring places through a spatial interface.', description: 'An accessible spatial experience concept designed to let people explore locations, stories and immersive content across VR, desktop, mobile and web-connected devices.', tags: ['WebXR', 'Digital Twin', '3D', 'Spatial Computing'], featured: true, technologies: ['WebXR', '3D'], platform: ['Browser', 'Desktop', 'Mobile', 'VR'], note: 'Independent concept. Not officially affiliated with the Brisbane 2032 Olympic or Paralympic Games.' },
];
