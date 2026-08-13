export interface Template {
  id: string;
  name: string;
  packageName: string;
  description: string;
  descriptionZh: string;
  category: 'react' | '3d' | 'vue' | 'cli' | 'llm';
  techStack: string[];
  githubRepo: string;
  npmPackage: string;
  githubStars?: number;
  npmDownloads?: number;
  lastUpdated?: string;
}
