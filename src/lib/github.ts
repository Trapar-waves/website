interface GitHubStats {
  stars: number;
  lastUpdated: string;
}

export async function fetchGitHubStats(repo: string): Promise<GitHubStats | null> {
  try {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'trapar-waves-website',
    };

    const token = typeof process !== 'undefined' ? process.env?.GITHUB_TOKEN : undefined;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`https://api.github.com/repos/Trapar-waves/${repo}`, {
      headers,
    });

    if (!response.ok) {
      console.warn(`Failed to fetch GitHub stats for ${repo}: ${response.status}`);
      return null;
    }

    const data = await response.json();

    return {
      stars: data.stargazers_count,
      lastUpdated: formatRelativeTime(new Date(data.pushed_at)),
    };
  } catch (error) {
    console.warn(`Error fetching GitHub stats for ${repo}:`, error);
    return null;
  }
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
}
