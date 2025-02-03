import React, { useState } from 'react';
import { getDatabase, ref, push } from 'firebase/database';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Loader2, Plus } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const AddBathroomForm: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    lat: '',
    lng: '',
    hasWheelchairAccess: false,
    hasChangingTables: false,
    isGenderNeutral: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const db = getDatabase();
      const bathroomsRef = ref(db, 'bathrooms');

      await push(bathroomsRef, {
        ...formData,
        lat: parseFloat(formData.lat),
        lng: parseFloat(formData.lng),
        rating: 0,
        ratingCount: 0,
        totalRating: 0,
        lastReviewed: new Date().toISOString(),
        comments: [],
      });

      setIsOpen(false);
      setFormData({
        name: '',
        description: '',
        lat: '',
        lng: '',
        hasWheelchairAccess: false,
        hasChangingTables: false,
        isGenderNeutral: false,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg">
          <Plus className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Bathroom</DialogTitle>
          <DialogDescription>
            Add a new bathroom location to help others find it.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g., Central Park Public Restroom"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              required
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Provide details about location, condition, etc."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lat">Latitude</Label>
              <Input
                id="lat"
                type="number"
                step="any"
                required
                value={formData.lat}
                onChange={(e) => handleChange('lat', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lng">Longitude</Label>
              <Input
                id="lng"
                type="number"
                step="any"
                required
                value={formData.lng}
                onChange={(e) => handleChange('lng', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="wheelchair">Wheelchair Access</Label>
              <Switch
                id="wheelchair"
                checked={formData.hasWheelchairAccess}
                onCheckedChange={(checked) => 
                  handleChange('hasWheelchairAccess', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="changing">Changing Tables</Label>
              <Switch
                id="changing"
                checked={formData.hasChangingTables}
                onCheckedChange={(checked) => 
                  handleChange('hasChangingTables', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="gender">Gender Neutral</Label>
              <Switch
                id="gender"
                checked={formData.isGenderNeutral}
                onCheckedChange={(checked) => 
                  handleChange('isGenderNeutral', checked)}
              />
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              'Add Bathroom'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBathroomForm;