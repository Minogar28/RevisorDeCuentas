import { useState } from 'react';
import { toast } from 'sonner';
import { gsUrlApi } from '../config/ConfigServer';
import * as XLSX from 'xlsx';

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // 👉 Aquí guardamos la data EXACTA que llega del webhook
  const [records, setRecords] = useState([]);

  // Helpers mínimos (sin “vibe coding”)
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

      // ✅ Guardar tal cual lo que venga en data.datos (acumulando = multiple carga)
      let incoming = data?.datos;

      // Soporte legado: si viene { dataPaciente, dataClinica }, tomamos dataPaciente TAL CUAL
      if (incoming?.dataPaciente || incoming?.dataClinica) {
        incoming = incoming?.dataPaciente ?? [];
      }

      if (incoming) {
        const items = toArray(incoming).filter(ok);
        // ⬇️ acumular en vez de reemplazar
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
    setMessages((prev) => [...prev, uploadMessage]);

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
        let incoming = batchData?.datos;

        // ✅ Guardar tal cual venga (acumulando)
        if (incoming) {
          // también soporta respuesta como texto JSON legacy
          if (incoming?.content?.[0]?.text) {
            let text = incoming.content[0].text;
            text = text.replace(/```json\s*/i, '').replace(/```$/, '');
            incoming = JSON.parse(text);
          }
          // si viniera { dataPaciente, ... } en batch
          if (incoming?.dataPaciente || incoming?.dataClinica) {
            incoming = incoming?.dataPaciente ?? [];
          }

          const items = toArray(incoming).filter(ok);
          setRecords((prev) => [...prev, ...items]);
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString() + i,
              type: 'system',
              content: `Batch ${i / batchSize + 1}: ${items.length} registros procesados.`,
              timestamp: new Date(),
              status: 'processed',
            },
          ]);
        }
      }

      setMessages((prev) =>
        prev.map((m) => (m.id === uploadMessage.id ? { ...m, status: 'sent' } : m))
      );

      toast.success('Archivo procesado y enviado en batches correctamente');
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
    records,
    handleSendMessage,
    handleFileUpload,
  };
};
