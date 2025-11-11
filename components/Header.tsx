
import React from 'react';
import { User, View } from '../types';
import { CarIcon, ChatIcon, UserCircleIcon, ClipboardListIcon } from './Icons';

interface HeaderProps {
    user: User;
    currentView: View;
    setView: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ user, currentView, setView }) => {
    const navItems = [
        { view: View.DASHBOARD, label: 'Rides', icon: <CarIcon /> },
        { view: View.MY_RIDES, label: 'My Trips', icon: <ClipboardListIcon /> },
        { view: View.MESSAGES, label: 'Messages', icon: <ChatIcon /> },
        { view: View.PROFILE, label: 'Profile', icon: <UserCircleIcon /> },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-md z-50">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <CarIcon className="w-8 h-8 text-primary-600" />
                    <span className="text-xl font-bold text-slate-800 dark:text-white">CampusPool</span>
                </div>
                <div className="hidden md:flex items-center gap-4">
                    {navItems.map(item => (
                        <button
                            key={item.view}
                            onClick={() => setView(item.view)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                currentView === item.view
                                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300'
                                    : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                            }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-3">
                     <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full ring-2 ring-primary-300" />
                </div>
            </div>
            {/* Mobile Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex justify-around">
                 {navItems.map(item => (
                    <button
                        key={item.view}
                        onClick={() => setView(item.view)}
                        className={`flex flex-col items-center justify-center w-full py-2 text-xs ${
                            currentView === item.view
                                ? 'text-primary-600 dark:text-primary-400'
                                : 'text-slate-500 dark:text-slate-400'
                        }`}
                    >
                        {React.cloneElement(item.icon, { className: 'w-6 h-6 mb-1' })}
                        {item.label}
                    </button>
                ))}
            </div>
        </header>
    );
};

export default Header;
