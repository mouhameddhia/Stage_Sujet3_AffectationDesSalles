import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/auth/LoginForm';

const LoginPage = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Rediriger vers la page d'accueil si déjà connecté
  if (!isLoading && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Afficher le formulaire de connexion
  return <LoginForm />;
};

export default LoginPage; 