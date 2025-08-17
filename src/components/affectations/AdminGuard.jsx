import React from 'react';
import { Navigate } from 'react-router-dom';
import { Box, Typography, Alert, CircularProgress } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

/**
 * Composant de protection pour les routes administrateur
 * @param {Object} props - Propriétés du composant
 * @param {React.ReactNode} props.children - Contenu à afficher si autorisé
 * @returns {React.ReactNode} Contenu protégé ou redirection
 */
const AdminGuard = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Affichage du chargement
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Vérification des permissions...
        </Typography>
      </Box>
    );
  }

  // Redirection si non authentifié
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Vérification du rôle administrateur
  if (user?.role !== 'admin') {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <Alert severity="error" sx={{ maxWidth: 500 }}>
          <Typography variant="h6" gutterBottom>
            🔒 Accès Administrateur Requis
          </Typography>
          <Typography variant="body1" paragraph>
            Cette page est réservée aux administrateurs.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Votre rôle actuel : <strong>{user?.role || 'Non défini'}</strong>
          </Typography>
        </Alert>
      </Box>
    );
  }

  // Affichage du contenu protégé
  return <>{children}</>;
};

export default AdminGuard; 