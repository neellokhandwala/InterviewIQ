import { useUser } from '@clerk/clerk-react'
import { Route, Routes, Navigate } from 'react-router';
import HomePage from './pages/HomePage';
import ProblemsPage from './pages/ProblemsPage';
import DashboardPage from './pages/DashboardPage';
import ProblemDetailPage from './pages/ProblemDetailPage';
import { Toaster } from 'react-hot-toast';

function App() {
  const { isSignedIn, isLoaded } = useUser();

  // Wait for Clerk to finish loading before rendering routes
  if (!isLoaded) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/problems" element={isSignedIn ? <ProblemsPage /> : <Navigate to="/" />} />
        <Route path="/problems/:id" element={isSignedIn ? <ProblemDetailPage /> : <Navigate to="/" />} />
        <Route path="/dashboard" element={isSignedIn ? <DashboardPage /> : <Navigate to="/" />} />
      </Routes>
      <Toaster toastOptions={{ duration: 3000 }} />
    </>
  );
}

export default App;
