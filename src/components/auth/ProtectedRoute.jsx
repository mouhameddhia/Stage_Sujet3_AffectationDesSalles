import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Afficher le spinner pendant la vérification de l'authentification
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <LoadingSpinner message="Vérification de l'authentification..." />
      </div>
    );
  }

  // Rediriger vers la page de connexion si non authentifié
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Vérifier les permissions de rôle si spécifiées
  if (requiredRole && user?.role !== requiredRole) {
    // Rediriger vers la page d'accueil si l'utilisateur n'a pas les permissions
    return <Navigate to="/" replace />;
  }

  // Afficher le contenu protégé si authentifié et autorisé
  return children;
};

export default ProtectedRoute; 