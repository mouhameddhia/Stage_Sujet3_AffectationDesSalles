import React from 'react';
import {
  Box,
  Typography,
  Paper
} from '@mui/material';
import AdminApprovalDashboard from '../components/affectations/AdminApprovalDashboard';

const ApprobationsPage = () => {
  return (
    <Box className="approbations-page">
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
          🎯 Approbations des Affectations
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Gérez et approuvez les demandes d'affectation des utilisateurs
        </Typography>
      </Paper>

      {/* Admin Approval Dashboard */}
      <AdminApprovalDashboard />
    </Box>
  );
};

export default ApprobationsPage;
