export interface User {
  id: string;
  name?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  age?: number;
  gender?: 'male' | 'female';
  nationality?: string;
  countryOfBirth?: string;
  departureCity?: string;
  avatar?: string;
  bio?: string;
  preferences: {
    travelStyle: 'cultural' | 'adventure' | 'relaxation' | 'spiritual' | 'mixed';
    budgetRange: 'budget' | 'moderate' | 'luxury';
    notifications: boolean;
    inspirations: boolean;
  };
  joinedDate: string;
}

export interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  country: string;
  city: string;
  type: 'tourist' | 'historical' | 'natural' | 'spiritual' | 'other';
}

export interface Trip {
  id: string;
  title: string;
  description: string;
  destination: string;
  country: string;
  startDate: string;
  endDate: string;
  coverImage?: string;
  locations: Location[];
  budget: {
    total: number;
    spent: number;
    currency: string;
    breakdown: {
      transport: number;
      accommodation: number;
      food: number;
      activities: number;
      other: number;
    };
  };
  status: 'planning' | 'upcoming' | 'ongoing' | 'completed';
  isPublic: boolean;
  travelers: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Media {
  id: string;
  uri: string;
  type: 'photo' | 'video';
  tripId: string;
  locationId?: string;
  caption?: string;
  takenAt: string;
  isDronePhoto: boolean;
  isPublic: boolean;
  likes: number;
  comments: Comment[];
  tags: string[];
  editedWith?: string[];
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  createdAt: string;
}

export interface ChecklistItem {
  id: string;
  tripId: string;
  title: string;
  description?: string;
  category: 'documents' | 'health' | 'packing' | 'booking' | 'preparation' | 'other';
  completed: boolean;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  reminder?: string;
}

export interface Expense {
  id: string;
  tripId: string;
  title: string;
  amount: number;
  currency: string;
  category: 'transport' | 'accommodation' | 'food' | 'activities' | 'shopping' | 'other';
  date: string;
  notes?: string;
  receipt?: string;
}

export interface TransportOption {
  id: string;
  type: 'flight' | 'train' | 'bus' | 'car' | 'boat';
  provider: string;
  departure: {
    location: string;
    time: string;
    date: string;
  };
  arrival: {
    location: string;
    time: string;
    date: string;
  };
  duration: string;
  price: number;
  currency: string;
  comfort: 1 | 2 | 3 | 4 | 5;
  bookingUrl?: string;
  stops?: number;
  class?: string;
  carbonFootprint?: number;
  accessibility?: boolean;
}

export interface Accommodation {
  id: string;
  name: string;
  type: 'hotel' | 'hostel' | 'airbnb' | 'guesthouse' | 'apartment';
  rating: number;
  pricePerNight: number;
  currency: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  amenities: string[];
  images: string[];
  bookingUrl?: string;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  category: 'cultural' | 'spiritual' | 'adventure' | 'food' | 'nature' | 'shopping' | 'entertainment' | 'religious';
  price: number;
  currency: string;
  duration: string;
  rating: number;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  images: string[];
  openingHours?: string;
  bookingRequired: boolean;
  bestTimeToVisit?: string;
}

export interface BibleVerse {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  version: 'LSG' | 'NBS' | 'TOB' | 'BDS';
}

export interface BibleBook {
  name: string;
  chapters: number;
  testament: 'old' | 'new';
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  coverArt?: string;
  audioUrl: string;
  category: 'worship' | 'gospel' | 'contemporary' | 'traditional' | 'instrumental';
  isDownloaded: boolean;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  coverArt?: string;
  tracks: MusicTrack[];
  isPublic: boolean;
  createdAt: string;
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  media?: Media[];
  tripId?: string;
  locationId?: string;
  likes: number;
  comments: Comment[];
  shares: number;
  hashtags: string[];
  isPublic: boolean;
  createdAt: string;
}

export interface SavedPlace {
  id: string;
  location: Location;
  notes: string;
  visitedDate?: string;
  rating?: number;
  photos: string[];
  recommendations: string;
  isPublic: boolean;
  sharedWith: string[];
  createdAt: string;
}

export interface TravelJournal {
  id: string;
  tripId: string;
  title: string;
  content: string;
  date: string;
  media: Media[];
  location?: Location;
  mood?: 'happy' | 'excited' | 'peaceful' | 'grateful' | 'adventurous';
  isPublic: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: 'reminder' | 'deal' | 'social' | 'system';
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: string;
}

export interface Photo {
  id: string;
  uri: string;
  tripId: string;
  locationId?: string;
  caption?: string;
  takenAt: string;
  isDronePhoto: boolean;
}

export interface SpiritualContent {
  id: string;
  type: 'verse' | 'meditation' | 'prayer';
  title: string;
  content: string;
  reference?: string;
  date: string;
}

export interface VisaRequirement {
  country: string;
  required: boolean;
  type?: string;
  duration?: string;
  cost?: number;
  processingTime?: string;
  requirements?: string[];
}

export interface HealthInfo {
  country: string;
  vaccinations: {
    name: string;
    required: boolean;
    recommended: boolean;
    description: string;
  }[];
  healthRisks?: string[];
  medicalInsurance: boolean;
  emergencyNumbers: {
    police: string;
    medical: string;
    fire: string;
  };
}

export interface WeatherForecast {
  date: string;
  temperature: {
    min: number;
    max: number;
  };
  condition: string;
  humidity: number;
  precipitation: number;
  windSpeed: number;
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export interface TravelPlan {
  id: string;
  destination: string;
  country: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: {
    total: number;
    transport: number;
    accommodation: number;
    activities: number;
    food: number;
    other: number;
  };
  transportOptions: TransportOption[];
  accommodations: Accommodation[];
  activities: Activity[];
  visaInfo: VisaRequirement;
  healthInfo: HealthInfo;
  weather: WeatherForecast[];
  checklist: ChecklistItem[];
  localInfo: {
    currency: string;
    language: string;
    timezone: string;
    emergencyNumbers: {
      police: string;
      medical: string;
      fire: string;
    };
    usefulPhrases: {
      phrase: string;
      translation: string;
    }[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface SearchFilters {
  transportTypes: ('flight' | 'train' | 'bus' | 'car' | 'boat' | 'walk')[];
  sortBy: 'price' | 'duration' | 'comfort' | 'carbon' | 'departure';
  sortOrder: 'asc' | 'desc';
  maxPrice?: number;
  maxDuration?: number;
  minComfort?: number;
  maxStops?: number;
  accessibility?: boolean;
}
