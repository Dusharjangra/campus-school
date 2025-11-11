import React, { useState } from 'react';
import { Ride } from '../types';
import { XIcon } from './Icons';

interface OfferRideModalProps {
    onClose: () => void;
    onOfferRide: (ride: Omit<Ride, 'id' | 'driver' | 'passengers'>) => void;
}

const OfferRideModal: React.FC<OfferRideModalProps> = ({ onClose, onOfferRide }) => {
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [departureDate, setDepartureDate] = useState('');
    const [departureTime, setDepartureTime] = useState('');
    const [totalSeats, setTotalSeats] = useState(3);
    const [price, setPrice] = useState(10);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const departureDateTime = new Date(`${departureDate}T${departureTime}`);
        onOfferRide({
            origin,
            destination,
            departureTime: departureDateTime,
            totalSeats,
            availableSeats: totalSeats,
            price,
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <h2 className="text-lg font-bold">Offer a Ride</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                        <XIcon />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <input type="text" placeholder="Origin" value={origin} onChange={e => setOrigin(e.target.value)} required className="w-full p-2 border rounded bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600" />
                    <input type="text" placeholder="Destination" value={destination} onChange={e => setDestination(e.target.value)} required className="w-full p-2 border rounded bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600" />
                    <div className="flex gap-4">
                        <input type="date" value={departureDate} onChange={e => setDepartureDate(e.target.value)} required className="w-full p-2 border rounded bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600" />
                        <input type="time" value={departureTime} onChange={e => setDepartureTime(e.target.value)} required className="w-full p-2 border rounded bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600" />
                    </div>
                    <div className="flex items-center gap-4">
                        <label className="text-sm">Seats:</label>
                        <input type="number" min="1" max="8" value={totalSeats} onChange={e => setTotalSeats(parseInt(e.target.value, 10))} required className="w-20 p-2 border rounded bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600" />
                        <label className="text-sm">Price (₹):</label>
                        <input type="number" min="0" value={price} onChange={e => setPrice(parseInt(e.target.value, 10))} required className="w-20 p-2 border rounded bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600" />
                    </div>
                    <div className="pt-2 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="py-2 px-4 rounded-md bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-500">Cancel</button>
                        <button type="submit" className="py-2 px-4 rounded-md bg-primary-600 text-white hover:bg-primary-700">Post Ride</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OfferRideModal;