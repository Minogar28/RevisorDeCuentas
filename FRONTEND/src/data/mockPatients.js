export const mockPatients = [
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
  },
  {
    historiaClinica: "HC005678",
    identificacion: 87654321,
    nombre: "Carlos Andrés Martínez López",
    registros: {
      consultas: [
        { codigo: "CON004", descripcion: "Consulta de ortopedia" },
        { codigo: "CON005", descripcion: "Consulta de fisiatría" }
      ],
      estancias: [
        { codigo: "EST003", descripcion: "Hospitalización en ortopedia" }
      ],
      imagenes: [
        { codigo: "IMG004", descripcion: "Resonancia magnética de rodilla" },
        { codigo: "IMG005", descripcion: "Radiografía de miembro inferior" }
      ],
      insumos: [
        { codigo: "INS004", descripcion: "Vendaje elástico 10cm" },
        { codigo: "INS005", descripcion: "Hielo terapéutico" }
      ],
      laboratorios: [
        { codigo: "LAB005", descripcion: "Marcadores inflamatorios" },
        { codigo: "LAB006", descripcion: "Factor reumatoideo" }
      ],
      medicamentos: [
        { codigo: "MED004", descripcion: "Ibuprofeno 600mg tabletas" },
        { codigo: "MED005", descripcion: "Diclofenaco gel 1%" }
      ],
      procedimientos: [
        { codigo: "PROC004", descripcion: "Infiltración articular" },
        { codigo: "PROC005", descripcion: "Fisioterapia de rodilla" }
      ]
    }
  },
  {
    historiaClinica: "HC009012",
    identificacion: 45678912,
    nombre: "Ana Sofía Herrera Vargas",
    registros: {
      consultas: [
        { codigo: "CON006", descripcion: "Consulta de ginecología" },
        { codigo: "CON007", descripcion: "Control prenatal" }
      ],
      estancias: [
        { codigo: "EST004", descripcion: "Hospitalización obstétrica" }
      ],
      imagenes: [
        { codigo: "IMG006", descripcion: "Ecografía obstétrica" },
        { codigo: "IMG007", descripcion: "Doppler fetal" }
      ],
      insumos: [
        { codigo: "INS006", descripcion: "Compresas obstétricas" },
        { codigo: "INS007", descripcion: "Catéter urinario" }
      ],
      laboratorios: [
        { codigo: "LAB007", descripcion: "Perfil prenatal completo" },
        { codigo: "LAB008", descripcion: "Cultivo vaginal" }
      ],
      medicamentos: [
        { codigo: "MED006", descripcion: "Ácido fólico 5mg tabletas" },
        { codigo: "MED007", descripcion: "Sulfato ferroso 300mg" }
      ],
      procedimientos: [
        { codigo: "PROC006", descripcion: "Monitoreo fetal" },
        { codigo: "PROC007", descripcion: "Cesárea" }
      ]
    }
  }
];