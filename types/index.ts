export interface Event {
  id: string;
  title: string;
  category: 'Coffee' | 'Networking' | 'Music';
  date: string;
  location: string;
  description: string;
  imageUrl: string;
}

export type UserPreference = Event['category'][];
