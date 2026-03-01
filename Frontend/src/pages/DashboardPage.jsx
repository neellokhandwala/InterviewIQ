import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import Navbar from '../components/Navbar';
import WelcomeSection from '../components/dashboard/WelcomeSection';
import StatsCards from '../components/dashboard/StatsCards';
import LiveSessions from '../components/dashboard/LiveSessions';
import CreateSessionModal from '../components/dashboard/CreateSessionModal';
import PastSessions from '../components/dashboard/PastSessions';

const DashboardPage = () => {
  const { user } = useUser();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeSessions, setActiveSessions] = useState(1);
  const [totalSessions, setTotalSessions] = useState(0);

  useEffect(() => {
    // Mock data - replace with real API calls
    setActiveSessions(Math.floor(Math.random() * 3));
    setTotalSessions(Math.floor(Math.random() * 10) + 1);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Navbar />
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pt-24 pb-12">
        {/* Welcome Section */}
        <WelcomeSection 
          userName={user?.firstName || 'User'} 
          onCreateSession={() => setShowCreateModal(true)}
        />

        {/* Stats Section */}
        <StatsCards activeSessions={activeSessions} totalSessions={totalSessions} />

        {/* Live Sessions Section */}
        <LiveSessions />

        {/* Past Sessions Section */}
        <PastSessions />
      </main>

      {/* Create Session Modal */}
      {showCreateModal && (
        <CreateSessionModal 
          onClose={() => setShowCreateModal(false)}
          onSessionCreated={() => {
            setShowCreateModal(false);
            setActiveSessions(prev => prev + 1);
          }}
        />
      )}
    </div>
  );
};

export default DashboardPage;
