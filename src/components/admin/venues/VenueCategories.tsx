
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Settings, Plus } from 'lucide-react';

const VenueCategories: React.FC = () => {
  const categories = [
    { name: 'Wedding Hall', count: 45, color: 'bg-pink-100 text-pink-800' },
    { name: 'Conference Room', count: 32, color: 'bg-blue-100 text-blue-800' },
    { name: 'Event Space', count: 28, color: 'bg-purple-100 text-purple-800' },
    { name: 'Restaurant', count: 21, color: 'bg-orange-100 text-orange-800' },
    { name: 'Hotel', count: 15, color: 'bg-green-100 text-green-800' },
    { name: 'Outdoor Venue', count: 12, color: 'bg-teal-100 text-teal-800' },
    { name: 'Corporate Space', count: 8, color: 'bg-gray-100 text-gray-800' },
    { name: 'Cultural Center', count: 5, color: 'bg-indigo-100 text-indigo-800' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Venue Categories</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage venue categories and classifications</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">{category.name}</CardTitle>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Badge className={category.color}>
                  {category.count} venues
                </Badge>
                <div className="text-sm text-gray-500">
                  Active category
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Full category management interface with creation, editing, and deletion capabilities coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default VenueCategories;
