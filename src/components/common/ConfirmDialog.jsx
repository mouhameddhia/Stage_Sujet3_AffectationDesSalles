import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  Box
} from '@mui/material';
import {
  Warning as WarningIcon,
  Delete as DeleteIcon,
  Info as InfoIcon
} from '@mui/icons-material';

/**
 * Composant de dialogue de confirmation
 * @param {Object} props - Propriétés du composant
 * @param {boolean} props.open - État d'ouverture du dialogue
 * @param {string} props.title - Titre du dialogue
 * @param {string} props.message - Message de confirmation
 * @param {Function} props.onConfirm - Fonction appelée lors de la confirmation
 * @param {Function} props.onCancel - Fonction appelée lors de l'annulation
 * @param {string} props.type - Type de dialogue ('delete', 'warning', 'info')
 * @param {string} props.confirmText - Texte du bouton de confirmation
 * @param {string} props.cancelText - Texte du bouton d'annulation
 * @param {boolean} props.dangerous - Si l'action est dangereuse (rouge)
 * @returns {React.ReactNode} Dialogue de confirmation
 */
const ConfirmDialog = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  type = 'info',
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  dangerous = false
}) => {
  // Configuration selon le type
  const getIcon = () => {
    switch (type) {
      case 'delete':
        return <DeleteIcon color="error" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      default:
        return <InfoIcon color="info" />;
    }
  };

  const getConfirmColor = () => {
    if (dangerous || type === 'delete') {
      return 'error';
    }
    return 'primary';
  };

  const getConfirmVariant = () => {
    if (dangerous || type === 'delete') {
      return 'contained';
    }
    return 'contained';
  };

  const handleConfirm = () => {
    onConfirm();
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
        }
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          {getIcon()}
          <Typography variant="h6" component="span">
            {title}
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <DialogContentText>
          <Typography variant="body1" color="text.secondary">
            {message}
          </Typography>
        </DialogContentText>
      </DialogContent>
      
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          onClick={handleCancel}
          variant="outlined"
          color="inherit"
          sx={{ minWidth: 100 }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={handleConfirm}
          variant={getConfirmVariant()}
          color={getConfirmColor()}
          sx={{ minWidth: 100 }}
          autoFocus
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog; 