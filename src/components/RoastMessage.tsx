import React from 'react';
import { GitHubUser } from '../lib/github';

interface RoastMessageProps {
  roast: { from: string; message: string };
  user1: GitHubUser;
  user2: GitHubUser;
}

const RoastMessage: React.FC<RoastMessageProps> = ({ roast, user1, user2 }) => {
  const isFirstUser = roast.from === user1.login;
  return (
    <div className={`flex items-start gap-6 ${!isFirstUser ? 'flex-row-reverse' : ''}`}>
      <img src={isFirstUser ? user1.avatar_url : user2.avatar_url} alt={roast.from} className="w-16 h-16 rounded-full" />
      <div className="flex-1 p-4 rounded bg-gray-800 border border-gray-700">
        <h3 className="font-bold">@{roast.from} says:</h3>
        <p>{roast.message}</p>
      </div>
    </div>
  );
};

export default RoastMessage;
