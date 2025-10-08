import ClearIcon from '@mui/icons-material/CleaningServices';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import {
  Badge,
  Box,
  Chip,
  Collapse,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  useTheme
} from '@mui/material';
import React,{ useState } from 'react';

type Filters = {
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
};

export function SearchBar({
  filters,
  onFiltersChange,
}: {
  filters: Filters;
  onFiltersChange: (f: Filters) => void;
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const theme = useTheme();

  const updateFilter = (field: keyof Filters, value: any) =>
    onFiltersChange({ ...filters, [field]: value });

  const clearAll = () => onFiltersChange({ searchText: '', filterBy: 'all', category: 'all' });
  const hasActive = Boolean(filters.searchText) || filters.filterBy !== 'all' || filters.category !== 'all';

  const handleChipDelete = (type: 'search' | 'filterBy' | 'category') => {
    if (type === 'search') updateFilter('searchText', '');
    if (type === 'filterBy') updateFilter('filterBy', 'all');
    if (type === 'category') updateFilter('category', 'all');
  };

  const isBadgeVisible = hasActive && showAdvanced; // Solo visible si advanced abierto y hay filtros

  return (
    <Stack spacing={0} sx={{ width: '100%', maxWidth: 640 }}> {/* spacing: 0 para seamless */}
      {/* Paper Principal - Se extiende dinámicamente */}
      <Paper
        sx={{
          borderRadius: showAdvanced
            ? { xs: 2, sm: { topLeft: 50, topRight: 50, bottomLeft: 0, bottomRight: 0 } } // Solo top redondeado cuando expandido
            : 50, // Pill completa cuando cerrado

          overflow: 'hidden', // Evita glitches en borderRadius transition
          borderColor: 'divider',
        }}
      >
        {/* Barra de Búsqueda Superior - Siempre visible */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            px: { xs: 1.5, sm: 2 },
            py: { xs: 1, sm: 1.25 },
            mb: showAdvanced ? 2 : 0, // Espacio sutil cuando expandido (sin Divider para seamless)

          }}
        >
          <SearchIcon color="action" sx={{ mr: 1.5, flexShrink: 0 }} />
          <TextField
            placeholder="Buscar pacientes..."
            variant="standard"
            fullWidth
            value={filters.searchText}
            onChange={(e) => updateFilter('searchText', e.target.value)}
            InputProps={{
              disableUnderline: true,
              sx: { px: 1, py: 0.5, flex: 1 },
            }}
            sx={{ flex: 1, mr: 1 }} // Espacio para iconos
          />
          <IconButton
            size="small"
            onClick={() => setShowAdvanced(!showAdvanced)}
            aria-expanded={showAdvanced}
            aria-label={showAdvanced ? 'Cerrar filtros avanzados' : 'Abrir filtros avanzados'}
            sx={{ flexShrink: 0 }}
          >
            <Badge
              color="primary"
              variant="dot"
              invisible={!isBadgeVisible}
              sx={{
                '& .MuiBadge-badge': {
                  right: -8,
                  top: -4,
                },
              }}
            >
              <TuneIcon />
            </Badge>
          </IconButton>
          {hasActive && (
            <IconButton
              size="small"
              onClick={clearAll}
              aria-label="Limpiar filtros"
              sx={{
                ml: 1,
                color: 'main',
                flexShrink: 0,
              }}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          )}
        </Box>


        {/* Collapse para Filtros - Expande dentro del Paper */}
        <Collapse
          in={showAdvanced}
          timeout={theme.transitions.duration.short}
          unmountOnExit
          sx={{ px: { xs: 1.5, sm: 2 }, pb: 2 }} // Padding consistente con barra superior
        >
          {/* Selects */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ mb: hasActive ? 2 : 1 }} // Espacio antes de chips
          >
            <FormControl fullWidth size="small">
              <InputLabel>Buscar en</InputLabel>
              <Select
                value={filters.filterBy}
                onChange={(e) => updateFilter('filterBy', e.target.value)}
                label="Buscar en"
              >
                <MenuItem value="all">Todos los campos</MenuItem>
                <MenuItem value="nombre">Nombre</MenuItem>
                <MenuItem value="historiaClinica">Historia Clínica</MenuItem>
                <MenuItem value="identificacion">Identificación</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Categoría</InputLabel>
              <Select
                value={filters.category}
                onChange={(e) => updateFilter('category', e.target.value)}
                label="Categoría"
              >
                <MenuItem value="all">Todas las categorías</MenuItem>
                <MenuItem value="consultas">Consultas</MenuItem>
                <MenuItem value="estancias">Estancias</MenuItem>
                <MenuItem value="imagenes">Imágenes</MenuItem>
                <MenuItem value="insumos">Insumos</MenuItem>
                <MenuItem value="laboratorios">Laboratorios</MenuItem>
                <MenuItem value="medicamentos">Medicamentos</MenuItem>
                <MenuItem value="procedimientos">Procedimientos</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          {/* Chips de Filtros Activos */}
          {hasActive && (
            <Stack
              direction="row"
              spacing={1}
              flexWrap="wrap"
              alignItems="center"
              sx={{ px: 0 }} // Sin padding extra para seamless
            >
              {filters.searchText && (
                <Chip
                  label={`"${filters.searchText}"`}
                  onDelete={() => handleChipDelete('search')}
                  color="primary"
                  size="small"
                  variant="outlined"
                />
              )}
              {filters.filterBy !== 'all' && (
                <Chip
                  label={
                    filters.filterBy === 'nombre'
                      ? 'Nombre'
                      : filters.filterBy === 'historiaClinica'
                        ? 'Historia Clínica'
                        : 'Identificación'
                  }
                  onDelete={() => handleChipDelete('filterBy')}
                  color="success"
                  size="small"
                  variant="outlined"
                />
              )}
              {filters.category !== 'all' && (
                <Chip
                  label={filters.category.charAt(0).toUpperCase() + filters.category.slice(1)}
                  onDelete={() => handleChipDelete('category')}
                  color="secondary"
                  size="small"
                  variant="outlined"
                />
              )}
              <Box flexGrow={1} />
            </Stack>
          )}
        </Collapse>
      </Paper>
    </Stack>
  );
}
