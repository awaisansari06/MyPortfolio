import { GITHUB_CONTRIBUTIONS_QUERY } from './queries';
import { GitHubContributionsData } from './types';

export async function fetchGitHubContributions(
  username: string = process.env.GITHUB_USERNAME || 'awaisansari06'
): Promise<GitHubContributionsData | null> {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    console.warn('GITHUB_TOKEN is not configured in environment variables.');
    return null;
  }

  try {
    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setFullYear(fromDate.getFullYear() - 1);

    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Awais-Portfolio-NextJS',
      },
      body: JSON.stringify({
        query: GITHUB_CONTRIBUTIONS_QUERY,
        variables: {
          login: username,
          from: fromDate.toISOString(),
          to: toDate.toISOString(),
        },
      }),
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.error(`GitHub API responded with status ${response.status}: ${response.statusText}`);
      return null;
    }

    const json = await response.json();

    if (json.errors || !json.data?.user) {
      console.error('GitHub GraphQL errors:', json.errors);
      return null;
    }

    const userData = json.data.user;
    const calendar = userData.contributionsCollection?.contributionCalendar;

    const pinnedNodes = (userData.pinnedItems?.nodes || []).filter(Boolean);
    const repoNodes = pinnedNodes.length > 0 ? pinnedNodes : (userData.repositories?.nodes || []).filter(Boolean);

    return {
      profile: {
        name: userData.name || username,
        login: userData.login || username,
        bio: userData.bio,
        avatarUrl: userData.avatarUrl,
        url: userData.url || `https://github.com/${username}`,
      },
      calendar: {
        totalContributions: calendar?.totalContributions ?? 0,
        weeks: calendar?.weeks ?? [],
      },
      repositories: repoNodes.map((repo: any) => ({
        name: repo.name,
        description: repo.description,
        url: repo.url,
        stargazerCount: repo.stargazerCount,
        primaryLanguage: repo.primaryLanguage
          ? {
              name: repo.primaryLanguage.name,
              color: repo.primaryLanguage.color,
            }
          : null,
        updatedAt: repo.updatedAt,
      })),
    };
  } catch (error) {
    console.error('Failed to fetch GitHub contributions:', error);
    return null;
  }
}
