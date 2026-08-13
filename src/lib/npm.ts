interface NpmStats {
  downloads: number;
}

export async function fetchNpmDownloads(packageName: string): Promise<NpmStats | null> {
  try {
    const response = await fetch(
      `https://api.npmjs.org/downloads/point/last-month/${encodeURIComponent(packageName)}`,
      {
        headers: {
          'User-Agent': 'trapar-waves-website',
        },
      }
    );

    if (!response.ok) {
      console.warn(`Failed to fetch npm stats for ${packageName}: ${response.status}`);
      return null;
    }

    const data = await response.json();

    return {
      downloads: data.downloads,
    };
  } catch (error) {
    console.warn(`Error fetching npm stats for ${packageName}:`, error);
    return null;
  }
}
