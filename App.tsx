
import React, { useState, useMemo } from 'react';
import { User, Ride, Conversation, View, ChatMessage } from './types';
import LoginView from './components/LoginView';
import Header from './components/Header';
import RideCard from './components/RideCard';
import OfferRideModal from './components/OfferRideModal';
import ChatView from './components/ChatView';
import { PlusIcon } from './components/Icons';

// Mock Data
const MOCK_USERS: User[] = [
    { id: 'u1', name: 'Alex Johnson', avatarUrl: 'https://picsum.photos/seed/alex/100/100', collegeEmail: 'alex.j@university.edu', registrationNumber: 'CB.EN.U4CSE19001', department: 'Computer Science', rating: 4.8, ridesGiven: 15 },
    { id: 'u2', name: 'Brenda Smith', avatarUrl: 'https://picsum.photos/seed/brenda/100/100', collegeEmail: 'brenda.s@university.edu', registrationNumber: 'CB.EN.U4MEC19010', department: 'Mechanical Engineering', rating: 4.9, ridesGiven: 22 },
    { id: 'u3', name: 'Charlie Brown', avatarUrl: 'https://picsum.photos/seed/charlie/100/100', collegeEmail: 'charlie.b@university.edu', registrationNumber: 'CB.EN.U4ECE19020', department: 'Electronics & Communication', rating: 4.5, ridesGiven: 5 },
    { id: 'u4', name: 'Diana Prince', avatarUrl: 'https://picsum.photos/seed/diana/100/100', collegeEmail: 'diana.p@university.edu', registrationNumber: 'CB.EN.U4EEE19030', department: 'Electrical Engineering', rating: 5.0, ridesGiven: 30 },
];

const MOCK_RIDES: Ride[] = [
    { id: 'r1', driver: MOCK_USERS[1], origin: 'Main Campus', destination: 'Downtown', departureTime: new Date(Date.now() + 2 * 60 * 60 * 1000), availableSeats: 2, totalSeats: 4, price: 5, passengers: [MOCK_USERS[2]] },
    { id: 'r2', driver: MOCK_USERS[3], origin: 'North Dorms', destination: 'Airport', departureTime: new Date(Date.now() + 24 * 60 * 60 * 1000), availableSeats: 3, totalSeats: 3, price: 15, passengers: [] },
    { id: 'r3', driver: MOCK_USERS[0], origin: 'Library', destination: 'West Suburbs', departureTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), availableSeats: 1, totalSeats: 2, price: 8, passengers: [] },
];

const MOCK_CONVERSATIONS: Conversation[] = [
    {
        id: 'c1',
        rideId: 'r1',
        participants: { 'u1': MOCK_USERS[0], 'u2': MOCK_USERS[1] },
        messages: [
            { id: 'm1', senderId: 'u1', text: 'Hey, are you still good for the ride tomorrow?', timestamp: new Date(Date.now() - 5 * 60 * 1000) },
            { id: 'm2', senderId: 'u2', text: 'Yep! See you at the library entrance at 2 PM.', timestamp: new Date(Date.now() - 4 * 60 * 1000) },
        ],
    },
];

interface LoginDetails {
    name: string;
    email: string;
    registrationNumber: string;
    department: string;
}

const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [rides, setRides] = useState<Ride[]>(MOCK_RIDES);
    const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
    const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
    const [isOfferModalOpen, setIsOfferModalOpen] = useState<boolean>(false);
    const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);

    const handleLogin = (details: LoginDetails) => {
        const user: User = { 
            id: 'u0', 
            name: details.name, 
            avatarUrl: `https://picsum.photos/seed/${details.name.split(' ').join('')}/100/100`, 
            collegeEmail: details.email, 
            registrationNumber: details.registrationNumber,
            department: details.department,
            rating: 0, 
            ridesGiven: 0 
        };
        setCurrentUser(user);
        setIsAuthenticated(true);
    };

    const handleOfferRide = (newRide: Omit<Ride, 'id' | 'driver' | 'passengers'>) => {
        if (!currentUser) return;
        const ride: Ride = {
            ...newRide,
            id: `r${Date.now()}`,
            driver: currentUser,
            passengers: [],
        };
        setRides(prevRides => [ride, ...prevRides]);
        setIsOfferModalOpen(false);
    };

    const handleStartChat = (ride: Ride) => {
        if (!currentUser) return;
        let conversation = conversations.find(c => c.rideId === ride.id && c.participants[currentUser.id] && c.participants[ride.driver.id]);
        if (!conversation) {
            conversation = {
                id: `c${Date.now()}`,
                rideId: ride.id,
                participants: { [currentUser.id]: currentUser, [ride.driver.id]: ride.driver },
                messages: [],
            };
            setConversations(prev => [...prev, conversation!]);
        }
        setActiveConversation(conversation);
        setCurrentView(View.CHAT);
    };

    const handleSendMessage = (text: string) => {
        if (!currentUser || !activeConversation) return;
        const newMessage: ChatMessage = {
            id: `m${Date.now()}`,
            senderId: currentUser.id,
            text,
            timestamp: new Date(),
        };
        const updatedConversation = {
            ...activeConversation,
            messages: [...activeConversation.messages, newMessage],
        };
        setActiveConversation(updatedConversation);
        setConversations(prev => prev.map(c => c.id === updatedConversation.id ? updatedConversation : c));
    };

    const myRides = useMemo(() => {
        if (!currentUser) return [];
        return rides.filter(ride => ride.driver.id === currentUser.id || ride.passengers.some(p => p.id === currentUser.id));
    }, [rides, currentUser]);

    const renderContent = () => {
        if (activeConversation && currentView === View.CHAT) {
            return <ChatView conversation={activeConversation} currentUser={currentUser!} onSendMessage={handleSendMessage} onBack={() => { setActiveConversation(null); setCurrentView(View.MESSAGES);}} />;
        }

        switch (currentView) {
            case View.DASHBOARD:
                return <RideList rides={rides} onStartChat={handleStartChat} title="Available Rides" />;
            case View.MY_RIDES:
                return <RideList rides={myRides} onStartChat={handleStartChat} title="My Rides" />;
            case View.MESSAGES:
                return <MessageList conversations={conversations.filter(c => c.participants[currentUser!.id])} onSelectConversation={(c) => { setActiveConversation(c); setCurrentView(View.CHAT); }} currentUser={currentUser!} />;
            case View.PROFILE:
                return <ProfileView user={currentUser!} />;
            default:
                return <RideList rides={rides} onStartChat={handleStartChat} title="Available Rides" />;
        }
    };

    if (!isAuthenticated || !currentUser) {
        return <LoginView onLogin={handleLogin} />;
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
            <Header user={currentUser} currentView={currentView} setView={setCurrentView} />
            <main className="container mx-auto p-4 pt-20 pb-24">
                {renderContent()}
            </main>
            {currentView !== View.CHAT && (
              <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-50 dark:from-slate-900 to-transparent flex justify-center">
                  <button
                      onClick={() => setIsOfferModalOpen(true)}
                      className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-transform transform hover:scale-105"
                  >
                      <PlusIcon />
                      Offer a Ride
                  </button>
              </div>
            )}
            {isOfferModalOpen && <OfferRideModal onClose={() => setIsOfferModalOpen(false)} onOfferRide={handleOfferRide} />}
        </div>
    );
};


interface RideListProps {
    rides: Ride[];
    onStartChat: (ride: Ride) => void;
    title: string;
}

const RideList: React.FC<RideListProps> = ({ rides, onStartChat, title }) => (
    <div>
        <h1 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">{title}</h1>
        {rides.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rides.map(ride => (
                    <RideCard key={ride.id} ride={ride} onStartChat={onStartChat} />
                ))}
            </div>
        ) : (
            <div className="text-center py-10 bg-white dark:bg-slate-800 rounded-lg shadow">
                <p className="text-slate-500">No rides found.</p>
            </div>
        )}
    </div>
);


interface MessageListProps {
    conversations: Conversation[];
    onSelectConversation: (conversation: Conversation) => void;
    currentUser: User;
}
const MessageList: React.FC<MessageListProps> = ({ conversations, onSelectConversation, currentUser }) => (
    <div>
        <h1 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Messages</h1>
        <div className="space-y-3">
            {conversations.map(convo => {
                // FIX: Cast Object.values to User[] to correctly type `otherParticipant`.
                const otherParticipant = (Object.values(convo.participants) as User[]).find(p => p.id !== currentUser.id);
                const lastMessage = convo.messages[convo.messages.length - 1];
                return (
                    <div key={convo.id} onClick={() => onSelectConversation(convo)} className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                        <div className="flex items-center gap-4">
                            <img src={otherParticipant?.avatarUrl} alt={otherParticipant?.name} className="w-12 h-12 rounded-full" />
                            <div className="flex-1">
                                <p className="font-bold text-slate-900 dark:text-white">{otherParticipant?.name}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{lastMessage?.text || 'No messages yet'}</p>
                            </div>
                            <span className="text-xs text-slate-400">{lastMessage?.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
);

const ProfileView: React.FC<{ user: User }> = ({ user }) => (
    <div className="max-w-md mx-auto bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
        <div className="flex flex-col items-center">
            <img className="w-24 h-24 rounded-full mb-4 ring-4 ring-primary-300" src={user.avatarUrl} alt={user.name} />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{user.name}</h2>
            <p className="text-slate-500 dark:text-slate-400">{user.collegeEmail}</p>
             <div className="mt-2 text-center text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-2 w-full">
                <p className="font-semibold">{user.department}</p>
                <p className="text-sm">{user.registrationNumber}</p>
            </div>
            <div className="flex items-center mt-4 space-x-1 text-yellow-400">
                <p className="text-lg font-bold text-slate-700 dark:text-slate-300 mr-2">{user.rating > 0 ? user.rating.toFixed(1) : 'New'}</p>
                {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${i < Math.round(user.rating) ? 'text-yellow-400' : 'text-slate-300 dark:text-slate-600'}`} viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>
            <div className="mt-6 w-full text-center">
                <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{user.ridesGiven}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Rides Given</p>
                </div>
            </div>
        </div>
    </div>
);

export default App;