import React from 'react';
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Tooltip
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  TableChart as TableIcon
} from '@mui/icons-material';

const ViewSelector = ({ currentView, onViewChange }) => {
  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      onViewChange(newView);
    }
  };

  return (
    <Box 
      data-testid="view-selector"
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        mb: 3,
        p: 2,
        bgcolor: 'background.paper',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
          📅 Gestion des Affectations
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Calendrier ou Emploi du Temps
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Vue actuelle:
        </Typography>
        
        <ToggleButtonGroup
          value={currentView}
          exclusive
          onChange={handleViewChange}
          size="small"
          sx={{
            '& .MuiToggleButton-root': {
              px: 3,
              py: 1,
              fontWeight: 600,
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark'
                }
              }
            }
          }}
        >
          <ToggleButton value="calendar">
            <Tooltip title="Vue Calendrier - Affichage temporel des affectations">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarIcon fontSize="small" />
                Calendrier
              </Box>
            </Tooltip>
          </ToggleButton>
          
          <ToggleButton value="table">
            <Tooltip title="Emploi du Temps - Grille horaire par salle">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TableIcon fontSize="small" />
                Emploi du Temps
              </Box>
            </Tooltip>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Box>
  );
};

export default ViewSelector;
