
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flag } from 'lucide-react';

const FlaggedVenues: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Flagged Venues</h1>
        <p className="text-gray-600 dark:text-gray-400">Review venues that have been reported or flagged</p>
      </div>
      
      <Card>
        <CardContent className="p-12 text-center">
          <Flag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Flagged Venues
          </h3>
          <p className="text-gray-600">
            All venues are in good standing. This interface will show venues that have been reported for review.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FlaggedVenues;
