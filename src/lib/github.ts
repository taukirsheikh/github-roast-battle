import { Octokit } from 'octokit';
const octokit = new Octokit();
export interface GitHubUser {
  login: string;
  name: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  avatar_url: string;
  repos: any[];
  pull_requests: any[];
  forked_repos: any[];
  open_issues: any[];
  starred_repos: any[];
  commits_per_day: number;
}
export async function getGitHubUser(username: string): Promise<GitHubUser> {
  try {
    const response = await octokit.rest.users.getByUsername({ username });
    const reposResponse = await octokit.rest.repos.listForUser({ username });
    
    // Get the first non-fork repository
    const firstRepo = reposResponse.data.find(repo => !repo.fork);
    
    let pullRequests: any = [];
    let issues: any = [];
    
    if (firstRepo) {
      try {
        const [pullRequestsResponse, issuesResponse] = await Promise.all([
          octokit.rest.pulls.list({
            owner: username,
            repo: firstRepo.name,
          }),
          octokit.rest.issues.listForRepo({
            owner: username,
            repo: firstRepo.name,
          })
        ]);
        
        pullRequests = pullRequestsResponse.data;
        issues = issuesResponse.data;
      } catch (error) {
        console.warn('Error fetching PR/issues data:', error);
      }
    }
    const commitsPerDay = await calculateCommitsPerDay(username);
    const userData: GitHubUser = {
      ...response.data,
      repos: reposResponse.data,
      pull_requests: pullRequests,
      forked_repos: reposResponse.data.filter((repo) => repo.fork),
      open_issues: issues,
      starred_repos: reposResponse.data.filter((repo) => (repo.stargazers_count ?? 0) > 0),
      commits_per_day: commitsPerDay
    };
    console.log('Fetched GitHub user data:', userData);
    return userData;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw new Error(`Failed to fetch GitHub user: ${username}`);
  }
}
async function calculateCommitsPerDay(username: string): Promise<number> {
  try {
    const response = await octokit.rest.activity.listPublicEventsForUser({ username });
    const commits = response.data.filter(event => event.type === "PushEvent");
    const commitDays = commits.reduce((acc, commit) => {
      const commitDate = commit.created_at ? new Date(commit.created_at).toLocaleDateString() : '';
      acc[commitDate] = (acc[commitDate] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const totalCommits = commits.length;
    const uniqueDays = Object.keys(commitDays).length;
    return uniqueDays > 0 ? totalCommits / uniqueDays : 0;
  } catch (error) {
    console.warn('Error calculating commits per day:', error);
    return 0;
  }
}