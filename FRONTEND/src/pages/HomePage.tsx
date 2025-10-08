import React, { useState, useCallback, useEffect } from 'react';
import {
  Box, Container, Grid, Paper, Typography, Button, Badge, Fab, Stack, useTheme, Chip, FormControlLabel, Switch
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PageviewIcon from '@mui/icons-material/Pageview';
import CloseIcon from '@mui/icons-material/Close';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { SearchBar } from '../components/SearchBar';
import { PatientCard } from '../components/PatientCard';
import { RecordUploadChat } from '../components/RecordUploadChat';
import { usePatientFilters } from '../hooks/usePatientFilters';
import { useResponsive } from '../hooks/useResponsive';
import { useChat } from '../hooks/useChat';

export default function HomePage() {
  const [expandedPatientId, setExpandedPatientId] = useState<string | number | null>(null);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  const chat = useChat();
  const { records = [] } = chat;
  const { isMobile } = useResponsive();
  const theme = useTheme();

  const { searchFilters, setSearchFilters, filteredPatients } = usePatientFilters(records);

  const togglePatient = useCallback((id: string | number) => {
    setExpandedPatientId(prev => (prev === id ? null : id));
  }, []);

  const toggleChat = useCallback(() => setIsChatOpen(prev => !prev), []);

  useEffect(() => {
    if (!isMobile) setIsChatOpen(true);
  }, [isMobile]);

  const panelHeight = isMobile ? 'calc(100vh - 200px)' : 'calc(100vh - 260px)';

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <Box sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider', py: 2 }}>
        <Container maxWidth="lg">
          <Typography variant="h5" color="text.primary">Sistema Clínico</Typography>
          <Typography variant="body1" color="text.secondary">Gestión y carga de registros médicos</Typography>
        </Container>
      </Box>

      {/* Main */}
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3 } }}>
        {/* Search Bar */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Box sx={{ width: '100%', maxWidth: 720 }}>
            <SearchBar filters={searchFilters} onFiltersChange={setSearchFilters} />
          </Box>
        </Box>

        <Grid container spacing={2} sx={{ height: panelHeight }}>
          {/* Panel izquierdo (carga/“chat”) */}
          {isChatOpen && (
            <Grid
              item
              xs={12}
              lg={4}
              sx={{
                height: { xs: '50vh', lg: '100%' },
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <RecordUploadChat chat={chat} />
              </Box>
            </Grid>
          )}

          {/* Contenido principal */}
          <Grid
            item
            xs={12}
            lg={isMobile ? 12 : isChatOpen ? 8 : 12}
            sx={{
              transition: (t) => t.transitions.create(['width'], { duration: t.transitions.duration.standard }),
              borderRadius: 3,
              height: { xs: 'auto', lg: '100%' },
              display: 'flex',
              flexDirection: 'column',
              maxWidth: '100%',
              overflow: 'auto',
            }}
          >
            <Paper
              variant="outlined"
              sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3, overflow: 'hidden' }}
            >
              {/* Header listado */}
              <Box
                sx={{
                  bgcolor: (t) => (t.palette.mode === 'light' ? 'primary.50' : 'action.hover'),
                  borderColor: 'divider',
                  px: 2,
                  py: 1.5,
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Typography variant="h6" fontWeight={700} color="primary.main">
                      Registros de Pacientes
                    </Typography>
                    {filteredPatients.length !== records.length && (
                      <Badge
                        color="secondary"
                        badgeContent={`${filteredPatients.length}/${records.length}`}
                        sx={{ '& .MuiBadge-badge': { right: -10 } }}
                      />
                    )}
                  </Stack>



                  <FormControlLabel
                    control={
                      <Switch
                        checked={isChatOpen}
                        onChange={toggleChat}
                        color="primary"
                        sx={{
                          '& .MuiSwitch-thumb': {
                            transition: 'all 0.3s ease',
                          },
                        }}
                      />
                    }
                    label={isChatOpen ? 'Cargar registros' : 'Ocultar cargue'}
                    sx={{
                      ml: 2,
                      '.MuiTypography-root': {
                        fontWeight: 500,
                        color: isChatOpen ? 'primary.main' : 'text.secondary',
                        transition: 'color 0.3s ease',
                      },
                    }}
                  />
                </Stack>
              </Box>

              {/* Lista con scroll interno */}
              <Box sx={{ p: { xs: 2, sm: 3 }, overflowY: 'auto', flexGrow: 1, minHeight: 0 }}>
                {records.length === 0 ? (
                  <Stack spacing={2} alignItems="center" textAlign="center" sx={{ py: 6 }}>
                    <Box
                      sx={{
                        width: 64, height: 64, borderRadius: '50%',
                        bgcolor: 'action.hover', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <PageviewIcon color="disabled" />
                    </Box>
                    <Typography variant="subtitle1">Empieza cargando registros o realiza una búsqueda</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Usa el chat o el botón para cargar archivos Excel y visualizar pacientes.
                    </Typography>
                  </Stack>
                ) : filteredPatients.length ? (
                  <Stack spacing={2}>
                    {filteredPatients.map((patient, idx) => {
                      const pid = patient?.caso ?? patient?.Id ?? patient?.NumHistoria ?? idx;
                      return (
                        <PatientCard
                          key={String(pid)}
                          patient={patient}
                          isExpanded={expandedPatientId === pid}
                          onToggle={() => togglePatient(pid)}
                        />
                      );
                    })}
                   
                  </Stack>
                ) : (
                  <Stack spacing={2} alignItems="center" textAlign="center" sx={{ py: 6 }}>

                    <SearchIcon color="disabled" />
                    <Typography variant="subtitle1">No se encontraron pacientes</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Ajusta los filtros de búsqueda o verifica los criterios utilizados.
                    </Typography>
                  </Stack>
                )}

              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>



    </Box>
  );
}
