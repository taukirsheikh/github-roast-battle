import React, { useState } from 'react';
import { Github, Swords } from 'lucide-react';
import { getGitHubUser, type GitHubUser } from './lib/github';
import { generateRoast } from './lib/ai';

function App() {
  const [username1, setUsername1] = useState('');
  const [username2, setUsername2] = useState('');
  const [user1, setUser1] = useState<GitHubUser | null>(null);
  const [user2, setUser2] = useState<GitHubUser | null>(null);
  const [roasts, setRoasts] = useState<Array<{ from: string; message: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function startRoastBattle() {
    try {
      setLoading(true);
      setError('');
      setRoasts([]);

      const [fetchedUser1, fetchedUser2] = await Promise.all([
        getGitHubUser(username1),
        getGitHubUser(username2)
      ]);

      setUser1(fetchedUser1);
      setUser2(fetchedUser2);

      // Generate initial roasts
      const [roast1, roast2] = await Promise.all([
        generateRoast(fetchedUser1, fetchedUser2, true),
        generateRoast(fetchedUser1, fetchedUser2, false)
      ]);

      setRoasts([
        { from: fetchedUser1.login, message: roast1 },
        { from: fetchedUser2.login, message: roast2 }
      ]);
    } catch (err) {
      setError('Failed to fetch users or generate roasts. Please check the usernames and try again.');
    } finally {
      setLoading(false);
    }
  }

  async function continueRoastBattle() {
    if (!user1 || !user2 || loading || roasts.length >= 10) return;

    try {
      setLoading(true);
      const isFirstUserNext = roasts.length % 2 === 0;
      const nextRoast = await generateRoast(user1, user2, isFirstUserNext);
      
      setRoasts(prev => [
        ...prev,
        { 
          from: isFirstUserNext ? user1.login : user2.login,
          message: nextRoast
        }
      ]);
    } catch (err) {
      setError('Failed to generate the next roast. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-4 mb-8">
          <Github size={40} />
          <h1 className="text-4xl font-bold">GitHub Roast Battle</h1>
          <Swords size={40} />
        </div>

        <div className="flex gap-4 mb-8">
          <input
            type="text"
            placeholder="First GitHub Username"
            value={username1}
            onChange={(e) => setUsername1(e.target.value)}
            className="flex-1 px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500"
          />
          <span className="text-2xl font-bold">VS</span>
          <input
            type="text"
            placeholder="Second GitHub Username"
            value={username2}
            onChange={(e) => setUsername2(e.target.value)}
            className="flex-1 px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500"
          />
        </div>

        <button
          onClick={startRoastBattle}
          disabled={loading || !username1 || !username2}
          className="w-full py-3 rounded bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-8"
        >
          {loading ? 'Generating Roasts...' : 'Start Roast Battle!'}
        </button>

        {error && (
          <div className="p-4 mb-8 rounded bg-red-900/50 border border-red-700 text-red-200">
            {error}
          </div>
        )}

        {user1 && user2 && roasts.length > 0 && (
          <>
            <div className="space-y-8 mb-8">
              {roasts.map((roast, index) => {
                const isFirstUser = roast.from === user1.login;
                return (
                  <div key={index} className={`flex items-start gap-6 ${!isFirstUser ? 'flex-row-reverse' : ''}`}>
                    <img 
                      src={isFirstUser ? user1.avatar_url : user2.avatar_url} 
                      alt={roast.from} 
                      className="w-16 h-16 rounded-full"
                    />
                    <div className="flex-1 p-4 rounded bg-gray-800 border border-gray-700">
                      <h3 className="font-bold mb-2">@{roast.from} says:</h3>
                      <p className="text-gray-300">{roast.message}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {roasts.length < 10 && (
              <button
                onClick={continueRoastBattle}
                disabled={loading}
                className="w-full py-3 rounded bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Generating Next Roast...' : 'Continue Roast Battle'}
              </button>
            )}

            {roasts.length >= 10 && (
              <div className="text-center p-4 bg-gray-800 rounded">
                <p className="text-xl font-bold">🏆 Roast Battle Complete! 🏆</p>
                <p className="text-gray-300 mt-2">Maximum number of roasts reached</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;