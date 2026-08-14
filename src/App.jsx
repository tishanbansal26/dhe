import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import EmployeePortal from './pages/EmployeePortal';
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
import Leads from './pages/admin/Leads';
import SearchResults from './pages/SearchResults';
import ProductBuilder from './pages/ProductBuilder';
import ProductBuilderAI from './pages/ProductBuilderAI';
import ReviewDashboardPage from './pages/ReviewDashboardPage';
import QuoteGenerator from './pages/QuoteGenerator';
import QuoteDetails from './pages/QuoteDetails';
import QuotesHistory from './pages/QuotesHistory';
import { Toaster } from 'react-hot-toast';

// Calculators
import CalculatorHub from './pages/calculators/CalculatorHub';
import LifeCoverCalculator from './pages/calculators/LifeCoverCalculator';
import TermCalculator from './pages/calculators/TermCalculator';
import HealthCoverCalculator from './pages/calculators/HealthCoverCalculator';
import InsuranceGapCalculator from './pages/calculators/InsuranceGapCalculator';
import FamilyHealthCalculator from './pages/calculators/FamilyHealthCalculator';
import SeniorCitizenCalculator from './pages/calculators/SeniorCitizenCalculator';
import RetirementCalculator from './pages/calculators/RetirementCalculator';

// Health & Maternity Calculators
import BMICalculator from './pages/calculators/BMICalculator';
import BMRCalculator from './pages/calculators/BMRCalculator';
import GFRCalculator from './pages/calculators/GFRCalculator';
import OvulationCalculator from './pages/calculators/OvulationCalculator';
import PregnancyCalculator from './pages/calculators/PregnancyCalculator';
import PregnancyCalendar from './pages/calculators/PregnancyCalendar';
import ConceptionDateCalculator from './pages/calculators/ConceptionDateCalculator';
import LMPCalculator from './pages/calculators/LMPCalculator';

import CustomerDashboard from './pages/CustomerDashboard';

export default function App() {
  const hostname = window.location.hostname;
  const isAdminSubdomain = hostname.startsWith('admin.') || hostname.startsWith('portal.');

  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-navy-900 text-slate-50 font-sans relative overflow-x-hidden">
            {isAdminSubdomain && (
              <Helmet>
                <meta name="robots" content="noindex, nofollow" />
              </Helmet>
            )}
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
            {isAdminSubdomain ? (
              // Admin Subdomain Routes
              <>
                <Route 
                  path="/" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminPortal />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/product-builder" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <ProductBuilder />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/product-builder/:id" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <ProductBuilder />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/product-builder" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <ProductBuilder />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/ai-builder" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <ProductBuilderAI />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/ai-builder/review/:id" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <ReviewDashboardPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/product-builder/:id" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <ProductBuilder />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/plan/:id" element={<PlanDetails />} />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<NotFound />} />
              </>
            ) : (
              // Main Domain Routes
              <>
                <Route path="/" element={<Home />} />
                <Route 
                  path="/product-builder" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <ProductBuilder />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/product-builder/:id" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <ProductBuilder />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/product-builder" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <ProductBuilder />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/ai-builder" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <ProductBuilderAI />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/ai-builder/review/:id" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <ReviewDashboardPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/product-builder/:id" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <ProductBuilder />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/category/:type" element={<CategoryList />} />
                <Route path="/plan/:id" element={<PlanDetails />} />
                <Route path="/plan/:planId/quote" element={<QuoteGenerator />} />
                <Route path="/quote-generator" element={<QuoteGenerator />} />
                <Route path="/quotes" element={<QuotesHistory />} />
                <Route path="/quotes/:id" element={<QuoteDetails />} />
                <Route path="/q/:id" element={<QuoteDetails />} />
                <Route 
                  path="/admin/quotes" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <QuotesHistory />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/leads" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <Leads />
                    </ProtectedRoute>
                  } 
                />
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
                
                {/* SEO Calculators */}
                <Route path="/calculators" element={<CalculatorHub />} />
                <Route path="/calculators/life-insurance-cover-calculator" element={<LifeCoverCalculator />} />
                <Route path="/calculators/term-insurance-calculator" element={<TermCalculator />} />
                <Route path="/calculators/health-insurance-cover-calculator" element={<HealthCoverCalculator />} />
                <Route path="/calculators/insurance-gap-calculator" element={<InsuranceGapCalculator />} />
                <Route path="/calculators/family-health-insurance-calculator" element={<FamilyHealthCalculator />} />
                <Route path="/calculators/senior-citizen-health-insurance-calculator" element={<SeniorCitizenCalculator />} />
                <Route path="/calculators/retirement-calculator" element={<RetirementCalculator />} />
                
                {/* Health & Maternity Calculators */}
                <Route path="/calculators/bmi-calculator" element={<BMICalculator />} />
                <Route path="/calculators/bmr-calculator" element={<BMRCalculator />} />
                <Route path="/calculators/gfr-calculator" element={<GFRCalculator />} />
                <Route path="/calculators/ovulation-calculator" element={<OvulationCalculator />} />
                <Route path="/calculators/pregnancy-calculator" element={<PregnancyCalculator />} />
                <Route path="/calculators/pregnancy-calendar" element={<PregnancyCalendar />} />
                <Route path="/calculators/conception-date-calculator" element={<ConceptionDateCalculator />} />
                <Route path="/calculators/lmp-calculator" element={<LMPCalculator />} />
                
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute allowedRoles={['customer']}>
                      <CustomerDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/employee" 
                  element={
                    <ProtectedRoute allowedRoles={['agent', 'staff']}>
                      <EmployeePortal />
                    </ProtectedRoute>
                  } 
                />
                {/* Redirect /admin to the admin subdomain or show 404 */}
                <Route path="/admin" element={<Navigate to={`${window.location.protocol}//portal.${window.location.hostname.replace('www.', '')}`} replace />} />
                <Route path="*" element={<NotFound />} />
              </>
            )}
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
    </HelmetProvider>
  );
}
