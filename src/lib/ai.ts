import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyCJ4Lvv83rgEFFlzeYIek-Er3ROR-dvhhc');

export async function generateRoast(user1: any, user2: any, isFirstUser: boolean): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `
    Create a funny, lighthearted roast from one GitHub user to another. Keep it playful and avoid being mean-spirited.
    
    Roasting from: ${isFirstUser ? user1.login : user2.login}
    Roasting: ${isFirstUser ? user2.login : user1.login}
    
    User data to reference:
    Roaster (${isFirstUser ? user1.login : user2.login}):
    - Repos: ${isFirstUser ? user1.public_repos : user2.public_repos}
    - Followers: ${isFirstUser ? user1.followers : user2.followers}
    - Bio: ${isFirstUser ? user1.bio : user2.bio}
    - Account age: ${isFirstUser ? user1.created_at : user2.created_at}
    
    Target (${isFirstUser ? user2.login : user1.login}):
    - Repos: ${isFirstUser ? user2.public_repos : user1.public_repos}
    - Followers: ${isFirstUser ? user2.followers : user1.followers}
    - Bio: ${isFirstUser ? user2.bio : user1.bio}
    - Account age: ${isFirstUser ? user2.created_at : user1.created_at}
    
    Generate a witty one-liner roast based on their GitHub stats and activity.
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}