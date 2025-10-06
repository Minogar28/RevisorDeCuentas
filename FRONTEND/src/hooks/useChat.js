import { useState } from 'react';
import { toast } from 'sonner';
import { gsUrlApi } from '../config/ConfigServer';
import * as XLSX from 'xlsx';

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Aquí almacenaremos los registros extraídos del webhook
  const [records, setRecords] = useState([]);


  // Función para mapear la API al formato de pacientes esperado por la UI
  // Dentro de useChat.ts
  // useChat.js
  // useChat.js
  const mapApiToPatients = (datos = {}) => {
    // datos = { dataClinica: [...], dataPaciente: [...] }
    const isNonEmptyStr = (v) => typeof v === 'string' && v.trim().length > 0;
    const safeArr = (x) => (Array.isArray(x) ? x : []);
    const orDash = (v) => (isNonEmptyStr(v) ? v.trim() : '—');

    const { dataPaciente = [], dataClinica = [] } = datos;

    // Mapea dataClinica a algo útil (opcional): lo llevamos a "consultas" genéricas
    const consultasClinica = safeArr(dataClinica).map((c, idx) => ({
      codigo: isNonEmptyStr(c?.Codigo?.toString?.()) ? String(c.Codigo) : `CONS-${idx + 1}`,
      descripcion: orDash(c?.Descripcion ?? c?.Nombre),
    }));

    // Cada entrada de dataPaciente se vuelve un "paciente" para la UI
    const patients = safeArr(dataPaciente).map((p, i) => {
      const est = p?.estructura ?? {};

      // --- Consultas ---
      // Ej: { codigo:"", Nombre:"CONSULTA DE URGENCIAS", clave:"CONSULTA" }
      const consultas = safeArr(est.consultas).map((c, idx) => {
        const codigoBase =
          (isNonEmptyStr(c?.clave) && c.clave) ||
          (isNonEmptyStr(c?.codigo) && c.codigo) ||
          (isNonEmptyStr(c?.Nombre) && c.Nombre) ||
          `CONS-${idx + 1}`;
        const descripcion = orDash(c?.Nombre ?? c?.clave);
        return { codigo: codigoBase, descripcion };
      });

      // --- Estancias ---
      // Ej: { codigo:"", Nombre:"SALA DE OBSERVACION", clave:"OBSERVACION" }
      const estancias = safeArr(est.estancias).map((e, idx) => {
        const codigoBase =
          (isNonEmptyStr(e?.clave) && e.clave) ||
          (isNonEmptyStr(e?.codigo) && e.codigo) ||
          (isNonEmptyStr(e?.Nombre) && e.Nombre) ||
          `EST-${idx + 1}`;
        const descripcion = orDash(e?.Nombre ?? e?.clave);
        return { codigo: codigoBase, descripcion };
      });

      // --- Medicamentos ---
      // Ej: { codigo:"", nombre:"TRAMADOL", via:"INTRAVENOSA", dosis:"...", clave:"ANALGESICO" }
      const medicamentos = safeArr(est.medicamentos).map((m, idx) => {
        const nombre = orDash(m?.nombre);
        const codigoBase =
          (isNonEmptyStr(m?.clave) && m.clave) ||
          (isNonEmptyStr(m?.codigo) && m.codigo) ||
          (isNonEmptyStr(m?.nombre) && m.nombre) ||
          `MED-${idx + 1}`;
        const partesDesc = [];
        if (isNonEmptyStr(m?.via)) partesDesc.push(m.via.trim());
        if (isNonEmptyStr(m?.dosis)) partesDesc.push(m.dosis.trim());
        return {
          codigo: codigoBase,
          descripcion: partesDesc.length ? partesDesc.join(' - ') : nombre,
        };
      });

      // --- Laboratorios / Imágenes / Insumos (vienen vacíos en tu ejemplo, pero soportamos ambos nombres: nombre/Nombre) ---
      const laboratorios = safeArr(est.laboratorios).map((l, idx) => ({
        codigo: isNonEmptyStr(l?.codigo) ? l.codigo : `LAB-${idx + 1}`,
        descripcion: orDash(l?.nombre ?? l?.Nombre),
      }));

      const imagenes = safeArr(est.imagenes).map((img, idx) => ({
        codigo: isNonEmptyStr(img?.codigo) ? img.codigo : `IMG-${idx + 1}`,
        descripcion: orDash(img?.nombre ?? img?.Nombre),
      }));

      const insumos = safeArr(est.insumos).map((ins, idx) => ({
        codigo: isNonEmptyStr(ins?.codigo) ? ins.codigo : `INS-${idx + 1}`,
        descripcion: orDash(ins?.Nombre ?? ins?.nombre),
      }));

      // Mezclamos consultas de la clínica (catálogo) al inicio si quieres enriquecer
      const consultasFinal = [...consultasClinica, ...consultas];

      return {
        // No hay nombre/HC/ID en tu payload -> valores genéricos
        nombre: `Paciente ${i + 1}`,
        historiaClinica: '—',
        identificacion: '—',
        _detalles: {
          caso: '—',
          fecha: '—',
          analisis: orDash(p?.analisis),
          plan: orDash(p?.plan),
        },
        registros: {
          consultas: consultasFinal,
          estancias,
          imagenes,
          insumos,
          laboratorios,
          medicamentos,
          procedimientos: [], // no viene en tu payload
        },
      };
    });

    // Si por alguna razón no vino dataPaciente, igual devolvemos un “paciente” con solo catálogo
    if (patients.length === 0 && consultasClinica.length > 0) {
      return [
        {
          nombre: 'Paciente 1',
          historiaClinica: '—',
          identificacion: '—',
          _detalles: { caso: '—', fecha: '—', analisis: '—', plan: '—' },
          registros: {
            consultas: consultasClinica,
            estancias: [],
            imagenes: [],
            insumos: [],
            laboratorios: [],
            medicamentos: [],
            procedimientos: [],
          },
        },
      ];
    }

    return patients;
  };





  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputText,
      timestamp: new Date(),
      status: 'sending',
    };
    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    try {
      const response = await fetch(`${gsUrlApi}/n8n/consultar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputText }),
      });

      if (!response.ok) throw new Error(`Error ${response.status}`);
      const data = await response.json();
      setMessages(prev =>
        prev.map(msg =>
          msg.id === newMessage.id ? { ...msg, status: 'sent' } : msg
        )
      );

      // ✅ Extraer registros del webhook y guardarlos
      let webhookRecords = [];
      if (data?.datos?.dataPaciente || data?.datos?.dataClinica) {
        const patients = mapApiToPatients(data.datos);
        setRecords(patients);
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          type: 'system',
          content: `Se han procesado ${patients.length} registros.`,
          timestamp: new Date(),
          status: 'processed',
        }]);
      } else if (Array.isArray(data?.datos)) {
        // fallback antiguo
        const patients = mapApiToPatients({ dataPaciente: data.datos });
        setRecords(patients);
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          type: 'system',
          content: `Se han procesado ${patients.length} registros.`,
          timestamp: new Date(),
          status: 'processed',
        }]);
      }



      toast.success('Registro procesado exitosamente');

    } catch (err) {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === newMessage.id ? { ...msg, status: 'error' } : msg
        )
      );
      toast.error(`Error al enviar: ${err.message}`);
    }
  };

  const handleFileUpload = async (event, fileInputRef) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast.error('Por favor selecciona un archivo Excel válido');
      return;
    }

    setIsUploading(true);

    const uploadMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: `📎 Archivo subido: ${file.name}`,
      timestamp: new Date(),
      status: 'sending',
    };
    setMessages(prev => [...prev, uploadMessage]);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(firstSheet);

      const batchSize = 20;
      for (let i = 0; i < rows.length; i += batchSize) {
        const batch = rows.slice(i, i + batchSize);
        const res = await fetch(`${gsUrlApi}/n8n/consultar`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ batch }),
        });
        if (!res.ok) throw new Error(`Error en batch ${i / batchSize + 1}`);
        const batchData = await res.json();

        if (Array.isArray(batchData?.datos)) {
          const patients = mapApiToPatients(batchData.datos);
          setRecords(prev => [...prev, ...patients]);

          setMessages(prev => [...prev, {
            id: Date.now().toString() + i,
            type: 'system',
            content: `Batch ${i / batchSize + 1}: ${patients.length} registros procesados.`,
            timestamp: new Date(),
            status: 'processed',
          }]);
        } else if (batchData?.datos?.content?.[0]?.text) {
          let text = batchData.datos.content[0].text;
          text = text.replace(/```json\s*/, '').replace(/```$/, '');
          const parsed = JSON.parse(text);
          const patients = mapApiToPatients(parsed);
          setRecords(prev => [...prev, ...patients]);
        }

        const batchMessage = {
          id: Date.now().toString() + i,
          type: 'system',
          content: `Batch ${i / batchSize + 1}: ${batch.length} registros procesados.`,
          timestamp: new Date(),
          status: 'processed',
        };
        setMessages(prev => [...prev, batchMessage]);
      }

      setMessages(prev =>
        prev.map(msg =>
          msg.id === uploadMessage.id ? { ...msg, status: 'sent' } : msg
        )
      );

      toast.success('Archivo procesado y enviado en batches correctamente');
    } catch (err) {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === uploadMessage.id ? { ...msg, status: 'error' } : msg
        )
      );
      toast.error(`Error al procesar archivo: ${err.message}`);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return {
    messages,
    inputText,
    setInputText,
    isUploading,
    records, // <-- registros extraídos
    handleSendMessage,
    handleFileUpload,
  };
};
