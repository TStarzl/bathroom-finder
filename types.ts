// types.ts
export interface Comment {
  id: string;
  text: string;
  createdAt: string;
  userId: string;
  userName: string;
}

export interface Bathroom {
  id: string;
  name: string;
  lat: number;
  lng: number;
  description: string;
  rating: number;
  ratingCount: number;
  totalRating: number;
  hasWheelchairAccess: boolean;
  hasChangingTables: boolean;
  isGenderNeutral: boolean;
  lastReviewed: string;
  distance?: number;
  comments: Comment[];
}

export interface Filters {
  wheelchairAccess: boolean;
  changingTables: boolean;
  genderNeutral: boolean;
  minRating: number;
  searchQuery: string;
}