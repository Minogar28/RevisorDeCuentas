import { useState, SyntheticEvent, useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  Tabs,
  Tab,
  Button,
  Box,
  Typography,
  Stack,
  Grid,
  Chip,
  Paper,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { Layout } from '../layouts/Layout';
import { usePatient } from '../hooks/usePatient';
import { useChat } from '../hooks/useChat';
type RegistroItem = { codigo: string; descripcion: string };

function a11yProps(index: string) {
  return {
    id: `patient-tab-${index}`,
    'aria-controls': `patient-tabpanel-${index}`,
  };
}

function TabPanel(props: { children?: React.ReactNode; value: string; index: string }) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`patient-tabpanel-${index}`}
      aria-labelledby={`patient-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 0 }}>{children}</Box>}
    </Box>
  );
}

export function PatientPage() {
  const { id } = useParams<{ id: string }>();
  const { getPatientById } = usePatient();
  const [isEditing, setIsEditing] = useState(false);
  const { messages, records } = useChat();

  const patientId = id ? parseInt(id) : undefined;
  const patient = patientId ? getPatientById(patientId) : undefined;

  const categories = useMemo(
    () =>
      ([
        { key: 'consultas', label: 'CONSULTAS' },
        { key: 'estancias', label: 'ESTANCIAS' },
        { key: 'imagenes', label: 'IMÁGENES' },
        { key: 'insumos', label: 'INSUMOS' },
        { key: 'laboratorios', label: 'LABORATORIOS' },
        { key: 'medicamentos', label: 'MEDICAMENTOS' },
        { key: 'procedimientos', label: 'PROCEDIMIENTOS' },
      ] as const),
    []
  );

  const [tabValue, setTabValue] = useState<string>(categories[0].key);

  if (!patient) {
    return <Navigate to="/" replace />;
  }

  const handleGoBack = () => window.history.back();
  const handleEdit = () => setIsEditing((v) => !v);
  const handleChange = (_e: SyntheticEvent, newValue: string) => setTabValue(newValue);

  const renderList = (items?: RegistroItem[]) => {
    if (!items || items.length === 0) {
      return (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontStyle: 'italic',
            textAlign: 'center',
            py: 8,
          }}
        >
          No hay registros para esta categoría
        </Typography>
      );
    }
    return (
      <Stack spacing={3}>
        {items.map((item, index) => (
          <Paper
            key={item?.codigo ?? index}
            elevation={0}
            sx={{
              border: 1,
              borderColor: 'grey.200',
              borderRadius: 2,
              p: 4,
              transition: 'background-color 0.2s ease',
              '&:hover': {
                bgcolor: 'grey.50',
              },
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
              <Stack spacing={1}>
                <Chip
                  label={item?.codigo}
                  size="small"
                  sx={{
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    bgcolor: 'primary.50',
                    color: 'primary.main',
                    borderRadius: 1,
                  }}
                />
                <Typography variant="body1" color="text.primary">
                  {item?.descripcion}
                </Typography>
              </Stack>
              {isEditing && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<EditIcon sx={{ fontSize: 16 }} />}
                  sx={{
                    minWidth: 'auto',
                    px: 2,
                    borderColor: 'grey.300',
                    color: 'text.primary',
                    '&:hover': {
                      borderColor: 'primary.main',
                      color: 'primary.main',
                    },
                  }}
                >
                  Editar
                </Button>
              )}
            </Box>
          </Paper>
        ))}
      </Stack>
    );
  };

  return (
    <Layout
      title={`Paciente: ${patient.nombre}`}
      subtitle={`HC: ${patient.historiaClinica} | ID: ${patient.identificacion}`}
    >
      <Stack spacing={6} sx={{ width: '100%' }}>
        {/* Navigation */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            variant="outlined"
            onClick={handleGoBack}
            startIcon={<ArrowBackIcon />}
            sx={{
              borderColor: 'grey.300',
              color: 'text.primary',
              borderRadius: 2,
              px: 2,
              py: 1,
              '&:hover': {
                borderColor: 'primary.main',
                color: 'primary.main',
                bgcolor: 'primary.50',
              },
            }}
          >
            Volver
          </Button>

          <Button
            onClick={handleEdit}
            variant={isEditing ? 'contained' : 'outlined'}
            startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
            sx={{
              borderRadius: 2,
              px: 2,
              py: 1,
              bgcolor: isEditing ? 'primary.main' : 'transparent',
              borderColor: isEditing ? 'primary.main' : 'grey.300',
              color: isEditing ? 'common.white' : 'text.primary',
              '&:hover': {
                bgcolor: isEditing ? 'primary.dark' : 'primary.50',
                borderColor: 'primary.main',
                color: isEditing ? 'common.white' : 'primary.main',
              },
            }}
          >
            {isEditing ? 'Guardar' : 'Editar'}
          </Button>
        </Box>

        {/* Patient Details */}
        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            border: 1,
            borderColor: 'grey.200',
            bgcolor: 'background.paper',
          }}
        >
          <CardHeader
            sx={{
              pb: 3,
              bgcolor: 'primary.50',
              borderBottom: 1,
              borderColor: 'primary.100',
            }}
            title={
              <Stack spacing={2}>
                <Typography variant="h5" color="primary.main">
                  Información del Paciente
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Historia Clínica:
                    </Typography>
                    <Typography variant="body1" sx={{ fontFamily: 'monospace', color: 'text.primary' }}>
                      {patient.historiaClinica}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Identificación:
                    </Typography>
                    <Typography variant="body1" sx={{ fontFamily: 'monospace', color: 'text.primary' }}>
                      {patient.identificacion}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Nombre Completo:
                    </Typography>
                    <Typography variant="body1" color="text.primary">
                      {patient.nombre}
                    </Typography>
                  </Grid>
                </Grid>
              </Stack>
            }
          />

          <CardContent sx={{ pt: 0 }}>
            {/* Tabs */}
            <Tabs
              value={tabValue}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="Tabs de registros del paciente"
              sx={{
                mb: 3,
                bgcolor: 'grey.50',
                borderRadius: 2,
                p: 0.5,
                minHeight: 'auto',
                '& .MuiTab-root': {
                  fontSize: '0.75rem',
                  px: 2,
                  py: 1,
                  minHeight: 'auto',
                  textTransform: 'uppercase',
                  color: 'text.secondary',
                  '&.Mui-selected': {
                    color: 'primary.main',
                    bgcolor: 'primary.100',
                    borderRadius: 1,
                  },
                },
              }}
            >
              {categories.map(({ key, label }) => (
                <Tab
                  key={key}
                  value={key}
                  label={label}
                  {...a11yProps(key)}
                />
              ))}
            </Tabs>

            {/* Tab Panels */}
            <Box sx={{ mt: 3 }}>
              {categories.map(({ key }) => (
                <TabPanel key={key} value={tabValue} index={key}>
                  <Stack spacing={3}>
                    <Typography
                      variant="h6"
                      color="text.primary"
                      sx={{ textTransform: 'capitalize' }}
                    >
                      {key}
                    </Typography>
                    {renderList(records)}
                  </Stack>
                </TabPanel>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Stack>
    </Layout>
  );
}
