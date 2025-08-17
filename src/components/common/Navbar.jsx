import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, MenuItem, ListItemText, Divider } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import UserProfile from '../profile/UserProfile';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isProfileViewOpen, setIsProfileViewOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleMenuClose();
  };

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setIsProfileOpen(false);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const openEditProfile = () => {
    setIsProfileOpen(true);
    handleMenuClose();
  };

  const openViewProfile = () => {
    setIsProfileViewOpen(true);
    handleMenuClose();
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="navbar-logo">
            🏢 Affectation Salles
          </Link>
        </div>
        
        <div className="navbar-menu">
          <div className="navbar-user">
            <span className="user-info">
              👤 {user?.nom} ({user?.role})
            </span>
            <button 
              className="profile-button"
              onClick={handleProfileClick}
              title="Profil"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                  fill="currentColor"
                />
                <path
                  d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={openEditProfile}>
          <ListItemText>✏️ Modifier le profil</ListItemText>
        </MenuItem>
        <MenuItem onClick={openViewProfile}>
          <ListItemText>👁️ Voir le profil</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemText>🚪 Se déconnecter</ListItemText>
        </MenuItem>
      </Menu>
      
      <UserProfile isOpen={isProfileOpen} onClose={handleProfileClose} />
      
      {/* Simple view-only modal based on UserProfile styling */}
      {isProfileViewOpen && (
        <div className="profile-modal-overlay" onClick={() => setIsProfileViewOpen(false)}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="profile-modal-header">
              <h2>Profil</h2>
              <button className="close-button" onClick={() => setIsProfileViewOpen(false)}>×</button>
            </div>
            <div className="profile-modal-content">
              <div className="user-info-card" style={{ boxShadow: 'none', padding: 0 }}>
                <div className="user-details">
                  <div className="detail-item"><span className="detail-label">Nom :</span><span className="detail-value">{user?.nom}</span></div>
                  <div className="detail-item"><span className="detail-label">Email :</span><span className="detail-value">{user?.email}</span></div>
                  <div className="detail-item"><span className="detail-label">Rôle :</span><span className="detail-value">{user?.role}</span></div>
                  <div className="detail-item"><span className="detail-label">ID :</span><span className="detail-value">{user?.idUser}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 