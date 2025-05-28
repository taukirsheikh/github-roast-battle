import { useState } from 'react';
import { getGitHubUser, type GitHubUser } from '../lib/github';
import { generateRoast } from '../lib/ai';
import RoastMessage from './RoastMessage';
import InputField from './InputField';
import { Github, Swords } from 'lucide-react';



const MAX_ROASTS = 10;

const Battle = () => {
  const [username1, setUsername1] = useState('');
  const [username2, setUsername2] = useState('');
  const [user1, setUser1] = useState<GitHubUser | null>(null);
  const [user2, setUser2] = useState<GitHubUser | null>(null);
  const [roasts, setRoasts] = useState<{ from: string; message: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function startRoastBattle() {
    try {
      setLoading(true);
      setError('');
      setRoasts([]);
  
      // 🔥 Fetch both users at the same time
      const [fetchedUser1, fetchedUser2] = await Promise.all([
        getGitHubUser(username1),
        getGitHubUser(username2),
      ]);
  
      // ✅ Ensure users are set before generating roasts
      setUser1(fetchedUser1);
      setUser2(fetchedUser2);
  
      // 🕐 Add a small delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 500));
  
      // 🎤 First roast exchange
      const roast1 = await generateRoast(fetchedUser1, fetchedUser2, true);
      setRoasts([{ from: fetchedUser1.login, message: roast1 }]);
  
      // 🕐 Small delay to make it feel more like a conversation
      await new Promise((resolve) => setTimeout(resolve, 1000));
  
      const roast2 = await generateRoast(fetchedUser1, fetchedUser2, false);
      setRoasts((prev) => [
        ...prev,
        { from: fetchedUser2.login, message: roast2 },
      ]);
    } catch (error) {
      setError('Failed to fetch users or generate roasts. Please try again.');
    } finally {
      setLoading(false);
    }
  }
  console.log('user',user1)
  
  async function continueRoastBattle() {
    if (!user1 || !user2 || loading || roasts.length >= MAX_ROASTS) return;
  
    try {
      setLoading(true);
      const isFirstUserNext = roasts.length % 2 === 0;
  
      // 🎤 Generate the next roast in sequence
      const nextRoast = await generateRoast(user1, user2, isFirstUserNext);
  
      setRoasts((prev) => [
        ...prev,
        { from: isFirstUserNext ? user1.login : user2.login, message: nextRoast },
      ]);
  
      // 🕐 Delay to make it feel more like a chat
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      setError('Failed to generate the next roast.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-center gap-4 mb-8">
          <Github size={40} />
          <h1 className="text-4xl font-bold">GitHub Roast Battle</h1>
          <Swords size={40} />
        </div>
      <div className="flex gap-4 mb-8">
        <InputField value={username1} onChange={setUsername1} placeholder="First GitHub Username" />
        <span className="text-2xl font-bold">VS</span>
        <InputField value={username2} onChange={setUsername2} placeholder="Second GitHub Username" />
      </div>

      <button
        onClick={startRoastBattle}
        disabled={loading || !username1 || !username2}
        className="w-full py-3 rounded bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Generating Roasts...' : 'Start Roast Battle!'}
      </button>

      {error && <div className="text-red-400">{error}</div>}

      {user1 && user2 && roasts.length > 0 && (
        <>
          <div className="space-y-8 my-8">
            {roasts.map((roast, index) => (
              <RoastMessage key={index} roast={roast} user1={user1} user2={user2} />
            ))}
          </div>

          {roasts.length < MAX_ROASTS && (
            <button
              onClick={continueRoastBattle}
              disabled={loading}
              className="w-full py-3 rounded bg-green-600 hover:bg-green-700"
            >
              {loading ? 'Generating Next Roast...' : 'Continue Roast Battle'}
            </button>
          )}

          {roasts.length >= MAX_ROASTS && (
            <div className="text-center p-4 bg-gray-800 rounded">
              <p className="text-xl font-bold">🏆 Roast Battle Complete! 🏆</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Battle;
