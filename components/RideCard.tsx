import React from 'react';
import { Ride } from '../types';
import { ArrowRightIcon, CalendarIcon, UsersIcon, ChatIcon } from './Icons';

interface RideCardProps {
    ride: Ride;
    onStartChat: (ride: Ride) => void;
}

const RideCard: React.FC<RideCardProps> = ({ ride, onStartChat }) => {
    const departureDate = ride.departureTime.toLocaleDateString([], { month: 'short', day: 'numeric' });
    const departureTime = ride.departureTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 flex flex-col justify-between">
            <div>
                <div className="flex items-center mb-3">
                    <img src={ride.driver.avatarUrl} alt={ride.driver.name} className="w-10 h-10 rounded-full mr-3" />
                    <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-100">{ride.driver.name}</p>
                        <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            {ride.driver.rating.toFixed(1)}
                        </div>
                    </div>
                </div>

                <div className="flex items-center text-slate-700 dark:text-slate-300 font-medium my-4">
                    <span className="truncate flex-1 text-right">{ride.origin}</span>
                    <ArrowRightIcon className="mx-2 flex-shrink-0 text-primary-500" />
                    <span className="truncate flex-1">{ride.destination}</span>
                </div>

                <div className="text-sm text-slate-500 dark:text-slate-400 space-y-2">
                    <div className="flex items-center">
                        <CalendarIcon className="mr-2" />
                        <span>{departureDate} at {departureTime}</span>
                    </div>
                    <div className="flex items-center">
                        <UsersIcon className="mr-2" />
                        <span>{ride.availableSeats} of {ride.totalSeats} seats available</span>
                    </div>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <p className="text-xl font-bold text-primary-600 dark:text-primary-400">₹{ride.price}</p>
                <button
                    onClick={() => onStartChat(ride)}
                    className="flex items-center gap-2 text-sm bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 font-medium py-2 px-3 rounded-lg transition-colors"
                >
                    <ChatIcon />
                    <span>Message</span>
                </button>
            </div>
        </div>
    );
};

export default RideCard;