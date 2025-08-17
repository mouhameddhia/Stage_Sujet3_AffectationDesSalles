import React from 'react';
import {
  Box,
  Typography,
  Paper
} from '@mui/material';
import UserPendingAffectations from '../components/affectations/UserPendingAffectations';

const MesDemandesPage = () => {
  return (
    <Box className="mes-demandes-page">
      {/* Page Header */}
      <Paper 
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 3
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          📋 Mes Demandes d'Affectation
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Suivez l'état de vos demandes d'affectation de salles
        </Typography>
      </Paper>

      {/* User Pending Affectations */}
      <UserPendingAffectations />
    </Box>
  );
};

export default MesDemandesPage;
