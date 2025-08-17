import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  IconButton,
  Stack,
  Divider
} from '@mui/material';
import {
  MeetingRoom as MeetingRoomIcon,
  Business as BusinessIcon,
  Layers as LayersIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  Category as CategoryIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

const SalleCard = ({ 
  salle, 
  onEdit, 
  onDelete, 
  showActions = false,
  variant = 'default',
  sx = {} 
}) => {
  const getLocationString = () => {
    const parts = [];
    if (salle.blocNom) parts.push(salle.blocNom);
    if (salle.etageNumero) parts.push(salle.etageNumero);
    if (salle.nomSalle) parts.push(salle.nomSalle);
    return parts.join(' - ');
  };

  const getTypeColor = (type) => {
    const colors = {
      'Salle de cours': 'primary',
      'Amphithéâtre': 'secondary',
      'Salle de TP': 'success',
      'Salle de réunion': 'warning',
      'Laboratoire': 'info',
      'Auditorium': 'error'
    };
    return colors[type] || 'default';
  };

  const renderCompactCard = () => (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3
        },
        ...sx 
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <MeetingRoomIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
            {salle.nomSalle}
          </Typography>
        </Box>

        <Stack spacing={1} sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CategoryIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {salle.typeSalle}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PeopleIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {salle.capacite} places
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
              {getLocationString()}
            </Typography>
          </Box>
        </Stack>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip 
            label={salle.typeSalle} 
            size="small" 
            color={getTypeColor(salle.typeSalle)}
            variant="outlined"
          />
          <Chip 
            label={`${salle.capacite} places`} 
            size="small" 
            variant="outlined"
            icon={<PeopleIcon />}
          />
        </Box>
      </CardContent>

      {showActions && (
        <Box sx={{ p: 2, pt: 0 }}>
          <Divider sx={{ mb: 1 }} />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton 
              size="small" 
              onClick={() => onEdit?.(salle)}
              sx={{ color: 'primary.main' }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton 
              size="small" 
              onClick={() => onDelete?.(salle)}
              sx={{ color: 'error.main' }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      )}
    </Card>
  );

  const renderDetailedCard = () => (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3
        },
        ...sx 
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <MeetingRoomIcon sx={{ mr: 1.5, color: 'primary.main', fontSize: 28 }} />
          <Typography variant="h5" component="h3" sx={{ fontWeight: 700 }}>
            {salle.nomSalle}
          </Typography>
        </Box>

        <Stack spacing={2} sx={{ mb: 3 }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Localisation
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <BusinessIcon fontSize="small" color="action" />
              <Typography variant="body2">
                Bloc: {salle.blocNom || 'Non spécifié'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <LayersIcon fontSize="small" color="action" />
              <Typography variant="body2">
                Étage: {salle.etageNumero || 'Non spécifié'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationIcon fontSize="small" color="action" />
              <Typography variant="body2">
                Localisation complète: {getLocationString()}
              </Typography>
            </Box>
          </Box>

          <Divider />

          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Caractéristiques
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <CategoryIcon fontSize="small" color="action" />
              <Typography variant="body2">
                Type: {salle.typeSalle}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PeopleIcon fontSize="small" color="action" />
              <Typography variant="body2">
                Capacité: {salle.capacite} personnes
              </Typography>
            </Box>
          </Box>
        </Stack>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip 
            label={salle.typeSalle} 
            color={getTypeColor(salle.typeSalle)}
            variant="filled"
            icon={<CategoryIcon />}
          />
          <Chip 
            label={`${salle.capacite} places`} 
            variant="outlined"
            icon={<PeopleIcon />}
          />
          {salle.blocNom && (
            <Chip 
              label={salle.blocNom} 
              variant="outlined"
              icon={<BusinessIcon />}
            />
          )}
        </Box>
      </CardContent>

      {showActions && (
        <Box sx={{ p: 3, pt: 0 }}>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton 
              onClick={() => onEdit?.(salle)}
              sx={{ 
                color: 'primary.main',
                '&:hover': { bgcolor: 'primary.50' }
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton 
              onClick={() => onDelete?.(salle)}
              sx={{ 
                color: 'error.main',
                '&:hover': { bgcolor: 'error.50' }
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      )}
    </Card>
  );

  const renderListCard = () => (
    <Card 
      sx={{ 
        display: 'flex',
        alignItems: 'center',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateX(4px)',
          boxShadow: 2
        },
        ...sx 
      }}
    >
      <CardContent sx={{ flexGrow: 1, py: 2, px: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <MeetingRoomIcon sx={{ color: 'primary.main' }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {salle.nomSalle}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {getLocationString()}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip 
              label={salle.typeSalle} 
              size="small" 
              color={getTypeColor(salle.typeSalle)}
              variant="outlined"
            />
            <Chip 
              label={`${salle.capacite} places`} 
              size="small" 
              variant="outlined"
            />
          </Box>
        </Box>
      </CardContent>

      {showActions && (
        <Box sx={{ pr: 2 }}>
          <IconButton 
            size="small" 
            onClick={() => onEdit?.(salle)}
            sx={{ color: 'primary.main', mr: 1 }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton 
            size="small" 
            onClick={() => onDelete?.(salle)}
            sx={{ color: 'error.main' }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
    </Card>
  );

  switch (variant) {
    case 'compact':
      return renderCompactCard();
    case 'detailed':
      return renderDetailedCard();
    case 'list':
      return renderListCard();
    default:
      return renderCompactCard();
  }
};

export default SalleCard;
