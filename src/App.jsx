import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AgentPortal from './pages/AgentPortal';
import Login from './pages/Login';
import PlanDetails from './pages/PlanDetails';
import CategoryList from './pages/CategoryList';
import ComparePlans from './pages/ComparePlans';
import AdminPortal from './pages/AdminPortal';
import FileClaim from './pages/claims/FileClaim';
import ExistingClaim from './pages/claims/ExistingClaim';
import ClaimInfo from './pages/claims/ClaimInfo';
import TrackClaim from './pages/claims/TrackClaim';
import CashlessNetwork from './pages/claims/CashlessNetwork';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './pages/NotFound';
import { AuthProvider } from './lib/AuthContext';
import Signup from './pages/Signup';
import ResetPassword from './pages/ResetPassword';
import Footer from './components/Footer';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookiePolicy from './pages/CookiePolicy';
import SearchResults from './pages/SearchResults';
import { Toaster } from 'react-hot-toast';

import CustomerDashboard from './pages/CustomerDashboard';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#020617] text-slate-50 font-sans relative overflow-x-hidden">
          <Toaster position="bottom-right" toastOptions={{
            style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' },
            success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }} />
          {/* Background Effects */}
          <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-teal-600/20 blur-[120px]"></div>
            <div className="absolute top-[40%] right-[-10%] w-[30%] h-[50%] rounded-full bg-blue-600/10 blur-[100px]"></div>
          </div>

          <Navbar />
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:type" element={<CategoryList />} />
            <Route path="/plan/:id" element={<PlanDetails />} />
            <Route path="/compare" element={<ComparePlans />} />
            <Route path="/claims/new" element={<FileClaim />} />
            <Route path="/claims/existing" element={<ExistingClaim />} />
            <Route path="/claims/info" element={<ClaimInfo />} />
            <Route path="/claims/track" element={<TrackClaim />} />
            <Route path="/claims/cashless" element={<CashlessNetwork />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/cookies" element={<CookiePolicy />} />
            <Route path="/search" element={<SearchResults />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <CustomerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/agents" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'agent']}>
                  <AgentPortal />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminPortal />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
