import { useState, useCallback } from 'react';

interface Patient {
  historiaClinica: string;
  identificacion: number;
  nombre: string;
  registros: {
    consultas: Array<{ codigo: string; descripcion: string }>;
    estancias: Array<{ codigo: string; descripcion: string }>;
    imagenes: Array<{ codigo: string; descripcion: string }>;
    insumos: Array<{ codigo: string; descripcion: string }>;
    laboratorios: Array<{ codigo: string; descripcion: string }>;
    medicamentos: Array<{ codigo: string; descripcion: string }>;
    procedimientos: Array<{ codigo: string; descripcion: string }>;
  };
}

// Datos mock de pacientes
const mockPatients: Patient[] = [
  {
    historiaClinica: "HC001234",
    identificacion: 12345678,
    nombre: "María Elena Rodríguez García",
    registros: {
      consultas: [
        { codigo: "CON001", descripcion: "Consulta de medicina general" },
        { codigo: "CON002", descripcion: "Consulta de cardiología" },
        { codigo: "CON003", descripcion: "Consulta de control postoperatorio" }
      ],
      estancias: [
        { codigo: "EST001", descripcion: "Hospitalización en medicina interna" },
        { codigo: "EST002", descripcion: "Estancia en UCI" }
      ],
      imagenes: [
        { codigo: "IMG001", descripcion: "Radiografía de tórax PA y lateral" },
        { codigo: "IMG002", descripcion: "Tomografía computarizada de abdomen" },
        { codigo: "IMG003", descripcion: "Ecografía abdominal total" }
      ],
      insumos: [
        { codigo: "INS001", descripcion: "Gasas estériles 10x10 cm" },
        { codigo: "INS002", descripcion: "Suero fisiológico 500ml" },
        { codigo: "INS003", descripcion: "Guantes de nitrilo talla M" }
      ],
      laboratorios: [
        { codigo: "LAB001", descripcion: "Hemograma completo" },
        { codigo: "LAB002", descripcion: "Química sanguínea" },
        { codigo: "LAB003", descripcion: "Perfil lipídico" },
        { codigo: "LAB004", descripcion: "Examen general de orina" }
      ],
      medicamentos: [
        { codigo: "MED001", descripcion: "Acetaminofén 500mg tabletas" },
        { codigo: "MED002", descripcion: "Omeprazol 20mg cápsulas" },
        { codigo: "MED003", descripcion: "Atorvastatina 40mg tabletas" }
      ],
      procedimientos: [
        { codigo: "PROC001", descripcion: "Electrocardiograma de 12 derivaciones" },
        { codigo: "PROC002", descripcion: "Punción venosa periférica" },
        { codigo: "PROC003", descripcion: "Toma de signos vitales" }
      ]
    }
  }
];

export interface UsePatientReturn {
  patients: Patient[];
  expandedPatientId: number | null;
  setExpandedPatientId: (id: number | null) => void;
  togglePatient: (id: number) => void;
  getPatientById: (id: number) => Patient | undefined;
  addPatient: (patient: Patient) => void;
  updatePatient: (id: number, updatedPatient: Partial<Patient>) => void;
}

export function usePatient(): UsePatientReturn {
  const [patients] = useState<Patient[]>(mockPatients);
  const [expandedPatientId, setExpandedPatientId] = useState<number | null>(null);

  const togglePatient = useCallback((id: number) => {
    setExpandedPatientId(prev => prev === id ? null : id);
  }, []);

  const getPatientById = useCallback((id: number) => {
    return patients.find(patient => patient.identificacion === id);
  }, [patients]);

  const addPatient = useCallback((patient: Patient) => {
    // En un entorno real, esto haría una petición al backend
    console.log('Agregar paciente:', patient);
  }, []);

  const updatePatient = useCallback((id: number, updatedPatient: Partial<Patient>) => {
    // En un entorno real, esto haría una petición al backend
    console.log('Actualizar paciente:', id, updatedPatient);
  }, []);

  return {
    patients,
    expandedPatientId,
    setExpandedPatientId,
    togglePatient,
    getPatientById,
    addPatient,
    updatePatient
  };
}

export type { Patient };