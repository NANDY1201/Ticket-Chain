import React, { useState } from 'react';
import { Wallet, Calendar, MapPin, Clock, Users, Star, Shield, TrendingUp, CreditCard, Home, User, Ticket, Settings, LogOut, Plus, Search, Filter, ChevronRight, Music, Trophy, Film, Zap } from 'lucide-react';
import FloatingElement from './components/FloatingElement';
import Card3D from './components/Card3D';
import LoadingSpinner from './components/LoadingSpinner';
import NotificationBanner from './components/NotificationBanner';
import StatsSection from './components/StatsSection';
import LoginPage from './components/LoginPage';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import MobileNav from './components/MobileNav';
import MyTicketsPage from './components/MyTicketsPage';
import EventsPage from './components/EventsPage';
import CreateEventPage from './components/CreateEventPage';

// Mock Web3 functions (in real app, these would connect to actual blockchain)
const mockWeb3 = {
  connectWallet: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          address: '0x742d35Cc6e3472374ea5E2bF1234567890AbCdEf',
          balance: '2.45 ETH'
        });
      }, 1500);
    });
  },
  
  mintTicket: (eventData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          tokenId: Math.floor(Math.random() * 10000),
          transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
          gasUsed: '0.002 ETH'
        });
      }, 2000);
    });
  },
  
  purchaseTicket: (ticketData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          tokenId: ticketData.id,
          transactionHash: '0x' + Math.random().toString(16).substr(2, 64)
        });
      }, 2500);
    });
  }
};

// ...existing code...

// Main App Component
const TicketChainApp = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [userTickets, setUserTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock events data
  const [events] = useState([
    {
      id: 1,
      title: "Cosmic Beats Festival",
      artist: "DJ Stellar & Friends",
      date: "2025-09-15",
      time: "18:00",
      venue: "Galaxy Arena",
      location: "Mumbai, India",
      price: "0.05 ETH",
      image: "🎵",
      category: "music",
      available: 250,
      total: 500,
      rating: 4.8
    },
    {
      id: 2,
      title: "Champions League Final",
      artist: "UEFA",
      date: "2025-10-12",
      time: "20:00",
      venue: "Stadium of Dreams",
      location: "Chennai, India",
      price: "0.08 ETH",
      image: "🏆",
      category: "sports",
      available: 15000,
      total: 50000,
      rating: 4.9
    },
    {
      id: 3,
      title: "Marvel Movie Premiere",
      artist: "Marvel Studios",
      date: "2025-09-28",
      time: "19:30",
      venue: "Cinema Deluxe",
      location: "Bangalore, India",
      price: "0.02 ETH",
      image: "🎬",
      category: "movies",
      available: 180,
      total: 300,
      rating: 4.7
    },
    {
      id: 4,
      title: "Tech Innovation Summit",
      artist: "TechCorp Global",
      date: "2025-11-05",
      time: "09:00",
      venue: "Convention Center",
      location: "Delhi, India",
      price: "0.03 ETH",
      image: "⚡",
      category: "tech",
      available: 800,
      total: 1000,
      rating: 4.6
    }
  ]);

  // Connect Wallet Function
  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      const walletData = await mockWeb3.connectWallet();
      setWallet(walletData);
      if (!user) {
        setUser({
          name: "Crypto Enthusiast",
          email: "user@web3.com",
          avatar: "🌟"
        });
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  // Purchase Ticket Function
  const purchaseTicket = async (event) => {
    if (!wallet) {
      alert('Please connect your wallet first!');
      return;
    }

    try {
      const result = await mockWeb3.purchaseTicket(event);
      if (result.success) {
        const newTicket = {
          ...event,
          tokenId: result.tokenId,
          purchaseDate: new Date().toISOString(),
          transactionHash: result.transactionHash
        };
        setUserTickets(prev => [...prev, newTicket]);
        alert('Ticket purchased successfully! 🎉');
      }
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('Purchase failed. Please try again.');
    }
  };

  // ...existing code...

  // Main render logic
  if (!user && currentPage !== 'home') {
    return <LoginPage setUser={setUser} setCurrentPage={setCurrentPage} connectWallet={connectWallet} isConnecting={isConnecting} />;
  }

  return (
    <div className="min-h-screen bg-white">
      {user && <NotificationBanner />}
      {user && <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} wallet={wallet} connectWallet={connectWallet} setWallet={setWallet} Wallet={Wallet} />}
      <main className="pb-16 md:pb-0">
        {currentPage === 'home' && !user && <LoginPage setUser={setUser} setCurrentPage={setCurrentPage} connectWallet={connectWallet} isConnecting={isConnecting} />}
        {currentPage === 'home' && user && <><HomePage setCurrentPage={setCurrentPage} /><StatsSection /></>}
        {currentPage === 'events' && <EventsPage events={events} searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} purchaseTicket={purchaseTicket} />}
        {currentPage === 'my-tickets' && <MyTicketsPage userTickets={userTickets} setCurrentPage={setCurrentPage} />}
        {currentPage === 'create' && <CreateEventPage wallet={wallet} mockWeb3={mockWeb3} />}
      </main>
      {user && <MobileNav currentPage={currentPage} setCurrentPage={setCurrentPage} navItems={[{ id: 'home', icon: Home }, { id: 'events', icon: Calendar }, { id: 'my-tickets', icon: Ticket }, { id: 'create', icon: Plus }]} />}
      {/* Floating Action Button for Quick Actions */}
      {user && (
        <div className="fixed bottom-20 right-6 md:bottom-6 z-40">
          <FloatingElement delay={2}>
            <button
              onClick={() => setCurrentPage('create')}
              className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all transform hover:scale-110"
            >
              <Plus size={24} />
            </button>
          </FloatingElement>
        </div>
      )}
    </div>
  );
};

export default TicketChainApp;