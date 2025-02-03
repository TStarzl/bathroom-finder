import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, push, serverTimestamp } from 'firebase/database';
import { ErrorBoundary } from 'react-error-boundary';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import BathroomCard from './BathroomCard';
import SearchFilters from './SearchFilters';
import { Bathroom, Filters } from './types';

// Initialize Firebase (replace with your config)
const firebaseConfig = {
  // Your Firebase config here
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const ErrorFallback = ({ error, resetErrorBoundary }: any) => {
  return (
    <Alert variant="destructive" className="m-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Something went wrong</AlertTitle>
      <AlertDescription>
        {error.message}
        <Button 
          variant="outline" 
          className="mt-2"
          onClick={resetErrorBoundary}
        >
          Try again
        </Button>
      </AlertDescription>
    </Alert>
  );
};

const BathroomFinder: React.FC = () => {
  const [bathrooms, setBathrooms] = useState<Bathroom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [filters, setFilters] = useState<Filters>({
    wheelchairAccess: false,
    changingTables: false,
    genderNeutral: false,
    minRating: 0,
    searchQuery: '',
  });

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  // Fetch bathrooms from Firebase
  useEffect(() => {
    const bathroomsRef = ref(db, 'bathrooms');
    
    const unsubscribe = onValue(bathroomsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const bathroomArray = Object.entries(data).map(([id, bathroom]: [string, any]) => ({
          id,
          ...bathroom,
          comments: bathroom.comments ? Object.values(bathroom.comments) : [],
        }));

        // Calculate distances if user location is available
        if (userLocation) {
          bathroomArray.forEach(bathroom => {
            bathroom.distance = calculateDistance(
              userLocation.lat,
              userLocation.lng,
              bathroom.lat,
              bathroom.lng
            );
          });
        }

        setBathrooms(bathroomArray);
      }
      setIsLoading(false);
    }, (error) => {
      console.error('Error fetching bathrooms:', error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [userLocation]);

  const handleAddComment = async (bathroomId: string, commentText: string) => {
    const commentsRef = ref(db, `bathrooms/${bathroomId}/comments`);
    await push(commentsRef, {
      id: Date.now().toString(),
      text: commentText,
      createdAt: serverTimestamp(),
      userId: 'anonymous', // Replace with actual user ID when auth is implemented
      userName: 'Anonymous User', // Replace with actual username when auth is implemented
    });
  };

  const filteredBathrooms = bathrooms
    .filter(bathroom => {
      if (filters.wheelchairAccess && !bathroom.hasWheelchairAccess) return false;
      if (filters.changingTables && !bathroom.hasChangingTables) return false;
      if (filters.genderNeutral && !bathroom.isGenderNeutral) return false;
      if (bathroom.rating < filters.minRating) return false;
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        return bathroom.name.toLowerCase().includes(query) ||
               bathroom.description.toLowerCase().includes(query);
      }
      return true;
    })
    .sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Bathroom Finder</h1>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6">
          <SearchFilters 
            filters={filters} 
            onFiltersChange={setFilters} 
          />

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              <span className="ml-2 text-gray-500">Loading bathrooms...</span>
            </div>
          ) : filteredBathrooms.length === 0 ? (
            <Alert className="mt-6">
              <AlertDescription>
                No bathrooms found matching your criteria.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {filteredBathrooms.map(bathroom => (
                <BathroomCard
                  key={bathroom.id}
                  bathroom={bathroom}
                  onAddComment={handleAddComment}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default BathroomFinder;