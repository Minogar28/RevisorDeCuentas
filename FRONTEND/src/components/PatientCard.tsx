import { Card, CardContent, CardHeader, Tabs, Tab, Box, Typography, IconButton } from '@mui/material';
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from '@mui/icons-material';
import { Patient } from '../hooks/usePatient';
import { SyntheticEvent, useState } from 'react';
import React from 'react';

interface PatientCardProps {
  patient: Patient;
  isExpanded: boolean;
  onToggle: () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  value: string;
  index: string;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <Box hidden={value !== index}>
      {value === index && <Box sx={{ mt: 2 }}>{children}</Box>}
    </Box>
  );
}

export function PatientCard({ patient, isExpanded, onToggle }: PatientCardProps) {
  const [tab, setTab] = useState('consultas');

  const handleChange = (_: SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };

  const renderList = (items?: { codigo: string; descripcion: string }[]) => {
    if (!items || items.length === 0) {
      return (
        <Box
          sx={{
            fontSize: '0.875rem',
            color: 'text.secondary',
            py: 1,
            px: 2,
            bgcolor: 'grey.50',
            borderRadius: 1,
          }}
        >
          Sin registros.
        </Box>
      );
    }
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          maxHeight: 160,
          overflowY: 'auto',
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
        {items.map((item, index) => (
          <Box
            key={item.codigo ?? index}
            sx={{
              fontSize: '0.875rem',
              color: 'text.primary',
              py: 1,
              px: 2,
              borderRadius: 1,
              '&:hover': {
                bgcolor: 'grey.50',
              },
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontFamily: 'monospace',
                color: 'primary.main',
                fontWeight: 'medium',
              }}
            >
              {item.codigo}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              -
            </Typography>
            <Typography variant="body2">
              {item.descripcion}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Card
      sx={{
        width: '100%',
        bgcolor: 'background.paper',
        border: 1,
        borderColor: 'grey.200',
        borderRadius: 2,
        boxShadow: 1,
        '&:hover': {
          boxShadow: 2,
          transition: 'box-shadow 0.2s ease-in-out',
        },
      }}
    >
      <CardHeader
        sx={{
          pb: 2,
          cursor: 'pointer',
          userSelect: 'none',
        }}
        onClick={onToggle}
        action={
          <IconButton
            onClick={onToggle}
            aria-label={isExpanded ? 'Contraer tarjeta del paciente' : 'Expandir tarjeta del paciente'}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                color: 'text.primary',
              },
            }}
          >
            {isExpanded ? (
              <KeyboardArrowUpIcon sx={{ fontSize: 24 }} />
            ) : (
              <KeyboardArrowDownIcon sx={{ fontSize: 24 }} />
            )}
          </IconButton>
        }
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography variant="body2" color="text.secondary">
                  HC:
                </Typography>
                <Typography variant="body1" color="text.primary">
                  {patient?.historiaClinica ?? '—'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography variant="body2" color="text.secondary">
                  ID:
                </Typography>
                <Typography variant="body1" color="text.primary">
                  {patient?.identificacion ?? '—'}
                </Typography>
              </Box>
            </Box>
            <Typography variant="h6" color="text.primary" sx={{ fontWeight: 'bold' }}>
              {patient?.nombre ?? 'Paciente'}
            </Typography>
          </Box>
        </Box>
      </CardHeader>

      {isExpanded && (
        <CardContent sx={{ pt: 0 }}>
          <Tabs
            value={tab}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              mb: 2,
            }}
          >
            <Tab value="consultas" label="CONSULTAS" />
            <Tab value="estancias" label="ESTANCIAS" />
            <Tab value="imagenes" label="IMÁGENES" />
            <Tab value="insumos" label="INSUMOS" />
            <Tab value="laboratorios" label="LABORATORIOS" />
            <Tab value="medicamentos" label="MEDICAMENTOS" />
            <Tab value="procedimientos" label="PROCEDIMIENTOS" />
          </Tabs>

          <TabPanel value={tab} index="consultas">
            {renderList(patient?.registros?.consultas)}
          </TabPanel>
          <TabPanel value={tab} index="estancias">
            {renderList(patient?.registros?.estancias)}
          </TabPanel>
          <TabPanel value={tab} index="imagenes">
            {renderList(patient?.registros?.imagenes)}
          </TabPanel>
          <TabPanel value={tab} index="insumos">
            {renderList(patient?.registros?.insumos)}
          </TabPanel>
          <TabPanel value={tab} index="laboratorios">
            {renderList(patient?.registros?.laboratorios)}
          </TabPanel>
          <TabPanel value={tab} index="medicamentos">
            {renderList(patient?.registros?.medicamentos)}
          </TabPanel>
          <TabPanel value={tab} index="procedimientos">
            {renderList(patient?.registros?.procedimientos)}
          </TabPanel>
        </CardContent>
      )}
    </Card>
  );
}
