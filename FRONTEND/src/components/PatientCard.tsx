// src/components/PatientCard.tsx
import React, { useState } from 'react';
import {
  Box, Paper, Typography, Stack, IconButton, Tabs, Tab, Divider,
  List, ListItem, ListItemText
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

type Registro = {
  codigo?: string | number;
  Codigo?: string | number;
  Descripcion?: string;
  descripción?: string;        // por si llega con tilde minúscula
  Descripción?: string;        // por si llega con tilde mayúscula
  descripcion?: string;
  DescripcionArticulo?: string;
  descripcionArticulo?: string;
  via?: string;
  dosis?: string;
  // presentes pero no se usan salvo como fallback cuando no hay Descripcion:
  clave?: string;
  Nombre?: string;
  nombre?: string;
};

type Paciente = {
  NumHistoria?: string;
  Id?: string;
  caso?: string;
  Fecha?: string;
  Sexo?: string;
  Edad?: string;
  estructura?: {
    consultas?: Registro[];
    estancias?: Registro[];
    laboratorios?: Registro[];
    imagenes?: Registro[];
    medicamentos?: Registro[];
    insumos?: Registro[];
  };
};

type Props = {
  patient: Paciente;
  isExpanded?: boolean;
  onToggle?: () => void;
};

function TabPanel({ value, index, children }: { value: number; index: number; children: React.ReactNode }) {
  if (value !== index) return null;
  return <Box sx={{ py: 1.5 }}>{children}</Box>;
}

export const PatientCard: React.FC<Props> = ({ patient, isExpanded = false, onToggle }) => {
  const [tab, setTab] = useState(0);
  const est = patient?.estructura || {};
  const {
    consultas = [],
    estancias = [],
    laboratorios = [],
    imagenes = [],
    medicamentos = [],
    insumos = [],
  } = est;

  // Render genérico: codigo + Descripcion; en meds agrega via + dosis
  const renderLista = (arr: Registro[], opts?: { tipo?: 'meds' }) => {
    if (!Array.isArray(arr) || arr.length === 0) {
      return (
        <Typography variant="body2" color="text.secondary" sx={{ px: 2, py: 1 }}>
          No hay registros
        </Typography>
      );
    }

    return (
      <List dense disablePadding sx={{ px: 1 }}>
        {arr.map((it, i) => {
          // Código puede venir como string o número y con distintas keys
          const cod = (it.codigo ?? it.Codigo ?? '') + '';

          // Variantes de descripción desde distintos backends
          const descRaw =
            it.Descripcion ??
            it.Descripción ??
            it.descripción ??
            it.descripcion ??
            it.DescripcionArticulo ??
            it.descripcionArticulo ??
            '';

          // Si no hay descripción, usar fallback (Nombre/nombre/clave)
          const desc =
            (descRaw && String(descRaw).trim()) ||
            it.Nombre ||
            it.nombre ||
            it.clave ||
            '';

          // Línea principal con guion si hay ambos
          const primary =
            cod && desc ? `${cod} - ${desc}` :
              cod ? cod :
                desc || '—';

          // Secundaria solo para medicamentos
          const secondary =
            opts?.tipo === 'meds'
              ? [it.via, it.dosis].filter(Boolean).join(' • ')
              : undefined;

          return (
            <ListItem key={`${cod || desc || 'row'}-${i}`} disableGutters>
              <ListItemText
                primary={primary}
                secondary={secondary}
                primaryTypographyProps={{ variant: 'body2' }}
                secondaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
              />
            </ListItem>
          );
        })}
      </List>
    );
  };

  return (
    <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
  {/* Header */}
  <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <Stack spacing={0.3}>
      <Typography variant="h6" sx={{ lineHeight: 1.1 }}>
        Caso {patient?.caso ?? '—'}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        HC: {patient?.NumHistoria ?? '—'} &nbsp; | &nbsp; ID: {patient?.Id ?? '—'}
      </Typography>
    </Stack>
    <IconButton onClick={onToggle} size="small" aria-label="expandir">
      {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
    </IconButton>
  </Box>

  {isExpanded && (
    <>
      <Divider />

      {/* Layout vertical */}
      <Box sx={{ display: 'flex', minHeight: 300 }}>
        {/* Tabs verticales */}
        <Tabs
          orientation="vertical"
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="scrollable"
          sx={{
            borderRight: 1,
            borderColor: 'divider',
            minWidth: 160,
            bgcolor: 'background.paper',
            pt: 2,
          }}
        >
          <Tab label="Consultas" id="tab-0" />
          <Tab label="Estancias" id="tab-1" />
          <Tab label="Laboratorios" id="tab-2" />
          <Tab label="Imágenes" id="tab-3" />
          <Tab label="Medicamentos" id="tab-4" />
          <Tab label="Insumos" id="tab-5" />
        </Tabs>

        {/* Contenido */}
        <Box sx={{ flexGrow: 1, px: 3, py: 2 }}>
          <TabPanel value={tab} index={0}>{renderLista(consultas)}</TabPanel>
          <TabPanel value={tab} index={1}>{renderLista(estancias)}</TabPanel>
          <TabPanel value={tab} index={2}>{renderLista(laboratorios)}</TabPanel>
          <TabPanel value={tab} index={3}>{renderLista(imagenes)}</TabPanel>
          <TabPanel value={tab} index={4}>{renderLista(medicamentos, { tipo: 'meds' })}</TabPanel>
          <TabPanel value={tab} index={5}>{renderLista(insumos)}</TabPanel>
        </Box>
      </Box>
    </>
  )}
</Paper>

  );
};
