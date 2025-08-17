import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Chip,
  Divider,
  IconButton,
  Card,
  CardContent,
  Avatar
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  Event as EventIcon,
  Description as DescriptionIcon,
  Group as GroupIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import { getEventColor, getEventIcon } from '../../utils/calendarUtils';
import './AffectationDetails.css';

const AffectationDetails = ({
  open,
  event,
  onClose,
  onEdit,
  onDelete
}) => {
  if (!event) return null;

  const props = event.extendedProps;
  const startTime = event.start.toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  const endTime = event.end.toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  const duration = `${Math.round((event.end - event.start) / (1000 * 60))} minutes`;

  const getStatusColor = (statut) => {
    switch (statut) {
      case 'planifie': return 'primary';
      case 'en_cours': return 'warning';
      case 'termine': return 'success';
      case 'annule': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (statut) => {
    switch (statut) {
      case 'planifie': return 'Planifié';
      case 'en_cours': return 'En cours';
      case 'termine': return 'Terminé';
      case 'annule': return 'Annulé';
      default: return statut;
    }
  };

  const handleEdit = () => {
    onEdit(event);
    onClose();
  };

  const handleDelete = () => {
    onDelete(event);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <Avatar
              sx={{
                bgcolor: getEventColor(props.typeactivite),
                mr: 2,
                width: 40,
                height: 40
              }}
            >
              {getEventIcon(props.typeactivite)}
            </Avatar>
            <Box>
              <Typography variant="h5" component="h2">
                {props.typeactivite}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Salle {props.nomSalle}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3}>
          {/* Informations principales */}
          <Grid item xs={12}>
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  📅 Informations générales
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" mb={1}>
                      <EventIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body2">
                        <strong>Date :</strong> {event.start.toLocaleDateString('fr-FR')}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" mb={1}>
                      <ScheduleIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body2">
                        <strong>Horaire :</strong> {startTime} - {endTime}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box display="flex" alignItems="center" mb={1}>
                      <ScheduleIcon sx={{ mr: 1, color: 'info.main' }} />
                      <Typography variant="body2">
                        <strong>Durée :</strong> {duration}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Détails de la salle */}
          <Grid item xs={12}>
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  🏢 Détails de la salle
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" mb={1}>
                      <LocationIcon sx={{ mr: 1, color: 'secondary.main' }} />
                      <Typography variant="body2">
                        <strong>Salle :</strong> {props.nomSalle}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" mb={1}>
                      <CategoryIcon sx={{ mr: 1, color: 'secondary.main' }} />
                      <Typography variant="body2">
                        <strong>Type :</strong> {props.typeSalle}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box display="flex" alignItems="center" mb={1}>
                      <GroupIcon sx={{ mr: 1, color: 'secondary.main' }} />
                      <Typography variant="body2">
                        <strong>Capacité :</strong> {props.capaciteSalle} places
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Description */}
          {props.description && (
            <Grid item xs={12}>
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    📝 Description
                  </Typography>
                  <Box display="flex" alignItems="flex-start">
                    <DescriptionIcon sx={{ mr: 1, mt: 0.5, color: 'text.secondary' }} />
                    <Typography variant="body2" color="textSecondary">
                      {props.description}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Statut */}
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography variant="h6">
                📊 Statut
              </Typography>
              <Chip
                label={getStatusLabel(props.statut)}
                color={getStatusColor(props.statut)}
                variant="filled"
                size="medium"
              />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            
            {/* Actions */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="textSecondary">
                ID: {event.id}
              </Typography>
              
              <Box>
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={handleEdit}
                  sx={{ mr: 1 }}
                >
                  Modifier
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleDelete}
                >
                  Supprimer
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose} variant="contained">
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AffectationDetails; 