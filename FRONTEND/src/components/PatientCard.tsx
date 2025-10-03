import { useState, SyntheticEvent } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Tabs,
  Tab,
  Box,
  Typography,
  Stack,
  Collapse,
} from '@mui/material';
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from '@mui/icons-material';
import React from 'react';
import { Patient } from '../hooks/usePatient';

type RegistroItem = { codigo: string; descripcion: string };

interface PatientCardProps {
  patient: Patient;
}

export function PatientCard({ patient }: PatientCardProps) {
  const categories = [
    { key: 'consultas', label: 'Consultas' },
    { key: 'estancias', label: 'Estancias' },
    { key: 'imagenes', label: 'Imágenes' },
    { key: 'insumos', label: 'Insumos' },
    { key: 'laboratorios', label: 'Laboratorios' },
    { key: 'medicamentos', label: 'Medicamentos' },
    { key: 'procedimientos', label: 'Procedimientos' },
  ] as const;

  const [tabValue, setTabValue] = useState<string>(categories[0].key);
  const [headerExpanded, setHeaderExpanded] = useState(false);

  const handleTabChange = (_e: SyntheticEvent, newValue: string) => setTabValue(newValue);

  return (
    <Card sx={{ width: '100%', borderRadius: 3, border: 1, borderColor: 'grey.200', overflow: 'hidden' }}>
      {/* Cabecera plegable */}
      <CardHeader
        onClick={() => setHeaderExpanded(prev => !prev)}
        sx={{ bgcolor: 'primary.50', cursor: 'pointer', userSelect: 'none' }}
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h5" color="primary.main" sx={{ fontWeight: 'bold' }}>
              {patient.nombre}
            </Typography>
            {headerExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </Box>
        }
        subheader={
          <Typography variant="subtitle1" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
            HC: {patient.historiaClinica} | ID: {patient.identificacion}
          </Typography>
        }
      />

      <Collapse in={headerExpanded} timeout="auto" unmountOnExit>
        <CardContent sx={{ pt: 2 }}>
          {/* Tabs horizontales */}
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              mb: 2,
              bgcolor: 'grey.50',
              borderRadius: 2,
              px: 1,
              '& .MuiTab-root': {
                textTransform: 'uppercase',
                fontSize: '0.75rem',
                minHeight: 'auto',
                px: 2,
                py: 1,
                borderRadius: 1,
                color: 'text.secondary',
                '&.Mui-selected': {
                  color: 'primary.main',
                  bgcolor: 'primary.100',
                  fontWeight: 600,
                },
              },
            }}
          >
            {categories.map(({ key, label }) => (
              <Tab key={key} value={key} label={label} />
            ))}
          </Tabs>

          {/* Panel de registros */}
          {categories.map(({ key, label }) => (
            <Box
              key={key}
              hidden={tabValue !== key}
              sx={{
                maxHeight: 200, // Altura fija para que el contenido haga scroll
                overflowY: 'auto',
              }}
            >
              <Typography variant="subtitle1" color="primary.main" sx={{ mb: 1 }}>
                {label}
              </Typography>
              <Stack spacing={1}>
                {(patient.registros[key] as RegistroItem[]).map((item, index) => (
                  <Typography key={index} variant="body2" sx={{ fontFamily: 'monospace', color: 'text.primary' }}>
                    {item.codigo} - {item.descripcion}
                  </Typography>
                ))}
              </Stack>
            </Box>
          ))}
        </CardContent>
      </Collapse>
    </Card>
  );
}
