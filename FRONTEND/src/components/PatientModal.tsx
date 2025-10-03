import React from 'react';
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { PatientCard } from './PatientCard';
import { usePatient } from '../hooks/usePatient';

interface PatientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PatientModal({ isOpen, onClose }: PatientModalProps) {
  const { patients, expandedPatientId, togglePatient } = usePatient();

  if (!isOpen) return null;

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="patient-modal-title"
      aria-describedby="patient-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '100%', sm: '90%', md: '80%', lg: '70%' }, // Responsivo
          maxWidth: '1200px',
          maxHeight: '90vh',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          overflow: 'hidden',
          outline: 'none',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            bgcolor: 'primary.50', // Azul claro (ajusta si usas tema personalizado)
            borderBottom: 1,
            borderColor: 'primary.200',
            px: 3,
            py: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            id="patient-modal-title"
            variant="h6"
            color="primary.main" // Azul principal
            sx={{ fontWeight: 'bold' }}
          >
            Registros de Pacientes
          </Typography>
          <IconButton
            onClick={onClose}
            aria-label="Cerrar modal"
            sx={{
              color: 'primary.main',
              '&:hover': {
                bgcolor: 'primary.100',
                color: 'primary.dark',
              },
              borderRadius: '50%',
              p: 0.5,
            }}
          >
            <CloseIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>

        {/* Content */}
        <Box
          sx={{
            p: 3,
            overflowY: 'auto',
            maxHeight: 'calc(90vh - 80px)', // Ajusta para header
            '&::-webkit-scrollbar': {
              width: 6,
            },
            '&::-webkit-scrollbar-track': {
              bgcolor: 'grey.100',
            },
            '&::-webkit-scrollbar-thumb': {
              bgcolor: 'grey.300',
              borderRadius: 3,
            },
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {patients.map((patient) => (
              <PatientCard
                key={patient.identificacion}
                patient={patient}
                isExpanded={expandedPatientId === patient.identificacion}
                onToggle={() => togglePatient(patient.identificacion)}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
