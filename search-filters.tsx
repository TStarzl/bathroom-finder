import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Filters } from './types';

interface SearchFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ filters, onFiltersChange }) => {
  const handleFilterChange = (key: keyof Filters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="sticky top-0 z-10 bg-white shadow-sm p-4 space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search bathrooms..."
            value={filters.searchQuery}
            onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <SlidersHorizontal className="w-4 h-4" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>
                Customize your bathroom search
              </SheetDescription>
            </SheetHeader>
            
            <div className="mt-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="wheelchair" className="flex items-center gap-2">
                    Wheelchair Access
                  </Label>
                  <Switch
                    id="wheelchair"
                    checked={filters.wheelchairAccess}
                    onCheckedChange={(checked) => 
                      handleFilterChange('wheelchairAccess', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="changing" className="flex items-center gap-2">
                    Changing Tables
                  </Label>
                  <Switch
                    id="changing"
                    checked={filters.changingTables}
                    onCheckedChange={(checked) => 
                      handleFilterChange('changingTables', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="gender" className="flex items-center gap-2">
                    Gender Neutral
                  </Label>
                  <Switch
                    id="gender"
                    checked={filters.genderNeutral}
                    onCheckedChange={(checked) => 
                      handleFilterChange('genderNeutral', checked)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Minimum Rating</Label>
                <Slider
                  min={0}
                  max={5}
                  step={0.5}
                  value={[filters.minRating]}
                  onValueChange={([value]) => 
                    handleFilterChange('minRating', value)}
                  className="w-full"
                />
                <div className="text-right text-sm text-gray-500">
                  {filters.minRating} stars
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default SearchFilters;