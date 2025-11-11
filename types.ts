
export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  collegeEmail: string;
  registrationNumber: string;
  department: string;
  rating: number;
  ridesGiven: number;
}

export interface Ride {
  id: string;
  driver: User;
  origin: string;
  destination: string;
  departureTime: Date;
  availableSeats: number;
  totalSeats: number;
  price: number;
  passengers: User[];
}

export interface ChatMessage {
    id: string;
    senderId: string;
    text: string;
    timestamp: Date;
}

export interface Conversation {
    id: string;
    rideId: string;
    participants: { [key: string]: User };
    messages: ChatMessage[];
}

export enum View {
  DASHBOARD,
  MY_RIDES,
  MESSAGES,
  PROFILE,
  CHAT
}