import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  useTheme,
  useMediaQuery,
  Divider,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  CalendarMonth as CalendarIcon,
  AdminPanelSettings as AdminIcon,
  Person as UserIcon,
  AccountCircle as ProfileIcon,
  Edit as EditIcon,
  Logout as LogoutIcon,
  MeetingRoom as MeetingRoomIcon,
  SmartToy as SmartToyIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const isAdmin = user?.role === 'admin';

  const navigationItems = [
    {
      text: 'Accueil',
      path: '/',
      icon: <HomeIcon />,
      alwaysVisible: true
    },
    {
      text: 'Gestion des affectations',
      path: '/affectations',
      icon: <CalendarIcon />,
      alwaysVisible: true
    },
    {
      text: '🤖 Recommandations IA',
      path: '/smart-recommendations',
      icon: <SmartToyIcon />,
      alwaysVisible: true
    },
    {
      text: 'Approbations',
      path: '/approbations',
      icon: <AdminIcon />,
      adminOnly: true
    },
    {
      text: 'Mes demandes',
      path: '/mes-demandes',
      icon: <UserIcon />,
      userOnly: true
    },
    {
      text: 'Gestion des Salles',
      path: '/salles',
      icon: <MeetingRoomIcon />,
      adminOnly: true
    }
  ];

  const filteredNavigationItems = navigationItems.filter(item => {
    if (item.adminOnly && !isAdmin) return false;
    if (item.userOnly && isAdmin) return false;
    return item.alwaysVisible || item.adminOnly || item.userOnly;
  });

  const isActiveRoute = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuAnchor(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleProfileAction = (action) => {
    handleUserMenuClose();
    switch (action) {
      case 'profile':
        navigate('/profil');
        break;
      case 'edit':
        navigate('/modifier-profil');
        break;
      case 'logout':
        logout();
        navigate('/login');
        break;
      default:
        break;
    }
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: theme.zIndex.drawer + 1,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        boxShadow: '0 2px 20px rgba(0, 0, 0, 0.1)'
      }}
    >
      <Toolbar sx={{ minHeight: 70 }}>
        {/* Logo/Title - Left Side */}
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
          <Typography 
            variant="h5" 
            component="div" 
            sx={{ 
              fontWeight: 700, 
              color: 'white',
              cursor: 'pointer'
            }}
            onClick={() => navigate('/')}
          >
            📅 Salles
          </Typography>
        </Box>

        {/* Navigation Links - Center (Desktop) */}
        {!isMobile && (
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', gap: 1 }}>
            {filteredNavigationItems.map((item) => (
              <Button
                key={item.text}
                onClick={() => handleNavigation(item.path)}
                startIcon={item.icon}
                sx={{
                  color: 'white',
                  textTransform: 'none',
                  fontWeight: isActiveRoute(item.path) ? 600 : 400,
                  backgroundColor: isActiveRoute(item.path) 
                    ? 'rgba(255, 255, 255, 0.15)' 
                    : 'transparent',
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  '&:hover': {
                    backgroundColor: isActiveRoute(item.path)
                      ? 'rgba(255, 255, 255, 0.2)'
                      : 'rgba(255, 255, 255, 0.1)',
                  },
                  transition: 'all 0.2s ease-in-out',
                  border: isActiveRoute(item.path) 
                    ? '1px solid rgba(255, 255, 255, 0.3)' 
                    : '1px solid transparent'
                }}
              >
                {item.text}
              </Button>
            ))}
          </Box>
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <IconButton
              color="inherit"
              onClick={handleMobileMenuOpen}
              sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' }
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        )}

        {/* User Section - Right Side */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
            <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
              {user?.name || 'Utilisateur'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              {isAdmin ? 'Administrateur' : 'Utilisateur'}
            </Typography>
          </Box>
          
          <Avatar
            onClick={handleUserMenuOpen}
            sx={{
              width: 40,
              height: 40,
              cursor: 'pointer',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                border: '2px solid rgba(255, 255, 255, 0.5)'
              }
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </Avatar>
        </Box>
      </Toolbar>

      {/* Mobile Navigation Menu */}
      <Menu
        anchorEl={mobileMenuAnchor}
        open={Boolean(mobileMenuAnchor)}
        onClose={handleMobileMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 250,
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
          }
        }}
        transformOrigin={{ horizontal: 'center', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
      >
        {filteredNavigationItems.map((item) => (
          <MenuItem
            key={item.text}
            onClick={() => handleNavigation(item.path)}
            sx={{
              py: 1.5,
              px: 3,
              backgroundColor: isActiveRoute(item.path) 
                ? 'rgba(102, 126, 234, 0.1)' 
                : 'transparent',
              color: isActiveRoute(item.path) 
                ? theme.palette.primary.main 
                : theme.palette.text.primary,
              '&:hover': {
                backgroundColor: isActiveRoute(item.path)
                  ? 'rgba(102, 126, 234, 0.15)'
                  : 'rgba(0, 0, 0, 0.04)',
              }
            }}
          >
            <ListItemIcon sx={{ 
              color: isActiveRoute(item.path) 
                ? theme.palette.primary.main 
                : theme.palette.text.secondary,
              minWidth: 36
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{
                fontWeight: isActiveRoute(item.path) ? 600 : 400
              }}
            />
          </MenuItem>
        ))}
      </Menu>

      {/* User Dropdown Menu */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {user?.name || 'Utilisateur'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {user?.email || 'email@example.com'}
          </Typography>
        </Box>
        
        <MenuItem onClick={() => handleProfileAction('profile')}>
          <ListItemIcon>
            <ProfileIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Voir profil" />
        </MenuItem>
        
        <MenuItem onClick={() => handleProfileAction('edit')}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Modifier profil" />
        </MenuItem>
        
        <Divider />
        
        <MenuItem onClick={() => handleProfileAction('logout')}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Déconnexion" />
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default Navbar;
