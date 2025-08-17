import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Avatar,
  Paper,
  Alert,
  Divider,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const EditProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Le nom doit contenir au moins 2 caractères';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    // Password validation (only if user wants to change password)
    if (formData.newPassword || formData.confirmPassword || formData.currentPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Le mot de passe actuel est requis pour changer le mot de passe';
      }
      if (!formData.newPassword) {
        newErrors.newPassword = 'Le nouveau mot de passe est requis';
      } else if (formData.newPassword.length < 6) {
        newErrors.newPassword = 'Le mot de passe doit contenir au moins 6 caractères';
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'La confirmation du mot de passe est requise';
      } else if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSuccess('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user data (in a real app, this would be an API call)
      const updatedUser = {
        ...user,
        name: formData.name,
        email: formData.email
      };
      
      if (updateUser) {
        updateUser(updatedUser);
      }
      
      setSuccess('Profil mis à jour avec succès !');
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
      // Redirect to profile page after 2 seconds
      setTimeout(() => {
        navigate('/profil');
      }, 2000);
      
    } catch (error) {
      setErrors({ submit: 'Erreur lors de la mise à jour du profil. Veuillez réessayer.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/profil');
  };

  return (
    <Box className="edit-profile-page">
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
              Modifier le Profil
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
              Mettez à jour vos informations personnelles et votre mot de passe
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Success Message */}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      {/* Error Message */}
      {errors.submit && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errors.submit}
        </Alert>
      )}

      {/* Edit Form */}
      <Card>
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={4}>
              {/* Personal Information */}
              <Grid item xs={12}>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                  📝 Informations personnelles
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nom complet"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  error={!!errors.name}
                  helperText={errors.name}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  error={!!errors.email}
                  helperText={errors.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
              </Grid>

              {/* Password Change Section */}
              <Grid item xs={12}>
                <Divider sx={{ my: 3 }}>
                  <Typography variant="h6" color="text.secondary">
                    🔐 Changer le mot de passe (optionnel)
                  </Typography>
                </Divider>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Mot de passe actuel"
                  type={showPasswords.current ? 'text' : 'password'}
                  value={formData.currentPassword}
                  onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                  error={!!errors.currentPassword}
                  helperText={errors.currentPassword}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => togglePasswordVisibility('current')}
                          edge="end"
                        >
                          {showPasswords.current ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Nouveau mot de passe"
                  type={showPasswords.new ? 'text' : 'password'}
                  value={formData.newPassword}
                  onChange={(e) => handleInputChange('newPassword', e.target.value)}
                  error={!!errors.newPassword}
                  helperText={errors.newPassword}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => togglePasswordVisibility('new')}
                          edge="end"
                        >
                          {showPasswords.new ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Confirmer le nouveau mot de passe"
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => togglePasswordVisibility('confirm')}
                          edge="end"
                        >
                          {showPasswords.confirm ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Action Buttons */}
              <Grid item xs={12}>
                <Divider sx={{ my: 3 }} />
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={handleCancel}
                    startIcon={<CancelIcon />}
                    size="large"
                    disabled={loading}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    size="large"
                    loading={loading}
                    disabled={loading}
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                      }
                    }}
                  >
                    {loading ? 'Sauvegarde...' : 'Sauvegarder'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      {/* Help Text */}
      <Paper sx={{ mt: 4, p: 3, background: '#f8f9fa' }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          💡 Conseils
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          • Votre nom et email seront visibles par les autres utilisateurs de la plateforme.<br/>
          • Si vous ne souhaitez pas changer votre mot de passe, laissez ces champs vides.<br/>
          • Le nouveau mot de passe doit contenir au moins 6 caractères.
        </Typography>
      </Paper>
    </Box>
  );
};

export default EditProfilePage;
