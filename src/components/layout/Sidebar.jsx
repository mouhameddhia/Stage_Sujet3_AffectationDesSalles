import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Box,
  useTheme,
  useMediaQuery,
  IconButton,
  Toolbar,
  AppBar,
  Typography
} from '@mui/material';
import {
  Home as HomeIcon,
  CalendarMonth as CalendarIcon,
  AdminPanelSettings as AdminIcon,
  Person as UserIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const drawerWidth = 280;

const Sidebar = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const isAdmin = user?.role === 'admin';

  const menuItems = [
    {
      text: 'Accueil',
      icon: <HomeIcon />,
      path: '/',
      alwaysVisible: true
    },
    {
      text: 'Gestion des affectations',
      icon: <CalendarIcon />,
      path: '/affectations',
      alwaysVisible: true
    },
    {
      text: 'Approbations',
      icon: <AdminIcon />,
      path: '/approbations',
      adminOnly: true
    },
    {
      text: 'Mes demandes',
      icon: <UserIcon />,
      path: '/mes-demandes',
      userOnly: true
    }
  ];

  const filteredMenuItems = menuItems.filter(item => {
    if (item.adminOnly && !isAdmin) return false;
    if (item.userOnly && isAdmin) return false;
    return item.alwaysVisible || item.adminOnly || item.userOnly;
  });

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const isActiveRoute = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const drawer = (
    <Box sx={{ width: drawerWidth }}>
      {/* Sidebar Header */}
      <Box
        sx={{
          p: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Typography variant="h5" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
          📅 Salles
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          Gestion des affectations
        </Typography>
      </Box>

      <Divider />

      {/* Navigation Menu */}
      <List sx={{ pt: 2 }}>
        {filteredMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              sx={{
                mx: 2,
                borderRadius: 2,
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
                },
                transition: 'all 0.2s ease-in-out',
                '& .MuiListItemIcon-root': {
                  color: isActiveRoute(item.path) 
                    ? theme.palette.primary.main 
                    : theme.palette.text.secondary,
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{
                  fontWeight: isActiveRoute(item.path) ? 600 : 400
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* User Info at Bottom */}
      <Box sx={{ mt: 'auto', p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 600
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {user?.name || 'Utilisateur'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {isAdmin ? 'Administrateur' : 'Utilisateur'}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Mobile App Bar */}
      {isMobile && (
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: 'none'
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Gestion des Salles
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Sidebar Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              border: 'none',
              boxShadow: '4px 0 20px rgba(0, 0, 0, 0.1)'
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              border: 'none',
              boxShadow: '4px 0 20px rgba(0, 0, 0, 0.1)',
              background: theme.palette.background.default
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          background: '#f8f9fa'
        }}
      >
        {/* Mobile Toolbar Spacer */}
        {isMobile && <Toolbar />}
        
        {/* Page Content */}
        <Box sx={{ 
          background: 'white', 
          borderRadius: 3, 
          p: 3, 
          minHeight: 'calc(100vh - 120px)',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
        }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;
