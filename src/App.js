import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import AffectationsPage from './pages/AffectationsPage';
import ApprobationsPage from './pages/ApprobationsPage';
import MesDemandesPage from './pages/MesDemandesPage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import SallesManagementPage from './pages/SallesManagementPage';
import SmartRecommendationsPage from './pages/SmartRecommendationsPage';
import NotFoundPage from './pages/NotFoundPage';
import './utils/testIntelligentSystem'; // Load test functions globally
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Routes publiques */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            
            {/* Routes protégées avec Layout */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout>
                    <HomePage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/affectations"
              element={
                <ProtectedRoute>
                  <Layout>
                    <AffectationsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/approbations"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Layout>
                    <ApprobationsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/mes-demandes"
              element={
                <ProtectedRoute>
                  <Layout>
                    <MesDemandesPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/profil"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ProfilePage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/modifier-profil"
              element={
                <ProtectedRoute>
                  <Layout>
                    <EditProfilePage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/salles"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Layout>
                    <SallesManagementPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/smart-recommendations"
              element={
                <ProtectedRoute>
                  <Layout>
                    <SmartRecommendationsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            {/* Route 404 */}
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
