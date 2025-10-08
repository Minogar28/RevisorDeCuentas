// useChat.js
import { useState } from 'react';
import { toast } from 'sonner';
import { gsUrlApi } from '../config/ConfigServer';
import * as XLSX from 'xlsx';

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Estados para la barra de carga en el chat
  const [isProcessing, setIsProcessing] = useState(false); // para solicitudes de texto
  const [uploadProgress, setUploadProgress] = useState({ processed: 0, total: 0 });

  // Data que llega del webhook
  const [records, setRecords] = useState([]);

  const toArray = (x) => (Array.isArray(x) ? x : x ? [x] : []);
  const ok = (r) => r && typeof r === 'object';

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputText,
      timestamp: new Date(),
      status: 'sending',
    };
    setMessages((prev) => [...prev, newMessage]);
    setInputText('');
    setIsProcessing(true);

    try {
      const response = await fetch(`${gsUrlApi}/n8n/consultar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputText }),
      });

      if (!response.ok) throw new Error(`Error ${response.status}`);
      const data = await response.json();

      setMessages((prev) =>
        prev.map((m) => (m.id === newMessage.id ? { ...m, status: 'sent' } : m))
      );

      let incoming = data && data.datos;
      if (incoming && (incoming.dataPaciente || incoming.dataClinica)) {
        incoming = incoming.dataPaciente || [];
      }

      if (incoming) {
        const items = toArray(incoming).filter(ok);
        setRecords((prev) => [...prev, ...items]);
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            type: 'system',
            content: `Se han procesado ${items.length} registros.`,
            timestamp: new Date(),
            status: 'processed',
          },
        ]);
      }

      toast.success('Registro procesado exitosamente');
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) => (m.id === newMessage.id ? { ...m, status: 'error' } : m))
      );
      toast.error(`Error al enviar: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

 const handleFileUpload = async (event, fileInputRef) => {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
    toast.error('Por favor selecciona un archivo Excel válido');
    return;
  }

  setIsUploading(true);
  setUploadProgress({ processed: 0, total: 0 });

  const uploadMessage = {
    id: Date.now().toString(),
    type: 'user',
    content: `📎 Archivo subido: ${file.name}`,
    timestamp: new Date(),
    status: 'sending',
  };
  setMessages((prev) => [...prev, uploadMessage]);

  try {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Si tu archivo TIENE encabezado real en la primera fila, deja range: 1.
    // Si NO tiene encabezado, usa range: 0.
    let rows = XLSX.utils.sheet_to_json(sheet, {
      header: ["Analisis", "PlanTratamiento"],
      range: 1,   // <-- cambia a 0 si no hay encabezado en Excel
      defval: ""
    });

    rows = rows.filter(r => String(r.Analisis).trim() || String(r.PlanTratamiento).trim());

    const total = rows.length;
    setUploadProgress({ processed: 0, total });

    for (let i = 0; i < total; i++) {
      const row = rows[i];
      const analisis = String(row.Analisis ?? "").trim();
      const plan = String(row.PlanTratamiento ?? "").trim();

      const inputText = `Analisis: ${analisis}\nPlanTratamiento: ${plan}`;

      const res = await fetch(`${gsUrlApi}/n8n/consultar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputText }),
      });

      if (res.ok) {
        const data = await res.json();
        let incoming = data?.datos;
        if (incoming?.dataPaciente || incoming?.dataClinica) {
          incoming = incoming?.dataPaciente || [];
        }
        if (incoming) {
          const items = (Array.isArray(incoming) ? incoming : [incoming])
            .filter(x => x && typeof x === 'object');
          if (items.length) setRecords(prev => [...prev, ...items]);
        }
      } else {
        // opcional: log/alert del error por fila
        // const errText = await res.text().catch(() => '');
        // console.warn('Fila fallida', i+1, errText);
      }

      setUploadProgress({ processed: i + 1, total });
    }

    setMessages((prev) => [
      ...prev,
      {
        id: `${uploadMessage.id}-done`,
        type: 'system',
        content: `Completado: ${total}/${total} filas procesadas.`,
        timestamp: new Date(),
        status: 'processed',
      },
    ]);

    setMessages((prev) =>
      prev.map((m) => (m.id === uploadMessage.id ? { ...m, status: 'sent' } : m))
    );
    toast.success('Archivo procesado fila por fila');
  } catch (err) {
    setMessages((prev) =>
      prev.map((m) => (m.id === uploadMessage.id ? { ...m, status: 'error' } : m))
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
    isProcessing,
    uploadProgress,
    records,
    handleSendMessage,
    handleFileUpload,
  };
};
