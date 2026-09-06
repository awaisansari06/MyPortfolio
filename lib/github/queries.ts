export const GITHUB_CONTRIBUTIONS_QUERY = `
  query Contributions($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      name
      login
      bio
      avatarUrl
      url
      repositories(first: 12, privacy: PUBLIC, orderBy: {field: UPDATED_AT, direction: DESC}, isFork: false) {
        nodes {
          name
          description
          url
          stargazerCount
          primaryLanguage {
            name
            color
          }
          updatedAt
        }
      }
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              contributionLevel
              color
            }
          }
        }
      }
    }
  }
`;
