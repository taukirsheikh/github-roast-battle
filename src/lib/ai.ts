import { GoogleGenerativeAI } from '@google/generative-ai';
import { GitHubUser } from './github';

const genAI = new GoogleGenerativeAI('AIzaSyCJ4Lvv83rgEFFlzeYIek-Er3ROR-dvhhc');

export async function generateRoast(user1: GitHubUser, user2: GitHubUser, isFirstUser: boolean): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  const generationConfig = {
    temperature: 1,
    // topP: 0.95,
    // topK: 40,
    // maxOutputTokens: 8192,
    // responseMimeType: "text/plain",
  };

  const prompt = `
  You are an AI specializing in **hilarious GitHub roast battles**.  
  Your job is to generate a **funny, one-liner roast** for a friendly GitHub showdown.  

  🔥 **Roasting from:** ${isFirstUser ? user1.login : user2.login}  
  🎯 **Target:** ${isFirstUser ? user2.login : user1.login}  

  **👨‍💻 Roaster's GitHub Stats (${isFirstUser ? user1.login : user2.login}):**  
  - 📂 Repositories: ${isFirstUser ? user1.public_repos : user2.public_repos}  
  - ⭐ Followers: ${isFirstUser ? user1.followers : user2.followers}  
  - ✍️ Bio: "${isFirstUser ? user1.bio || "Too cool for a bio" : user2.bio || "Too cool for a bio"}"  
  - 🏗️ Account Created: ${new Date(isFirstUser ? user1.created_at : user2.created_at).toLocaleDateString()}  
  - 📊 Projects: [${isFirstUser ? user1.repos.slice(0, 3).map(repo => repo.name).join(", ") : user2.repos.slice(0, 3).map(repo => repo.name).join(", ")}]  
  - 🔧 Pull Requests: ${isFirstUser ? user1.pull_requests.length : user2.pull_requests.length}  
  - 🍴 Forked Repos: ${isFirstUser ? user1.forked_repos.length : user2.forked_repos.length}  
  - 🐛 Open Issues: ${isFirstUser ? user1.open_issues.length : user2.open_issues.length}  
  - 🌟 Starred Repos: ${isFirstUser ? user1.starred_repos.length : user2.starred_repos.length}  
  - 🕒 Commits Per Day: ${isFirstUser ? user1.commits_per_day : user2.commits_per_day}  

  **🎯 Target's GitHub Stats (${isFirstUser ? user2.login : user1.login}):**  
  - 📂 Repositories: ${isFirstUser ? user2.public_repos : user1.public_repos}  
  - ⭐ Followers: ${isFirstUser ? user2.followers : user1.followers}  
  - ✍️ Bio: "${isFirstUser ? user2.bio || "No bio? No personality?" : user1.bio || "No bio? No personality?"}"   
  - 🏗️ Account Created: ${new Date(isFirstUser ? user2.created_at : user1.created_at).toLocaleDateString()}  
  - 📊 Projects: [${isFirstUser ? user2.repos.slice(0, 3).map(repo => repo.name).join(", ") : user1.repos.slice(0, 3).map(repo => repo.name).join(", ")}]  
  - 🔧 Pull Requests: ${isFirstUser ? user2.pull_requests.length : user1.pull_requests.length}  
  - 🍴 Forked Repos: ${isFirstUser ? user2.forked_repos.length : user1.forked_repos.length}  
  - 🐛 Open Issues: ${isFirstUser ? user2.open_issues.length : user1.open_issues.length}  
  - 🌟 Starred Repos: ${isFirstUser ? user2.starred_repos.length : user1.starred_repos.length}  
  - 🕒 Commits Per Day: ${isFirstUser ? user2.commits_per_day : user1.commits_per_day}  

  Generate a witty, savage, but one-liner roast targeting the opponent's GitHub stats and projects.
  Keep it fun and playful with roast on various topics based on their profile info. Make it sound like a direct conversation between the two, and do not add any generic text like "Okay, here we go!" or "Here’s your roast!" 

  Example Roast:  
  "With that many open issues, you should rename your repo 'Bug Tracker!'"
  
  **Don't use bot-like phrasing.** Make it personal and funny based on the provided details.

  `;

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig
    });
    const response = await result.response;
    console.log('Roast generation response:', response);
    return response.text().trim();
  } catch (error) {
    console.error('Error generating roast:', error);
    return `Hey @${isFirstUser ? user2.login : user1.login}, with ${isFirstUser ? user2.public_repos : user1.public_repos} repos and ${isFirstUser ? user2.followers : user1.followers} followers, you're basically the ghost of GitHub past!`;
  }
}
