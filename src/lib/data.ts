import { templates } from '../data/templates';
import { fetchGitHubStats } from './github';
import { fetchNpmDownloads } from './npm';
import type { Template } from '../types/template';

export interface TemplateWithData extends Template {
  githubStars?: number;
  npmDownloads?: number;
  lastUpdated?: string;
}

export interface HeroStats {
  totalTemplates: number;
  totalStars: number;
  totalDownloads: number;
}

/**
 * Fetch GitHub/npm data for all templates at build time.
 */
export async function fetchTemplatesWithData(): Promise<TemplateWithData[]> {
  return Promise.all(
    templates.map(async (template) => {
      const [githubStats, npmStats] = await Promise.all([
        fetchGitHubStats(template.githubRepo),
        fetchNpmDownloads(template.npmPackage),
      ]);

      return {
        ...template,
        githubStars: githubStats?.stars,
        npmDownloads: npmStats?.downloads,
        lastUpdated: githubStats?.lastUpdated,
      };
    }),
  );
}

/**
 * Calculate aggregate stats for the Hero section.
 */
export function calculateHeroStats(templatesWithData: TemplateWithData[]): HeroStats {
  return {
    totalTemplates: templates.length,
    totalStars: templatesWithData.reduce((sum, t) => sum + (t.githubStars ?? 0), 0),
    totalDownloads: templatesWithData.reduce((sum, t) => sum + (t.npmDownloads ?? 0), 0),
  };
}
