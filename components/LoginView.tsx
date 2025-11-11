
import React, { useState } from 'react';
import { CarIcon } from './Icons';

interface LoginViewProps {
    onLogin: (details: { name: string; email: string; registrationNumber: string; department: string; }) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [registrationNumber, setRegistrationNumber] = useState('');
    const [department, setDepartment] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.toLowerCase().endsWith('.edu')) {
            setError('');
            onLogin({ name, email, registrationNumber, department });
        } else {
            setError('Please use a valid university email address (.edu).');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900">
            <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl">
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <CarIcon className="w-16 h-16 text-primary-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Join CampusPool</h2>
                    <p className="mt-2 text-slate-500 dark:text-slate-400">Your trusted campus ride-sharing community.</p>
                </div>
                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                     <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="relative block w-full px-3 py-3 border border-slate-300 dark:border-slate-600 placeholder-slate-500 text-slate-900 dark:text-white bg-white dark:bg-slate-700 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                        placeholder="Full Name"
                    />
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="relative block w-full px-3 py-3 border border-slate-300 dark:border-slate-600 placeholder-slate-500 text-slate-900 dark:text-white bg-white dark:bg-slate-700 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                        placeholder="your.name@university.edu"
                    />
                    <input
                        id="registrationNumber"
                        name="registrationNumber"
                        type="text"
                        required
                        value={registrationNumber}
                        onChange={(e) => setRegistrationNumber(e.target.value)}
                        className="relative block w-full px-3 py-3 border border-slate-300 dark:border-slate-600 placeholder-slate-500 text-slate-900 dark:text-white bg-white dark:bg-slate-700 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                        placeholder="Registration Number"
                    />
                     <input
                        id="department"
                        name="department"
                        type="text"
                        required
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="relative block w-full px-3 py-3 border border-slate-300 dark:border-slate-600 placeholder-slate-500 text-slate-900 dark:text-white bg-white dark:bg-slate-700 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                        placeholder="Department"
                    />
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <div>
                        <button
                            type="submit"
                            className="group relative flex justify-center w-full py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                            Verify &amp; Get Started
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginView;