import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import UpdatesPage from './pages/UpdatesPage';
import ContactPage from './pages/ContactPage';
import ReportsPage from './pages/ReportsPage';
import './App.css';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
};

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/updates" element={<UpdatesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/reports" element={<ReportsPage />} />
          </Routes>
        </motion.div>
      </div>
    </Router>
  );
};

export default App;