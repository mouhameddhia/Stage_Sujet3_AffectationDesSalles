import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Stack
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon, BugReport as BugIcon } from '@mui/icons-material';

const DebugPanel = ({ data, title = 'Debug Info' }) => {
  if (!data || (Array.isArray(data) && data.length === 0)) {
    return (
      <Paper sx={{ p: 2, mb: 2, bgcolor: 'warning.50' }}>
        <Typography variant="h6" color="warning.main" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <BugIcon />
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Aucune donnée disponible
        </Typography>
      </Paper>
    );
  }

  const renderValue = (value) => {
    if (value === null || value === undefined) {
      return <Chip label="null/undefined" size="small" color="error" />;
    }
    if (typeof value === 'string') {
      return <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{value}</Typography>;
    }
    if (typeof value === 'number') {
      return <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{value}</Typography>;
    }
    if (typeof value === 'boolean') {
      return <Chip label={value.toString()} size="small" color={value ? 'success' : 'error'} />;
    }
    if (Array.isArray(value)) {
      return (
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Array ({value.length} items)
          </Typography>
          {value.slice(0, 3).map((item, index) => (
            <Box key={index} sx={{ ml: 2, mb: 1 }}>
              <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                [{index}]: {JSON.stringify(item)}
              </Typography>
            </Box>
          ))}
          {value.length > 3 && (
            <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
              ... et {value.length - 3} autres éléments
            </Typography>
          )}
        </Box>
      );
    }
    if (typeof value === 'object') {
      return (
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Object
          </Typography>
          {Object.entries(value).slice(0, 5).map(([key, val]) => (
            <Box key={key} sx={{ ml: 2, mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {key}:
              </Typography>
              <Box sx={{ ml: 2 }}>
                {renderValue(val)}
              </Box>
            </Box>
          ))}
          {Object.keys(value).length > 5 && (
            <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
              ... et {Object.keys(value).length - 5} autres propriétés
            </Typography>
          )}
        </Box>
      );
    }
    return <Typography variant="body2">{String(value)}</Typography>;
  };

  return (
    <Paper sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
      <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <BugIcon />
        {title}
      </Typography>
      
      {Array.isArray(data) ? (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">
              Données ({data.length} éléments)
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              {data.map((item, index) => (
                <Box key={index}>
                  <Typography variant="subtitle2" color="primary" sx={{ mb: 1 }}>
                    Élément {index + 1}
                  </Typography>
                  <Box sx={{ ml: 2 }}>
                    {Object.entries(item).map(([key, value]) => (
                      <Box key={key} sx={{ mb: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                          {key}:
                        </Typography>
                        <Box sx={{ ml: 2 }}>
                          {renderValue(value)}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>
      ) : (
        <Box>
          {Object.entries(data).map(([key, value]) => (
            <Box key={key} sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                {key}:
              </Typography>
              <Box sx={{ ml: 2 }}>
                {renderValue(value)}
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  );
};

export default DebugPanel;
