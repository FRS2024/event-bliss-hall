
import React from 'react';
import { Search } from 'lucide-react';

interface CategorySearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const CategorySearch: React.FC<CategorySearchProps> = ({ 
  searchTerm, 
  onSearchChange 
}) => {
  return (
    <div className="max-w-md mx-auto">
      <div className="relative">
        <Search 
          size={20} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
        />
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="elegant-input pl-10 text-center"
        />
      </div>
    </div>
  );
};

export default CategorySearch;
