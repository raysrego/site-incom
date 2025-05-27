import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import HomePage from './pages/HomePage';
import DoctorsPage from './pages/DoctorsPage';
import SpecialtiesPage from './pages/SpecialtiesPage';
import TreatmentsPage from './pages/TreatmentsPage';
import InsurancePage from './pages/InsurancePage';
import BlogPage from './pages/BlogPage';
import AppointmentPage from './pages/AppointmentPage';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/doctors" element={<DoctorsPage />} />
            <Route path="/specialties" element={<SpecialtiesPage />} />
            <Route path="/treatments" element={<TreatmentsPage />} />
            <Route path="/insurance" element={<InsurancePage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/appointment" element={<AppointmentPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;