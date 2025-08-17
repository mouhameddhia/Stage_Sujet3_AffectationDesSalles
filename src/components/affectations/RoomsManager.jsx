import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Stack,
  Typography,
  Divider
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import RoomModal from './RoomModal';

const RoomsManager = ({ open, onClose, salles = [], onUpdateSalle, onDeleteSalle }) => {
  const [editSalle, setEditSalle] = useState(null);

  const closeEdit = () => setEditSalle(null);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Gestion des salles</DialogTitle>
      <DialogContent dividers>
        {salles.length === 0 ? (
          <Typography color="text.secondary">Aucune salle disponible.</Typography>
        ) : (
          <List>
            {salles.map((salle) => (
              <React.Fragment key={salle.idSalle}>
                <ListItem
                  secondaryAction={
                    <Stack direction="row" spacing={1}>
                      <IconButton aria-label="edit" onClick={() => setEditSalle(salle)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton aria-label="delete" color="error" onClick={() => onDeleteSalle?.(salle.idSalle)}>
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  }
                >
                  <ListItemText
                    primary={salle.nomSalle}
                    secondary={`${salle.typeSalle} — ${salle.capacite} places`}
                  />
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fermer</Button>
      </DialogActions>

      {/* Edit modal */}
      {editSalle && (
        <RoomModal
          open={Boolean(editSalle)}
          onClose={closeEdit}
          initialSalle={editSalle}
          onSubmit={async (payload) => {
            // payload contains idSalle when editing
            await onUpdateSalle?.(payload.idSalle, {
              nomSalle: payload.nomSalle,
              typeSalle: payload.typeSalle,
              capacite: payload.capacite,
            });
          }}
        />
      )}
    </Dialog>
  );
};

export default RoomsManager;

