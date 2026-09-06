export interface ContributionDay {
  date: string;
  contributionCount: number;
  contributionLevel: 'NONE' | 'FIRST_QUARTILE' | 'SECOND_QUARTILE' | 'THIRD_QUARTILE' | 'FOURTH_QUARTILE';
  color?: string;
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface ContributionCalendar {
  totalContributions: number;
  weeks: ContributionWeek[];
}

export interface GitHubRepo {
  name: string;
  description: string | null;
  url: string;
  stargazerCount: number;
  primaryLanguage: {
    name: string;
    color: string;
  } | null;
  updatedAt: string;
}

export interface GitHubProfile {
  name: string;
  login: string;
  bio: string | null;
  avatarUrl: string;
  url: string;
}

export interface GitHubContributionsData {
  profile: GitHubProfile;
  calendar: ContributionCalendar;
  repositories: GitHubRepo[];
}
