import { useState, useMemo } from 'react';

export const usePatientFilters = (patients) => {
  const [searchFilters, setSearchFilters] = useState({
    searchText: '',
    filterBy: 'all',
    category: 'all'
  });

  const filteredPatients = useMemo(() => {
    let filtered = patients;

    // Filtro por texto de búsqueda
    if (searchFilters.searchText) {
      const searchText = searchFilters.searchText.toLowerCase();
      
      filtered = filtered.filter(patient => {
        switch (searchFilters.filterBy) {
          case 'nombre':
            return patient.nombre.toLowerCase().includes(searchText);
          case 'historiaClinica':
            return patient.historiaClinica.toLowerCase().includes(searchText);
          case 'identificacion':
            return patient.identificacion.toString().includes(searchText);
          case 'all':
          default:
            return (
              patient.nombre.toLowerCase().includes(searchText) ||
              patient.historiaClinica.toLowerCase().includes(searchText) ||
              patient.identificacion.toString().includes(searchText)
            );
        }
      });
    }

    // Filtro por categoría de registros
    if (searchFilters.category !== 'all') {
      filtered = filtered.filter(patient => {
        const category = searchFilters.category;
        return patient.registros[category] && patient.registros[category].length > 0;
      });
    }

    return filtered;
  }, [patients, searchFilters]);

  return {
    searchFilters,
    setSearchFilters,
    filteredPatients
  };
};