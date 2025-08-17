import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Alert,
  CircularProgress,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Schedule as PendingIcon,
  CheckCircle as ApprovedIcon,
  Cancel as RejectedIcon,
  Refresh as RefreshIcon,
  Room as RoomIcon,
  Event as EventIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import affectationService from '../../services/affectationService';
import './UserPendingAffectations.css';

const UserPendingAffectations = () => {
  const [myPendingAffectations, setMyPendingAffectations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Load user's pending affectations
  const loadMyPendingAffectations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await affectationService.getMyPendingAffectations();
      setMyPendingAffectations(data);
      setSuccess(`Chargé ${data.length} de vos affectations`);
    } catch (err) {
      console.error('Error loading my pending affectations:', err);
      setError('Erreur lors du chargement de vos affectations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyPendingAffectations();
  }, []);

  // Get status color and icon
  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return {
          color: 'warning',
          icon: <PendingIcon />,
          label: 'En attente',
          description: 'En attente d\'approbation par un administrateur'
        };
      case 'approved':
        return {
          color: 'success',
          icon: <ApprovedIcon />,
          label: 'Approuvée',
          description: 'Votre demande a été approuvée'
        };
      case 'rejected':
        return {
          color: 'error',
          icon: <RejectedIcon />,
          label: 'Rejetée',
          description: 'Votre demande a été rejetée'
        };
      default:
        return {
          color: 'default',
          icon: <InfoIcon />,
          label: status || 'Inconnu',
          description: 'Statut non défini'
        };
    }
  };

  // Format date and time
  const formatDateTime = (date, time) => {
    const dateObj = new Date(`${date}T${time}`);
    return dateObj.toLocaleString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format request time
  const formatRequestTime = (requestTime) => {
    if (!requestTime) return 'N/A';
    const dateObj = new Date(requestTime);
    return dateObj.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box className="user-pending-affectations">
      {/* Header */}
      <Card className="user-dashboard-header">
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                📋 Mes Demandes d'Affectation
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Suivez l'état de vos demandes d'affectation de salles
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={loadMyPendingAffectations}
              disabled={loading}
            >
              Actualiser
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card className="stat-card">
            <CardContent>
              <Box display="flex" alignItems="center">
                <PendingIcon color="warning" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h4" component="div">
                    {myPendingAffectations.filter(a => a.status === 'pending').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    En attente
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card className="stat-card">
            <CardContent>
              <Box display="flex" alignItems="center">
                <ApprovedIcon color="success" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h4" component="div">
                    {myPendingAffectations.filter(a => a.status === 'approved').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Approuvées
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card className="stat-card">
            <CardContent>
              <Box display="flex" alignItems="center">
                <RejectedIcon color="error" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h4" component="div">
                    {myPendingAffectations.filter(a => a.status === 'rejected').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Rejetées
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card className="stat-card">
            <CardContent>
              <Box display="flex" alignItems="center">
                <RoomIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h4" component="div">
                    {new Set(myPendingAffectations.map(a => a.idSalle)).size}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Salles demandées
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {/* Affectations Table */}
      <Paper className="user-affectations-table-container">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Salle</strong></TableCell>
                <TableCell><strong>Activité</strong></TableCell>
                <TableCell><strong>Date & Heure</strong></TableCell>
                <TableCell><strong>Demande</strong></TableCell>
                <TableCell><strong>Statut</strong></TableCell>
                <TableCell><strong>Détails</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {myPendingAffectations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Box py={4}>
                      <Typography variant="h6" color="text.secondary">
                        📝 Aucune demande d'affectation
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Vous n'avez pas encore fait de demande d'affectation
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                myPendingAffectations.map((affectation) => {
                  const statusInfo = getStatusInfo(affectation.status);
                  return (
                    <TableRow key={affectation.idaffectation} className="affectation-row">
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <RoomIcon sx={{ mr: 1, color: 'secondary.main' }} />
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                              {affectation.nomSalle}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Capacité: {affectation.capaciteSalle}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={affectation.typeactivite}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <EventIcon sx={{ mr: 1, color: 'info.main' }} />
                          <Box>
                            <Typography variant="body2">
                              {formatDateTime(affectation.date, affectation.heuredebut)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Fin: {affectation.heurefin}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatRequestTime(affectation.requestTime)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          {statusInfo.icon}
                          <Chip
                            label={statusInfo.label}
                            color={statusInfo.color}
                            size="small"
                            sx={{ ml: 1 }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        {affectation.status === 'rejected' && affectation.rejectionReason && (
                          <Tooltip title={affectation.rejectionReason} arrow>
                            <IconButton size="small" color="error">
                              <InfoIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        {affectation.status === 'approved' && (
                          <Tooltip title="Demande approuvée" arrow>
                            <IconButton size="small" color="success">
                              <ApprovedIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        {affectation.status === 'pending' && (
                          <Tooltip title="En attente d'approbation" arrow>
                            <IconButton size="small" color="warning">
                              <PendingIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Status Legend */}
      <Card className="status-legend" sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📊 Légende des Statuts
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Box display="flex" alignItems="center">
                <Chip
                  icon={<PendingIcon />}
                  label="En attente"
                  color="warning"
                  size="small"
                  sx={{ mr: 2 }}
                />
                <Typography variant="body2">
                  Votre demande est en cours d'examen par un administrateur
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box display="flex" alignItems="center">
                <Chip
                  icon={<ApprovedIcon />}
                  label="Approuvée"
                  color="success"
                  size="small"
                  sx={{ mr: 2 }}
                />
                <Typography variant="body2">
                  Votre demande a été approuvée et la salle vous est réservée
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box display="flex" alignItems="center">
                <Chip
                  icon={<RejectedIcon />}
                  label="Rejetée"
                  color="error"
                  size="small"
                  sx={{ mr: 2 }}
                />
                <Typography variant="body2">
                  Votre demande a été rejetée (cliquez sur l'icône pour voir la raison)
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserPendingAffectations;
