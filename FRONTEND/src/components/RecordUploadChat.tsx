import React, { useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  Typography,
  TextField,
  IconButton,
  Divider,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  ChatBubble as ChatBubbleIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from "@mui/icons-material";

type ChatBridge = {
  messages: any[];
  inputText: string;
  setInputText: (v: string) => void;
  handleSendMessage: () => Promise<void> | void;
  handleFileUpload: (e: any, ref: React.RefObject<HTMLInputElement>) => Promise<void> | void;
  isUploading: boolean;
};
export function RecordUploadChat({ chat }: { chat: ChatBridge }) {
  // 👇 usamos lo que viene del padre
  const { messages, inputText, setInputText, handleSendMessage, handleFileUpload, isUploading } = chat;

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);


  const getMessageStatusIcon = (status?: string) => {
    switch (status) {
      case "sending": return <CircularProgress size={16} color="primary" />;
      case "sent": return <CheckCircleIcon sx={{ fontSize: 16, color: "success.main" }} />;
      case "processed": return <CheckCircleIcon sx={{ fontSize: 16, color: "primary.main" }} />;
      case "error": return <ErrorIcon sx={{ fontSize: 16, color: "error.main" }} />;
      default: return null;
    }
  };

  return (
    <Card
      elevation={3}
      sx={{
        // MUY IMPORTANTE para que el contenido interno pueda hacer scroll
        height: "100%",
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        overflow: "hidden",
        border: "1px solid rgba(0,0,0,0.12)",
      }}
    >
      {/* Header fijo (sticky) */}
      <CardHeader
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 2,
          bgcolor: "primary.50",
          borderBottom: "1px solid rgba(0,0,0,0.12)",
          // opcional: efecto vidrio sutil
          backdropFilter: "blur(4px)",
        }}
        title={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ChatBubbleIcon sx={{ fontSize: 20, color: "primary.main" }} />
            <Typography variant="h6" color="primary.main">Carga de Registros</Typography>
          </Box>
        }
      />

      {/* Contenido: columna con área de mensajes scrollable + input fijo abajo */}
      <CardContent
        sx={{
          flex: 1,
          minHeight: 0,            // clave para que el Box de mensajes pueda calcular altura
          display: "flex",
          flexDirection: "column",
          p: 2,
          gap: 1,
        }}
      >
        {/* Área de mensajes con scroll propio */}
        <Box
          sx={{
            flex: 1,
            minHeight: 0,          // sin esto, el scroll a veces no aparece
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            pr: 0.5,               // un pelín para que no tape el scroll
          }}
        >
          {messages.map((msg) => (
            <Box
              key={msg.id}
              sx={{ display: "flex", justifyContent: msg.type === "user" ? "flex-end" : "flex-start" }}
            >
              <Box
                sx={{
                  maxWidth: "90%",
                  borderRadius: 3,
                  p: 2,
                  bgcolor: msg.type === "user" ? "primary.main" : "grey.100",
                  color: msg.type === "user" ? "common.white" : "text.primary",
                  wordBreak: "break-word",
                }}
              >
                <Typography variant="body2" sx={{ mb: 1 }}>{msg.content}</Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </Typography>
                  {msg.type === "user" && getMessageStatusIcon(msg.status)}
                </Box>
              </Box>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* Input + botones (altura fija) */}
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <TextField
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Escribe información del paciente..."
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
            variant="outlined"
            size="small"
            fullWidth
            sx={{
              borderRadius: 5,
              "& .MuiOutlinedInput-root": { borderRadius: 5 },
            }}
          />

          <Tooltip title="Enviar mensaje">
            <IconButton
              color="primary"
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              sx={{ borderRadius: 5, border: 1, borderColor: "grey.300", p: 1.25 }}
            >
              <SendIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Subir archivo Excel" arrow>
            <IconButton
              color="primary"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              sx={{ borderRadius: 5, border: 1, borderColor: "grey.300", p: 1.25 }}
            >
              {isUploading ? <CircularProgress size={16} /> : <AttachFileIcon />}
            </IconButton>
          </Tooltip>

          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => handleFileUpload(e, fileInputRef)}
            style={{ display: "none" }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
