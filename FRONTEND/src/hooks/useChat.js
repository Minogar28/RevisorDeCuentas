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
      if (data?.datos?.content?.[0]?.text) {
        let text = data.datos.content[0].text;
        // Quitar los ```json al inicio y ``` al final
        text = text.replace(/```json\s*/, '').replace(/```$/, '');
        webhookRecords = JSON.parse(text);
      }

      setRecords(webhookRecords); // guardamos los registros

      const systemResponse = {
        id: (Date.now() + 1).toString(),
        type: 'system',
        content: `Se han procesado ${webhookRecords.length} registros.`,
        timestamp: new Date(),
        status: 'processed',
      };
      setMessages(prev => [...prev, systemResponse]);
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

        // Extraer registros de la respuesta
        let batchRecords = [];
        if (batchData?.datos?.content?.[0]?.text) {
          let text = batchData.datos.content[0].text;
          text = text.replace(/```json\s*/, '').replace(/```$/, '');
          batchRecords = JSON.parse(text);
        }

        setRecords(prev => [...prev, ...batchRecords]);

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
