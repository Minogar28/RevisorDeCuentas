import React from 'react';
import { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Badge,
  Fab,
  Stack,
  IconButton,
  Modal,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';

import { SearchBar } from '../components/SearchBar';
import { PatientCard } from '../components/PatientCard';
import { RecordUploadChat } from '../components/RecordUploadChat';
import { usePatientFilters } from '../hooks/usePatientFilters';
import { useResponsive } from '../hooks/useResponsive';
import { mockPatients } from '../data/mockPatients';

// ===== Tipos =====
interface RegistroItem { codigo: string; descripcion: string; }
interface Patient {
  historiaClinica: string;
  identificacion: number;
  nombre: string;
  registros: {
    consultas: RegistroItem[];
    estancias: RegistroItem[];
    imagenes: RegistroItem[];
    insumos: RegistroItem[];
    laboratorios: RegistroItem[];
    medicamentos: RegistroItem[];
    procedimientos: RegistroItem[];
  };
}

export interface SearchFilters {
  searchText: string;
  filterBy: 'all' | 'nombre' | 'historiaClinica' | 'identificacion';
  category:
  | 'all'
  | 'consultas'
  | 'estancias'
  | 'imagenes'
  | 'insumos'
  | 'laboratorios'
  | 'medicamentos'
  | 'procedimientos';
}

// ===== Página =====
export default function HomePage() {
  const [patients] = useState<Patient[]>(mockPatients as Patient[]);
  const [expandedPatientId, setExpandedPatientId] = useState<number | null>(null);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  const { isMobile } = useResponsive();
  const theme = useTheme();

  const {
    searchFilters,
    setSearchFilters,
    filteredPatients,
  } = usePatientFilters(patients);

  const togglePatient = useCallback((id: number) => {
    setExpandedPatientId(prev => (prev === id ? null : id));
  }, []);

  const toggleChat = useCallback(() => {
    setIsChatOpen(prev => !prev);
  }, []);

  // En desktop, abrir chat por defecto
  useEffect(() => {
    if (!isMobile) setIsChatOpen(true);
  }, [isMobile]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <Box sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider', py: 2 }}>
        <Container maxWidth="lg">
          <Typography variant="h5" color="text.primary">
            Sistema Clínico
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gestión y carga de registros médicos
          </Typography>
        </Container>
      </Box>

      {/* Main */}
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3 } }}>
        {/* Barra de búsqueda centrada */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Box sx={{ width: '100%', maxWidth: 720 }}>
            <SearchBar
              filters={searchFilters}
              onFiltersChange={setSearchFilters}
            />
          </Box>
        </Box>

        <Grid
          container
          spacing={2}
          sx={{
            height: {
              xs: 'calc(100vh - 240px)',
              sm: 'calc(100vh - 260px)',
            },
          }}
        >
          {/* Panel izquierdo (chat) solo desktop */}
          {!isMobile && (
            <Grid
              item
              lg={isChatOpen ? 4 : 0}
              sx={{
                display: { xs: 'none', lg: isChatOpen ? 'block' : 'none' },
                transition: theme.transitions.create(['width', 'opacity', 'transform'], {
                  duration: theme.transitions.duration.standard,
                }),
                opacity: isChatOpen ? 1 : 0,
                transform: isChatOpen ? 'scale(1)' : 'scale(0.95)',
                overflow: 'hidden',
              }}
            >
              <RecordUploadChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
            </Grid>
          )}

          {/* Contenido principal */}
          <Grid
            item
            xs={12}
            lg={isMobile || !isChatOpen ? 12 : 8}
            sx={{
              transition: theme.transitions.create(['width', 'opacity', 'transform'], {
                duration: theme.transitions.duration.standard,
              }),
              opacity: isChatOpen ? 1 : 1, // Siempre visible, pero ajusta width
              transform: isChatOpen ? 'scale(1)' : 'scale(1)',
            }}
            borderRadius={20}

          >
            <Paper
              variant="outlined"
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Header de la tarjeta */}
              <Box
                sx={{
                  bgcolor: theme => theme.palette.mode === 'light' ? 'rgba(25, 118, 210, 0.06)' : 'action.hover',
                  borderBottom: 1,
                  borderColor: 'divider',
                  px: 2,
                  py: 1.5,
                }}
              >
                <Stack direction="row" alignItems="center" justifyContent="space-between" borderRadius={20}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Typography variant="h6">Registros de Pacientes</Typography>
                    {filteredPatients.length !== patients.length && (
                      <Badge
                        color="secondary"
                        badgeContent={`${filteredPatients.length}/${patients.length}`}
                        sx={{
                          '& .MuiBadge-badge': { right: -10 },
                        }}
                      />
                    )}
                  </Stack>

                  {/* Botón toggle chat en desktop */}
                 
                </Stack>
              </Box>

              {/* Lista */}
              <Box sx={{ p: { xs: 2, sm: 3 }, overflowY: 'auto', flex: 1 }}>
                <Stack spacing={2}>
                  {filteredPatients.length > 0 ? (
                    filteredPatients.map((patient: Patient) => (
                      <PatientCard
                        key={patient.identificacion}
                        patient={patient}
                        isExpanded={expandedPatientId === patient.identificacion}
                        onToggle={() => togglePatient(patient.identificacion)}
                      />
                    ))
                  ) : (
                    <Paper
                      variant="outlined"
                      sx={{
                        textAlign: 'center',
                        py: 5,
                        px: 2,
                      }}
                    >
                      <Stack spacing={1.5} alignItems="center">
                        <Box
                          sx={{
                            width: 64,
                            height: 64,
                            borderRadius: '50%',
                            bgcolor: 'action.hover',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <SearchIcon color="disabled" />
                        </Box>
                        <Typography variant="subtitle1">No se encontraron pacientes</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Ajusta los filtros de búsqueda o verifica los criterios utilizados.
                        </Typography>
                        <Button
                          variant="outlined"
                          onClick={() =>
                            setSearchFilters({
                              searchText: '',
                              filterBy: 'all',
                              category: 'all',
                            } as SearchFilters)
                          }
                        >
                          Limpiar filtros
                        </Button>
                      </Stack>
                    </Paper>
                  )}
                </Stack>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Modal para Chat en Móvil */}
      {isMobile && (
        <Modal
          open={isChatOpen}
          onClose={toggleChat}
          aria-labelledby="chat-modal-title"
          aria-describedby="chat-modal-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '100%', sm: '90%' },
              maxWidth: 400,
              maxHeight: '90vh',
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 24,
              overflow: 'hidden',
              outline: 'none',
            }}
          >
            <RecordUploadChat isOpen={isChatOpen} onClose={toggleChat} />
          </Box>
        </Modal>
      )}

      {/* FAB flotante (móvil y visible en desktop) */}
      <Fab
        color="primary"
        onClick={toggleChat}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: theme => theme.zIndex.tooltip + 1,
          opacity: !isMobile && isChatOpen ? 0.6 : 1,
          transform: !isMobile && isChatOpen ? 'scale(0.9)' : 'scale(1)',
          transition: theme.transitions.create(['opacity', 'transform'], {
            duration: theme.transitions.duration.short,
          }),
        }}
        aria-label="Abrir chat"
      >
        {isChatOpen ? <CloseIcon /> : <ChatIcon />}
      </Fab>
    </Box>
  );
}
