
import React from 'react';
import { Plus } from 'lucide-react';
import SmartAvatar from '@/components/ui/smart-avatar';
import { useAuth } from '@/contexts/AuthContext';

interface Story {
  id: string;
  name: string;
  avatar?: string;
  isOnline?: boolean;
}

const StoriesSection: React.FC = () => {
  const { user } = useAuth();

  // Mock stories data - in real app this would come from your backend
  const stories: Story[] = [
    { id: '1', name: 'Alice', isOnline: true },
    { id: '2', name: 'Bob', isOnline: false },
    { id: '3', name: 'Carol', isOnline: true },
    { id: '4', name: 'David', isOnline: false },
    { id: '5', name: 'Emma', isOnline: true },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
      <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
        {/* Your Story */}
        <div className="flex flex-col items-center space-y-1 flex-shrink-0">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
              <Plus size={20} className="text-gray-400" />
            </div>
          </div>
          <span className="text-xs text-gray-600 dark:text-gray-400 text-center">Your Story</span>
        </div>

        {/* Stories */}
        {stories.map((story) => (
          <div key={story.id} className="flex flex-col items-center space-y-1 flex-shrink-0">
            <div className="relative">
              <SmartAvatar
                src={story.avatar}
                alt={story.name}
                fallbackText={story.name}
                size="lg"
                className="w-12 h-12 border-2 border-gray-200 dark:border-gray-700"
              />
              {story.isOnline && (
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
              )}
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400 text-center w-12 truncate">
              {story.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoriesSection;
