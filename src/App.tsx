import { type ReactNode } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { AuthProvider, useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';
import DoctorsPage from './pages/DoctorsPage';
import SpecialtiesPage from './pages/SpecialtiesPage';
import TreatmentsPage from './pages/TreatmentsPage';
import InsurancePage from './pages/InsurancePage';
import BlogPage from './pages/BlogPage';
import AppointmentPage from './pages/AppointmentPage';
import AuthPage from './pages/AuthPage';
import AdminPage from './pages/AdminPage';
import TelemedicinePage from './pages/TelemedicinePage';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-[#f3f7f6]" />;
  return session ? <>{children}</> : <Navigate to="/acesso" replace />;
}

function PublicLayout() {
  return <div className="flex flex-col min-h-screen"><Header /><main className="flex-grow"><Routes><Route path="/" element={<HomePage />} /><Route path="/doctors" element={<DoctorsPage />} /><Route path="/specialties" element={<SpecialtiesPage />} /><Route path="/treatments" element={<TreatmentsPage />} /><Route path="/insurance" element={<InsurancePage />} /><Route path="/blog" element={<BlogPage />} /><Route path="/appointment" element={<AppointmentPage />} /></Routes></main><Footer /></div>;
}

function AppRoutes() {
  return <Routes><Route path="/acesso" element={<AuthPage />} /><Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} /><Route path="/admin/teleconsulta/:id" element={<ProtectedRoute><TelemedicinePage /></ProtectedRoute>} /><Route path="/*" element={<PublicLayout />} /></Routes>;
}

function App() {
  return <Router><AuthProvider><AppRoutes /></AuthProvider></Router>;
}

export default App;
