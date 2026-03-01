import { useUser } from '@clerk/clerk-react'
import { Route, Routes, Navigate } from 'react-router';
import HomePage from './pages/HomePage';
import ProblemsPage from './pages/ProblemsPage';
import DashboardPage from './pages/DashboardPage';
import { Toaster } from 'react-hot-toast';

function App() {

  const {isSignedIn}=useUser()

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/problems" element={isSignedIn ? <ProblemsPage /> : <Navigate to={"/"}/>}/>
        <Route path="/dashboard" element={isSignedIn ? <DashboardPage /> : <Navigate to={"/"}/>}/>
      </Routes>
      <Toaster toastOptions={{duration:3000}}/>
    </>
  );
}

export default App
