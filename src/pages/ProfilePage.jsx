import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Grid,
  Chip,
  Paper,
  Divider
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  AdminPanelSettings as AdminIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const profileInfo = [
    {
      label: 'Nom complet',
      value: user?.name || 'Non spécifié',
      icon: <PersonIcon />,
      color: 'primary'
    },
    {
      label: 'Email',
      value: user?.email || 'Non spécifié',
      icon: <EmailIcon />,
      color: 'info'
    },
    {
      label: 'Rôle',
      value: isAdmin ? 'Administrateur' : 'Utilisateur',
      icon: <AdminIcon />,
      color: isAdmin ? 'success' : 'default'
    },
    {
      label: 'Membre depuis',
      value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : 'Non spécifié',
      icon: <CalendarIcon />,
      color: 'secondary'
    }
  ];

  return (
    <Box className="profile-page">
      {/* Page Header */}
      <Paper 
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 3
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              border: '3px solid rgba(255, 255, 255, 0.3)',
              fontSize: '2rem'
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </Avatar>
          <Box>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
              Mon Profil
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
              Informations personnelles et paramètres du compte
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Profile Information */}
      <Grid container spacing={3}>
        {/* Main Profile Card */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                📋 Informations du compte
              </Typography>
              
              <Grid container spacing={3}>
                {profileInfo.map((info, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2,
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: 'rgba(0, 0, 0, 0.02)',
                      border: '1px solid rgba(0, 0, 0, 0.08)'
                    }}>
                      <Box sx={{ 
                        color: `${info.color}.main`,
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        {info.icon}
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                          {info.label}
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {info.value}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Side Panel */}
        <Grid item xs={12} lg={4}>
          <Grid container spacing={3}>
            {/* Role Badge */}
            <Grid item xs={12}>
              <Card>
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Statut du compte
                  </Typography>
                  <Chip
                    label={isAdmin ? 'Administrateur' : 'Utilisateur'}
                    color={isAdmin ? 'success' : 'primary'}
                    variant="filled"
                    size="large"
                    sx={{ 
                      fontSize: '1rem', 
                      py: 1,
                      px: 2,
                      '& .MuiChip-label': { px: 2 }
                    }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    {isAdmin 
                      ? 'Vous avez accès à toutes les fonctionnalités d\'administration'
                      : 'Vous pouvez gérer vos affectations et suivre vos demandes'
                    }
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Quick Actions */}
            <Grid item xs={12}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Actions rapides
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Chip
                      label="Modifier le profil"
                      variant="outlined"
                      color="primary"
                      clickable
                      onClick={() => window.location.href = '/modifier-profil'}
                      sx={{ justifyContent: 'flex-start' }}
                    />
                    <Chip
                      label="Changer le mot de passe"
                      variant="outlined"
                      color="secondary"
                      clickable
                      sx={{ justifyContent: 'flex-start' }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Additional Information */}
      <Paper sx={{ mt: 4, p: 3, background: '#f8f9fa' }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          📊 Statistiques du compte
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Cette section affichera bientôt des statistiques sur votre utilisation de la plateforme, 
          comme le nombre d'affectations créées, le taux d'approbation, etc.
        </Typography>
      </Paper>
    </Box>
  );
};

export default ProfilePage;
