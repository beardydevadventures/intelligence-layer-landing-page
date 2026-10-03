export interface ProjectMedia { src: string; alt: string; width: number; height: number }
export interface ProjectVideo { src: string; type: string; title: string; embedUrl?: string }
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
// Phase 2: published Sanity content is the portfolio source. Retired work is not an offline fallback.
export const projects: Project[] = [];
