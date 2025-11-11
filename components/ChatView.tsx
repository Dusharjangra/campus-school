import React, { useState, useRef, useEffect } from 'react';
import { Conversation, User } from '../types';
import { ArrowLeftIcon, PaperAirplaneIcon } from './Icons';

interface ChatViewProps {
    conversation: Conversation;
    currentUser: User;
    onSendMessage: (text: string) => void;
    onBack: () => void;
}

const ChatView: React.FC<ChatViewProps> = ({ conversation, currentUser, onSendMessage, onBack }) => {
    const [message, setMessage] = useState('');
    // FIX: Cast Object.values to User[] to correctly type `otherUser`.
    const otherUser = (Object.values(conversation.participants) as User[]).find(p => p.id !== currentUser.id);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        scrollToBottom();
    }, [conversation.messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            onSendMessage(message.trim());
            setMessage('');
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-5rem)] md:h-[calc(100vh-5rem)] max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-lg shadow-lg">
            <div className="p-3 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
                <button onClick={onBack} className="md:hidden p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                    <ArrowLeftIcon/>
                </button>
                <img src={otherUser?.avatarUrl} alt={otherUser?.name} className="w-10 h-10 rounded-full" />
                <h2 className="font-bold text-slate-800 dark:text-white">{otherUser?.name}</h2>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {conversation.messages.map((msg) => (
                    <div key={msg.id} className={`flex items-end gap-2 ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                        {msg.senderId !== currentUser.id && (
                             <img src={otherUser?.avatarUrl} alt={otherUser?.name} className="w-8 h-8 rounded-full" />
                        )}
                        <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl ${msg.senderId === currentUser.id ? 'bg-primary-600 text-white rounded-br-none' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none'}`}>
                           <p>{msg.text}</p>
                        </div>
                         {msg.senderId === currentUser.id && (
                             <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-8 h-8 rounded-full" />
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSend} className="p-3 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-primary-500 focus:border-primary-500 rounded-full py-2 px-4"
                />
                <button type="submit" className="bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 disabled:bg-primary-300" disabled={!message.trim()}>
                    <PaperAirplaneIcon />
                </button>
            </form>
        </div>
    );
};

export default ChatView;
