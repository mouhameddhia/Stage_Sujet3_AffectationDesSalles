import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Container,
  useTheme,
  useMediaQuery,
  Paper,
  Chip,
  Avatar,
  Divider
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  AdminPanelSettings as AdminIcon,
  Person as UserIcon,
  School as SchoolIcon,
  MeetingRoom as RoomIcon,
  Schedule as ScheduleIcon,
  TrendingUp as StatsIcon,
  Security as SecurityIcon,
  ArrowForward as ArrowIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const isAdmin = user?.role === 'admin';

  // Simple fade-in animation on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      title: 'Gestion des Affectations',
      description: 'Planifiez et gérez les affectations de salles avec notre calendrier interactif et intuitif.',
      icon: <CalendarIcon sx={{ fontSize: 40, color: '#667eea' }} />,
      path: '/affectations',
      color: '#667eea',
      alwaysVisible: true
    },
    {
      title: 'Approbations',
      description: 'Gérez les demandes d\'affectation et approuvez ou rejetez les réservations.',
      icon: <AdminIcon sx={{ fontSize: 40, color: '#764ba2' }} />,
      path: '/approbations',
      color: '#764ba2',
      adminOnly: true
    },
    {
      title: 'Mes Demandes',
      description: 'Suivez l\'état de vos demandes d\'affectation et consultez l\'historique.',
      icon: <UserIcon sx={{ fontSize: 40, color: '#4CAF50' }} />,
      path: '/mes-demandes',
      color: '#4CAF50',
      userOnly: true
    }
  ];

  const filteredFeatures = features.filter(feature => {
    if (feature.adminOnly && !isAdmin) return false;
    if (feature.userOnly && isAdmin) return false;
    return feature.alwaysVisible || feature.adminOnly || feature.userOnly;
  });

  const stats = [
    { label: 'Salles Disponibles', value: '12', icon: <RoomIcon />, color: '#667eea' },
    { label: 'Affectations Actives', value: '45', icon: <ScheduleIcon />, color: '#764ba2' },
    { label: 'Utilisateurs', value: '150+', icon: <UserIcon />, color: '#4CAF50' },
    { label: 'Taux de Satisfaction', value: '98%', icon: <StatsIcon />, color: '#FF9800' }
  ];

  const benefits = [
    {
      title: 'Interface Intuitive',
      description: 'Navigation simple et design moderne pour une expérience utilisateur optimale',
      icon: <CheckIcon sx={{ color: '#4CAF50' }} />
    },
    {
      title: 'Gestion Centralisée',
      description: 'Tous vos espaces et réservations dans une seule plateforme',
      icon: <CheckIcon sx={{ color: '#4CAF50' }} />
    },
    {
      title: 'Notifications en Temps Réel',
      description: 'Restez informé des changements et approbations instantanément',
      icon: <CheckIcon sx={{ color: '#4CAF50' }} />
    },
    {
      title: 'Rapports Détaillés',
      description: 'Analysez l\'utilisation de vos salles avec des statistiques avancées',
      icon: <CheckIcon sx={{ color: '#4CAF50' }} />
    }
  ];



  return (
    <Box className={`home-page ${isVisible ? 'visible' : ''}`}>
      {/* Hero Section with Full Background Video */}
      <Box
        className="hero-section-video"
        sx={{
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        {/* Full Background Video */}
        {/* Full Background Video */}
        <video
          className="hero-background-video"
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: -1
          }}
        >
          <source src="/mixkit-students-walking-in-a-university-4519-hd-ready.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Light Overlay for Text Readability */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.2)',
            zIndex: 0
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ position: 'relative', zIndex: 2 }}>
                <Chip
                  label="Système de Gestion"
                  sx={{
                    background: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    mb: 3,
                    fontWeight: 600,
                    backdropFilter: 'blur(10px)'
                  }}
                />
                
                <Typography
                  variant="h1"
                  component="h1"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: '2.5rem', md: '4rem' },
                    mb: 3,
                    lineHeight: 1.2,
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                  }}
                >
                  Gestion des Salles
                </Typography>
                
                <Typography
                  variant="h5"
                  sx={{
                    mb: 4,
                    opacity: 0.9,
                    fontWeight: 400,
                    lineHeight: 1.6
                  }}
                >
                  Simplifiez la gestion de vos salles avec notre plateforme moderne et intuitive. 
                  Planifiez, réservez et gérez vos espaces en toute simplicité.
                </Typography>

                {user && (
                  <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      sx={{
                        width: 50,
                        height: 50,
                        background: 'rgba(255,255,255,0.2)',
                        border: '2px solid rgba(255,255,255,0.3)',
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Bienvenue, {user.name} !
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        {isAdmin ? 'Administrateur' : 'Utilisateur'}
                      </Typography>
                    </Box>
                  </Box>
                )}

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/affectations')}
                    sx={{
                      background: 'rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      color: 'white',
                      px: 4,
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      '&:hover': {
                        background: 'rgba(255,255,255,0.3)',
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Commencer
                  </Button>
                  
                  <Button
                    variant="outlined"
                    size="large"
                    sx={{
                      borderColor: 'rgba(255,255,255,0.5)',
                      color: 'white',
                      px: 4,
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      '&:hover': {
                        borderColor: 'white',
                        background: 'rgba(255,255,255,0.1)'
                      }
                    }}
                  >
                    En savoir plus
                  </Button>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 500,
                  position: 'relative'
                }}
              >
                {/* Hero Content Right Side */}
                <Box
                  sx={{
                    textAlign: 'center',
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '20px',
                    padding: '3rem',
                    border: '1px solid rgba(255,255,255,0.2)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      mb: 2,
                      textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                    }}
                  >
                    Plateforme Moderne
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 3,
                      opacity: 0.9,
                      textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                    }}
                  >
                    Simplifiez la gestion de vos espaces universitaires
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                        🏢
                      </Typography>
                      <Typography variant="body2">Gestion Salles</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                        📅
                      </Typography>
                      <Typography variant="body2">Planification</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                        ✅
                      </Typography>
                      <Typography variant="body2">Approbation</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box className="features-section" sx={{ py: 10, background: '#f8f9fa' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontWeight: 700,
                mb: 3,
                color: '#2c3e50'
              }}
            >
              Fonctionnalités Principales
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: '#7f8c8d',
                maxWidth: 600,
                mx: 'auto',
                fontSize: '1.2rem'
              }}
            >
              Découvrez les outils qui simplifient la gestion de vos salles
            </Typography>
          </Box>

          <Grid container spacing={4} justifyContent="center">
            {filteredFeatures.map((feature, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card
                  className="feature-card"
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: 'none',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                    }
                  }}
                  onClick={() => navigate(feature.path)}
                >
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Box
                      sx={{
                        mb: 3,
                        p: 3,
                        borderRadius: '50%',
                        background: `${feature.color}15`,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 80,
                        height: 80
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h4" component="h3" gutterBottom sx={{ fontWeight: 700, mb: 2, color: '#2c3e50' }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#7f8c8d', lineHeight: 1.6, mb: 3 }}>
                      {feature.description}
                    </Typography>
                    <Button
                      variant="text"
                      endIcon={<ArrowIcon />}
                      sx={{
                        color: feature.color,
                        fontWeight: 600,
                        '&:hover': {
                          background: `${feature.color}10`
                        }
                      }}
                    >
                      Accéder
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Statistics Section */}
      <Box className="stats-section" sx={{ py: 10, background: 'white' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontWeight: 700,
                mb: 3,
                color: '#2c3e50'
              }}
            >
              Statistiques
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: '#7f8c8d',
                maxWidth: 600,
                mx: 'auto',
                fontSize: '1.2rem'
              }}
            >
              Chiffres clés de notre plateforme
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    className="stat-icon-container"
                    sx={{
                      mb: 3,
                      p: 3,
                      borderRadius: '50%',
                      background: `${stat.color}15`,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 80,
                      height: 80,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.1)',
                        background: `${stat.color}25`
                      }
                    }}
                  >
                    <Box sx={{ color: stat.color }}>
                      {stat.icon}
                    </Box>
                  </Box>
                  <Typography variant="h3" className="stat-counter" sx={{ fontWeight: 700, mb: 1, color: '#2c3e50' }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#7f8c8d' }}>
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Benefits Section */}
      <Box className="benefits-section" sx={{ py: 10, background: '#f8f9fa' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontWeight: 700,
                mb: 3,
                color: '#2c3e50'
              }}
            >
              Pourquoi Nous Choisir ?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: '#7f8c8d',
                maxWidth: 600,
                mx: 'auto',
                fontSize: '1.2rem'
              }}
            >
              Découvrez les avantages de notre plateforme
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {benefits.map((benefit, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card
                  sx={{
                    p: 3,
                    border: 'none',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Box sx={{ mt: 0.5 }}>
                      {benefit.icon}
                    </Box>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, color: '#2c3e50' }}>
                        {benefit.title}
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#7f8c8d', lineHeight: 1.6 }}>
                        {benefit.description}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      

      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          background: '#2c3e50',
          color: 'white',
          py: 6,
          mt: 'auto'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* Company Info */}
            <Grid item xs={12} md={4}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                Gestion des Salles
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, opacity: 0.8, lineHeight: 1.6 }}>
                Plateforme moderne de gestion des affectations de salles pour les établissements éducatifs et professionnels.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: '#667eea',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: '#5a6fd8',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>F</Typography>
                </Box>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: '#764ba2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: '#6a4190',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>T</Typography>
                </Box>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: '#4CAF50',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: '#45a049',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>L</Typography>
                </Box>
              </Box>
            </Grid>

            {/* Quick Links */}
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Liens Rapides
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="text"
                  sx={{ 
                    color: 'white', 
                    justifyContent: 'flex-start',
                    textTransform: 'none',
                    fontSize: '1rem',
                    '&:hover': {
                      background: 'rgba(255,255,255,0.1)'
                    }
                  }}
                  onClick={() => navigate('/affectations')}
                >
                  Gestion des Affectations
                </Button>
                <Button
                  variant="text"
                  sx={{ 
                    color: 'white', 
                    justifyContent: 'flex-start',
                    textTransform: 'none',
                    fontSize: '1rem',
                    '&:hover': {
                      background: 'rgba(255,255,255,0.1)'
                    }
                  }}
                  onClick={() => navigate('/profil')}
                >
                  Mon Profil
                </Button>
                {isAdmin && (
                  <Button
                    variant="text"
                    sx={{ 
                      color: 'white', 
                      justifyContent: 'flex-start',
                      textTransform: 'none',
                      fontSize: '1rem',
                      '&:hover': {
                        background: 'rgba(255,255,255,0.1)'
                      }
                    }}
                    onClick={() => navigate('/approbations')}
                  >
                    Approbations
                  </Button>
                )}
              </Box>
            </Grid>

            {/* Contact Info */}
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Contact
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  📧 contact@gestion-salles.com
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  📞 +33 1 23 45 67 89
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  🏢 123 Rue de l'Université, 75000 Paris
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Copyright */}
          <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.2)' }} />
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2
          }}>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              © {new Date().getFullYear()} Gestion des Salles. Tous droits réservés.
            </Typography>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Button
                variant="text"
                size="small"
                sx={{ 
                  color: 'white', 
                  opacity: 0.7,
                  textTransform: 'none',
                  '&:hover': {
                    opacity: 1,
                    background: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Politique de Confidentialité
              </Button>
              <Button
                variant="text"
                size="small"
                sx={{ 
                  color: 'white', 
                  opacity: 0.7,
                  textTransform: 'none',
                  '&:hover': {
                    opacity: 1,
                    background: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Conditions d'Utilisation
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage; 