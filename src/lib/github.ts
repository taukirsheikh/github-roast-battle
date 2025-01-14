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
}

export async function getGitHubUser(username: string): Promise<GitHubUser> {
  try {
    const response = await octokit.rest.users.getByUsername({ username });
    return response.data as GitHubUser;
  } catch (error) {
    throw new Error(`Failed to fetch GitHub user: ${username}`);
  }
}